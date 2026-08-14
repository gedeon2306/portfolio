import random
import string
import base64
import io
import json
import logging
from io import BytesIO
from PIL import Image
from decimal import Decimal, InvalidOperation

from django.shortcuts import render, redirect
from django.conf import settings
from django.db import models, transaction
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.models import BaseUserManager

from .tokens import email_confirmation_token_generator
from .email_utils import send_login_email

from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

from drf_spectacular.utils import extend_schema, inline_serializer, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from rest_framework import serializers as drf_serializers

from .models import (
    User, Dashboard, MyInfo, Langues, Skills, Skills_list, 
    Projects, Technologies, Certificates, Journal, Settings
)

from .serializers import (
    DashboardSerializer,
    MyInfoSerializer,
    LanguesSerializer,
    ProjectsSerializer,
    TechnologiesSerializer,
    CertificatesSerializer,
    JournalSerializer,
    SettingsSerializer,
    MyTokenObtainPairSerializer
)

from django.db.models import Q, Case, When, Value, IntegerField, Count, Sum
from django.utils import timezone
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

def _error_server():
    return Response({
        "error": "Une erreur est survenue, reesayez plus tard !"},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )


def _forbidden(texte):
    return Response(
        {"error": f"Vous n'avez pas les droits pour {texte}."},
        status=status.HTTP_403_FORBIDDEN,
    )


def _not_found(texte):
    return Response(
        {"error": f"{texte} introuvable."},
        status=status.HTTP_404_NOT_FOUND,
    )


def _bad_request(texte):
    return Response(
        {"error": f"{texte} invalide."},
        status=status.HTTP_400_BAD_REQUEST,
    )


def _unauthorized(texte):
    return Response(
        {"error": f"Vous n'êtes pas autorisé à {texte}."},
        status=status.HTTP_401_UNAUTHORIZED,
    )


def _check_api_key(cle):
    if cle != settings.ADMIN_API_KEY:
        return _unauthorized("utiliser cette ressource")
    return None


def log_journal(action_text):
    Journal.objects.create(action=action_text)


@extend_schema(
    tags=["Auth"],
    summary="Connexion utilisateur avec envoi d'email",
    description="Valide les identifiants de l'utilisateur (email/mot de passe). Si valides, envoie un email de notification de connexion et retourne les jetons JWT (Access/Refresh).",
    request=inline_serializer(
        name="LoginRequest",
        fields={
            "email": drf_serializers.EmailField(),
            "password": drf_serializers.CharField(),
        }
    ),
    responses={
        200: inline_serializer(
            name="LoginSuccess",
            fields={
                "message": drf_serializers.CharField(),
                "access": drf_serializers.CharField(),
                "refresh": drf_serializers.CharField(),
            }
        ),
        400: inline_serializer(
            name="LoginError",
            fields={"error": drf_serializers.CharField()}
        ),
    },
)
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email', '').strip().lower()
    password = request.data.get('password', '')
    api_key = request.data.get('apiKey', '')

    if not email or not password:
        return _bad_request("Email ou mot de passe")

    api_key_error = _check_api_key(api_key)
    if api_key_error:
        return api_key_error

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return _bad_request("Email ou mot de passe")

    if not user.check_password(password):
        return _bad_request("Email ou mot de passe")
    
    if not user.dfa:
        refresh = MyTokenObtainPairSerializer.get_token(user)
        return Response({
            "message": f"Connexion réussie, bienvenue JihrelDev .",
            "dfa": user.dfa,
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=status.HTTP_200_OK)

    code = str(random.randint(100000, 999999))
    user.validate_code = code
    user.save()
    
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = email_confirmation_token_generator.make_token(user)

    # Envoi de l'email de notification
    try:
        send_login_email(user)
    except Exception:
        return _error_server()

    return Response({
        "message": "Connexion réussie. Un email de confirmation a été envoyé.",
        "dfa": user.dfa,
        "uid": uidb64,
        "token": token
    }, status=status.HTTP_200_OK)


@extend_schema(
    tags=["Auth"],
    summary="Confirmer le code de connexion envoyé par email",
    description="Valide le code de connexion envoyé par email. Si valide, retourne les jetons JWT (Access/Refresh).",
    request=inline_serializer(
        name="LoginConfirmationRequest",
        fields={
            "uidb64": drf_serializers.CharField(),
            "token": drf_serializers.CharField(),
            "code": drf_serializers.CharField(),
        }
    ),
    responses={
        200: inline_serializer(
            name="LoginConfirmationSuccess",
            fields={
                "message": drf_serializers.CharField(),
                "access": drf_serializers.CharField(),
                "refresh": drf_serializers.CharField(),
            }
        ),
        400: inline_serializer(
            name="LoginConfirmationError",
            fields={
                "error": drf_serializers.CharField(),
            }
        ),
    },
)
@api_view(['POST'])
@permission_classes([AllowAny])
def confirm_login(request):
    uidb64 = request.data.get('uid', '')
    token = request.data.get('token', '')
    code = request.data.get('code', '')
    api_key = request.data.get('apiKey', '')
    
    if not uidb64 or not token or not code:
        return  _bad_request("Données de confirmation manquantes.")
    
    api_key_error = _check_api_key(api_key)
    if api_key_error:
        return api_key_error

    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return _bad_request("Utilisateur introuvable.")

    if not email_confirmation_token_generator.check_token(user, token):
        return _bad_request("Lien de confirmation invalide ou expiré.")

    if user.validate_code != str(code):
        return _bad_request("Code de confirmation incorrect.")
    
    user.validate_code = ''
    user.save()

    refresh = MyTokenObtainPairSerializer.get_token(user)
    return Response({
        "message": f"Connexion réussie, bienvenue JihrelDev.",
        "access": str(refresh.access_token),
        "refresh": str(refresh)
    }, status=status.HTTP_200_OK)
        

class DashboardPageViewsPagination(PageNumberPagination):
    page_size = 10


@extend_schema(
    tags=["Dashboard"],
    summary="Données de la page d'accueil du dashboard",
    description="Retourne les statistiques globales, l'activité récente et le journal des pages vues (recherche, filtre par appareil, pagination).",
    parameters=[
        OpenApiParameter(name="search", type=OpenApiTypes.STR, required=False, description="Recherche par chemin, referrer ou IP"),
        OpenApiParameter(name="device", type=OpenApiTypes.STR, required=False, description="Filtre : all | desktop | mobile | tablet | bot | other"),
        OpenApiParameter(name="page", type=OpenApiTypes.INT, required=False, description="Numéro de page (pagination de 10)"),
    ],
    responses={
        200: inline_serializer(
            name="DashboardHomeSuccess",
            fields={
                "stats": drf_serializers.DictField(),
                "recent_activity": JournalSerializer(many=True),
                "page_views": drf_serializers.DictField(),
            }
        ),
        401: inline_serializer(name="DashboardHomeError", fields={"error": drf_serializers.CharField()}),
    },
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_home(request):
    try:
        now = timezone.now()
        last_30_days = now - timedelta(days=30)
        previous_30_days = last_30_days - timedelta(days=30)
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        # --- Cartes statistiques ---
        projects_count = Projects.objects.count()
        projects_this_month = Projects.objects.filter(created_at__gte=start_of_month).count()

        visits_last_30 = Dashboard.objects.filter(timestamp__gte=last_30_days).count()
        visits_previous_30 = Dashboard.objects.filter(
            timestamp__gte=previous_30_days, timestamp__lt=last_30_days
        ).count()
        if visits_previous_30 > 0:
            visits_trend = round(((visits_last_30 - visits_previous_30) / visits_previous_30) * 100)
        else:
            visits_trend = 100 if visits_last_30 > 0 else 0

        skills_count = Skills.objects.count()
        skills_categories = Skills.objects.values('competence').distinct().count()

        certificates_count = Certificates.objects.count()

        stats = {
            "projects": {
                "value": projects_count,
                "trend": f"+{projects_this_month} ce mois",
            },
            "visits": {
                "value": visits_last_30,
                "trend": f"{'+' if visits_trend >= 0 else ''}{visits_trend}%",
            },
            "skills": {
                "value": skills_count,
                "trend": f"{skills_categories} catégories",
            },
            "certificates": {
                "value": certificates_count,
                "trend": "Encore plus",
            },
        }

        # --- Activité récente (Journal) ---
        recent_activity = Journal.objects.all().order_by('-created_at')[:5]
        activity_data = JournalSerializer(recent_activity, many=True).data

        # --- Journal des pages vues (recherche + filtre + pagination) ---
        search = request.query_params.get('search', '').strip()
        device = request.query_params.get('device', 'all')

        page_views_qs = Dashboard.objects.all()

        if device and device != 'all':
            page_views_qs = page_views_qs.filter(device_type=device)

        if search:
            page_views_qs = page_views_qs.filter(
                Q(path__icontains=search) |
                Q(referrer__icontains=search) |
                Q(ip_address__icontains=search)
            )

        page_views_qs = page_views_qs.order_by('-timestamp')

        paginator = DashboardPageViewsPagination()
        paginated_views = paginator.paginate_queryset(page_views_qs, request)
        page_views_data = {
            "count": paginator.page.paginator.count,
            "next": paginator.get_next_link(),
            "previous": paginator.get_previous_link(),
            "results": DashboardSerializer(paginated_views, many=True).data,
        }

        return Response({
            "stats": stats,
            "recent_activity": activity_data,
            "page_views": page_views_data,
        }, status=status.HTTP_200_OK)

    except Exception:
        return _error_server()
    

@extend_schema(
    tags=["MyInfo"],
    summary="Récupérer ou mettre à jour Mes Informations",
    description=(
        "GET : retourne les informations personnelles et la liste des langues. "
        "POST : crée les informations si aucune n'existe, sinon les met à jour (upsert), "
        "et synchronise la liste des langues envoyée (ajout / modification / suppression)."
    ),
    request=inline_serializer(
        name="MyInfoUpdateRequest",
        fields={
            "nom": drf_serializers.CharField(required=False),
            "prenom": drf_serializers.CharField(required=False),
            "email": drf_serializers.EmailField(required=False),
            "telephone": drf_serializers.CharField(required=False),
            "localisation": drf_serializers.CharField(required=False),
            "profession": drf_serializers.CharField(required=False),
            "description1": drf_serializers.CharField(required=False),
            "description2": drf_serializers.CharField(required=False),
            "image": drf_serializers.CharField(required=False, allow_blank=True),
            "cv": drf_serializers.CharField(required=False, allow_blank=True),
            "formation": drf_serializers.CharField(required=False),
            "experience": drf_serializers.CharField(required=False),
            "passions": drf_serializers.CharField(required=False),
            "github": drf_serializers.URLField(required=False, allow_blank=True),
            "linkedin": drf_serializers.URLField(required=False, allow_blank=True),
            "instagram": drf_serializers.URLField(required=False, allow_blank=True),
            "twitter_x": drf_serializers.URLField(required=False, allow_blank=True),
            "tik_tok": drf_serializers.URLField(required=False, allow_blank=True),
            "langues": drf_serializers.ListField(
                child=drf_serializers.DictField(), required=False,
                help_text="Liste d'objets {id?, langue, niveau}"
            ),
        }
    ),
    responses={
        200: inline_serializer(
            name="MyInfoSuccess",
            fields={
                "info": MyInfoSerializer(),
                "langues": LanguesSerializer(many=True),
            }
        ),
        400: inline_serializer(name="MyInfoError", fields={"error": drf_serializers.CharField()}),
    },
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def my_info(request):
    try:
        if request.method == 'GET':
            info = MyInfo.objects.first()
            langues = Langues.objects.all().order_by('langue')

            return Response({
                "info": MyInfoSerializer(info, context={'request': request}).data if info else None,
                "langues": LanguesSerializer(langues, many=True).data,
            }, status=status.HTTP_200_OK)

        # --- POST : upsert MyInfo + synchronisation des langues ---
        info = MyInfo.objects.first()
        is_creation = info is None

        text_fields = [
            'nom', 'prenom', 'email', 'telephone', 'localisation', 'profession',
            'description1', 'description2', 'formation', 'experience', 'passions',
            'github', 'linkedin', 'instagram', 'twitter_x', 'tik_tok',
        ]
        
        data = {}
        for field in text_fields:
            if field in request.data:
                value = request.data.get(field)
                data[field] = value if value is not None else ''
            elif field in request.POST:
                value = request.POST.get(field)
                data[field] = value if value is not None else ''

        # Gestion image
        if 'image' in request.FILES:
            data['image'] = request.FILES['image']
        elif request.data.get('remove_image') == 'true' or request.POST.get('remove_image') == 'true':
            if info and info.image:
                info.image.delete(save=False)
            data['image'] = None

        # Gestion cv
        if 'cv' in request.FILES:
            data['cv'] = request.FILES['cv']
        elif request.data.get('remove_cv') == 'true' or request.POST.get('remove_cv') == 'true':
            if info and info.cv:
                info.cv.delete(save=False)
            data['cv'] = None

        with transaction.atomic():
            if info is None:
                serializer = MyInfoSerializer(data=data, context={'request': request})
            else:
                serializer = MyInfoSerializer(info, data=data, partial=True, context={'request': request})

            if not serializer.is_valid():
                logger.error(f"Erreurs de validation MyInfo: {serializer.errors}")
                return Response(
                    {"error": "Données invalides", "details": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            info = serializer.save()
            log_journal("Ajout de vos informations" if is_creation else "Mise à jour de vos informations")

            # --- Synchronisation des langues ---
            langues_payload = []
            langues_raw = request.data.get('langues')
            if langues_raw is None:
                langues_raw = request.POST.get('langues')
            
            if langues_raw:
                try:
                    if isinstance(langues_raw, str):
                        langues_payload = json.loads(langues_raw)
                    elif isinstance(langues_raw, list):
                        langues_payload = langues_raw
                except (json.JSONDecodeError, TypeError) as e:
                    logger.warning(f"Erreur de parsing des langues: {e}")
                    langues_payload = []

            if not isinstance(langues_payload, list):
                langues_payload = []

            existing = {str(l.id): l for l in Langues.objects.all()}
            sent_ids = set()
            valid_niveaux = dict(Langues.NIVEAUX_CHOICES)

            added, updated = 0, 0

            for item in langues_payload:
                if not isinstance(item, dict):
                    continue
                    
                item_id = item.get('id')
                langue_val = (item.get('langue') or '').strip()
                niveau_val = item.get('niveau')

                if not langue_val or niveau_val not in valid_niveaux:
                    continue

                if item_id and item_id in existing:
                    sent_ids.add(item_id)
                    langue_obj = existing[item_id]
                    if langue_obj.langue != langue_val or langue_obj.niveau != niveau_val:
                        langue_obj.langue = langue_val
                        langue_obj.niveau = niveau_val
                        langue_obj.save()
                        updated += 1
                else:
                    Langues.objects.create(langue=langue_val, niveau=niveau_val)
                    added += 1

            removed_ids = set(existing.keys()) - sent_ids
            removed = len(removed_ids)
            if removed_ids:
                Langues.objects.filter(id__in=removed_ids).delete()

            if added:
                log_journal(f"Ajout de {added} langue(s)")
            if updated:
                log_journal(f"Modification de {updated} langue(s)")
            if removed:
                log_journal(f"Suppression de {removed} langue(s)")

        langues = Langues.objects.all().order_by('langue')
        return Response({
            "info": MyInfoSerializer(info, context={'request': request}).data,
            "langues": LanguesSerializer(langues, many=True).data,
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.exception(f"Erreur interne dans my_info: {str(e)}")
        return _error_server()


def _serialize_skill_categories():
    """Formate les catégories + compétences dans le format attendu par le frontend
    (SkillCategory { id, title, skills: SkillItem[] })."""
    categories = Skills.objects.all().order_by('competence')
    data = []
    for cat in categories:
        skills_qs = cat.skills_list.all().order_by('libelle')
        data.append({
            "id": str(cat.id),
            "title": cat.competence,
            "skills": [
                {
                    "id": str(s.id),
                    "libelle": s.libelle,
                    "pourcentage": s.pourcentage,
                }
                for s in skills_qs
            ],
        })
    return data


@extend_schema(
    tags=["Skills"],
    summary="Récupérer ou mettre à jour les compétences",
    description=(
        "GET : retourne toutes les catégories avec leurs compétences. "
        "POST : synchronise les catégories et compétences envoyées "
        "(ajout / modification / suppression), à la manière des langues dans MyInfo."
    ),
    request=inline_serializer(
        name="SkillsUpdateRequest",
        fields={
            "categories": drf_serializers.ListField(
                child=drf_serializers.DictField(),
                required=True,
                help_text="Liste de catégories {id?, title, skills: [{id?, libelle, pourcentage}]}",
            ),
        }
    ),
    responses={
        200: inline_serializer(
            name="SkillsSuccess",
            fields={"categories": drf_serializers.ListField()},
        ),
        400: inline_serializer(name="SkillsError", fields={"error": drf_serializers.CharField()}),
    },
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def skills_management(request):
    try:
        if request.method == 'GET':
            return Response({"categories": _serialize_skill_categories()}, status=status.HTTP_200_OK)

        # --- POST : synchronisation complète des catégories et de leurs compétences ---
        categories_payload = request.data.get('categories', [])
        if isinstance(categories_payload, str):
            try:
                categories_payload = json.loads(categories_payload)
            except (json.JSONDecodeError, TypeError):
                categories_payload = []

        if not isinstance(categories_payload, list):
            return _bad_request("Format des catégories")

        existing_categories = {str(c.id): c for c in Skills.objects.all()}
        sent_cat_ids = set()
        cat_added, cat_updated = 0, 0
        skill_added, skill_updated, skill_removed = 0, 0, 0

        with transaction.atomic():
            for cat_item in categories_payload:
                if not isinstance(cat_item, dict):
                    continue

                cat_id = cat_item.get('id')
                title = (cat_item.get('title') or '').strip()
                skills_payload = cat_item.get('skills', [])

                if not title:
                    continue

                if cat_id and str(cat_id) in existing_categories:
                    sent_cat_ids.add(str(cat_id))
                    category = existing_categories[str(cat_id)]
                    if category.competence != title:
                        category.competence = title
                        category.save()
                        cat_updated += 1
                else:
                    category = Skills.objects.create(competence=title)
                    sent_cat_ids.add(str(category.id))
                    cat_added += 1

                # --- Synchronisation des compétences de cette catégorie ---
                if not isinstance(skills_payload, list):
                    skills_payload = []

                existing_skills = {str(s.id): s for s in category.skills_list.all()}
                sent_skill_ids = set()

                for skill_item in skills_payload:
                    if not isinstance(skill_item, dict):
                        continue

                    skill_id = skill_item.get('id')
                    libelle = (skill_item.get('libelle') or '').strip()

                    try:
                        pourcentage = int(skill_item.get('pourcentage'))
                    except (TypeError, ValueError):
                        continue

                    if not libelle or pourcentage < 0 or pourcentage > 100:
                        continue

                    if skill_id and str(skill_id) in existing_skills:
                        sent_skill_ids.add(str(skill_id))
                        skill_obj = existing_skills[str(skill_id)]
                        if skill_obj.libelle != libelle or skill_obj.pourcentage != pourcentage:
                            skill_obj.libelle = libelle
                            skill_obj.pourcentage = pourcentage
                            skill_obj.save()
                            skill_updated += 1
                    else:
                        Skills_list.objects.create(
                            skill=category, libelle=libelle, pourcentage=pourcentage
                        )
                        skill_added += 1

                removed_skill_ids = set(existing_skills.keys()) - sent_skill_ids
                if removed_skill_ids:
                    Skills_list.objects.filter(id__in=removed_skill_ids).delete()
                    skill_removed += len(removed_skill_ids)

            # Catégories envoyées côté frontend = source de vérité -> on supprime celles absentes
            removed_cat_ids = set(existing_categories.keys()) - sent_cat_ids
            cat_removed = len(removed_cat_ids)
            if removed_cat_ids:
                Skills.objects.filter(id__in=removed_cat_ids).delete()

            if cat_added:
                log_journal(f"Ajout de {cat_added} catégorie(s) de compétences")
            if cat_updated:
                log_journal(f"Modification de {cat_updated} catégorie(s) de compétences")
            if cat_removed:
                log_journal(f"Suppression de {cat_removed} catégorie(s) de compétences")
            if skill_added:
                log_journal(f"Ajout de {skill_added} compétence(s)")
            if skill_updated:
                log_journal(f"Modification de {skill_updated} compétence(s)")
            if skill_removed:
                log_journal(f"Suppression de {skill_removed} compétence(s)")

        return Response({"categories": _serialize_skill_categories()}, status=status.HTTP_200_OK)

    except Exception as e:
        logger.exception(f"Erreur dans skills_management: {str(e)}")
        return _error_server()



