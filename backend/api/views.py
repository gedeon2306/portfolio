import random
import string
import base64
import io
import json
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
    UserSerializer, 
    UserUpdateSerializer,
    DashboardSerializer,
    MyInfoSerializer,
    LanguesSerializer,
    SkillsSerializer,
    SkillsListSerializer,
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
        recent_activity = Journal.objects.all().order_by('-created_at')[:3]
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
        # --- Lecture ---
        if request.method == 'GET':
            instance = MyInfo.objects.first()
            langues = Langues.objects.all()
            return Response({
                "info": MyInfoSerializer(instance, context={'request': request}).data if instance else None,
                "langues": LanguesSerializer(langues, many=True).data,
            }, status=status.HTTP_200_OK)

        # --- Création / Mise à jour (upsert) ---
        data = dict(request.data)

        # 'langues' arrive en JSON stringifié (FormData ne transporte que des chaînes)
        raw_langues = data.pop('langues', None)
        try:
            langues_payload = json.loads(raw_langues) if raw_langues else []
        except (TypeError, ValueError):
            return _bad_request("Liste des langues")

        instance = MyInfo.objects.first()

        with transaction.atomic():
            if instance:
                serializer = MyInfoSerializer(instance, data=data, partial=True, context={'request': request})
                action_text = "Mise à jour des informations personnelles"
            else:
                serializer = MyInfoSerializer(data=data, context={'request': request})
                action_text = "Création des informations personnelles"

            if not serializer.is_valid():
                return _bad_request("Informations personnelles")

            saved_info = serializer.save()

            if str(data.get('remove_image', '')).lower() == 'true' and saved_info.image:
                saved_info.image.delete(save=True)
            if str(data.get('remove_cv', '')).lower() == 'true' and saved_info.cv:
                saved_info.cv.delete(save=True)

            # --- Synchronisation des langues ---
            valid_niveaux = dict(Langues.NIVEAUX_CHOICES)
            existing_ids = set(str(i) for i in Langues.objects.values_list('id', flat=True))
            kept_ids = set()

            for item in langues_payload:
                langue_id = str(item.get('id') or '')
                langue_nom = (item.get('langue') or '').strip()
                niveau = item.get('niveau') or ''

                if not langue_nom or niveau not in valid_niveaux:
                    continue

                if langue_id and langue_id in existing_ids:
                    Langues.objects.filter(id=langue_id).update(langue=langue_nom, niveau=niveau)
                    kept_ids.add(langue_id)
                else:
                    new_langue = Langues.objects.create(langue=langue_nom, niveau=niveau)
                    kept_ids.add(str(new_langue.id))

            ids_to_delete = existing_ids - kept_ids
            if ids_to_delete:
                Langues.objects.filter(id__in=ids_to_delete).delete()

            log_journal(action_text)

        langues = Langues.objects.all()
        return Response({
            "info": MyInfoSerializer(saved_info, context={'request': request}).data,
            "langues": LanguesSerializer(langues, many=True).data,
        }, status=status.HTTP_200_OK)

    except Exception:
        return _error_server()