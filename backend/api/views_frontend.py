import logging
from django.conf import settings
from django.core.mail import EmailMessage
from django.utils.timezone import datetime
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .serializers import ( 
    SettingsSerializer 
)

from django.conf import settings

from .models import Certificates, Dashboard, Langues, MyInfo, Projects, Settings, Skills_list

logger = logging.getLogger(__name__)


def _error_server():
    return Response({
        "error": "Une erreur est survenue, reesayez plus tard !"},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )


def _unauthorized(texte):
    return Response(
        {"error": f"Vous n'êtes pas autorisé à {texte}."},
        status=status.HTTP_401_UNAUTHORIZED,
    )


def _check_api_key(cle):
    if cle != settings.PORTFOLIO_API_KEY:
        return _unauthorized("utiliser cette ressource")
    return None


@api_view(['GET'])
@permission_classes([AllowAny])
def settings_public(request):
    try:
        config = Settings.objects.first()
        
        # Récupérer les informations MyInfo pour le lien LinkedIn
        my_info = MyInfo.objects.order_by('-id').first()
        linkedin = my_info.linkedin if my_info else None

        if not config:
            return Response({
                "settings": {
                    "mode_maintenance": False,
                    "notification_email": True,
                    "linkedin": linkedin
                }
            }, status=status.HTTP_200_OK)
            
        # Sérialiser les données de settings et ajouter linkedin
        settings_data = SettingsSerializer(config).data
        settings_data['linkedin'] = linkedin
        
        return Response({"settings": settings_data}, status=status.HTTP_200_OK)

    except Exception as e:
        logger.exception(f"Erreur dans settings_public: {str(e)}")
        return _error_server()


@api_view(['GET'])
@permission_classes([AllowAny])
def frontend_about(request):
    """Retourne les informations publiques à afficher sur la page About."""
    info = MyInfo.objects.order_by('-id').first()
    langues = Langues.objects.all().order_by('langue')

    photo = None
    if info and info.image:
        photo = request.build_absolute_uri(info.image.url)
        
    cv = None
    if info and info.image:
        cv = request.build_absolute_uri(info.cv.url)

    payload = {
        'nom': info.nom if info else '',
        'prenom': info.prenom if info else '',
        'description1': info.description1 if info else '',
        'description2': info.description2 if info else '',
        'photo': photo,
        'cv': cv,
        'langues': [
            {
                'id': str(langue.id),
                'langue': langue.langue,
                'niveau': langue.niveau,
            }
            for langue in langues
        ],
    }

    return Response(payload, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def frontend_skills(request):
    """
    Retourne les compétences publiques à afficher sur la page Skills.
    Les compétences sont triées par pourcentage décroissant.
    """
    try:
        # Définir l'ordre personnalisé souhaité
        CATEGORY_ORDER = [
            'Frontend & UI Engineering', 
            'Backend & Architectures', 
            'Bases de Données & Stockage', 
            'Language de programmation',
            'Basique & Design',
            'DevOps, Cloud & Outillage'
        ]
                
        # Récupérer toutes les compétences avec leurs niveaux, triées par pourcentage décroissant
        skills_list = Skills_list.objects.select_related('skill').all().order_by('-pourcentage')
        
        # Grouper par catégorie (skill)
        grouped_skills = {}
        for skill_item in skills_list:
            category_name = skill_item.skill.competence
            if category_name not in grouped_skills:
                grouped_skills[category_name] = []
            
            grouped_skills[category_name].append({
                'id': str(skill_item.id),
                'libelle': skill_item.libelle,
                'pourcentage': skill_item.pourcentage,
            })
        
        # Fonction pour déterminer l'index de tri d'une catégorie
        def get_category_priority(category_name):
            try:
                return CATEGORY_ORDER.index(category_name)
            except ValueError:
                return len(CATEGORY_ORDER)
        
        # Construire le payload en triant selon l'ordre défini
        sorted_categories = sorted(grouped_skills.keys(), key=get_category_priority)

        payload = {
            'competences': [
                {
                    'categorie': category,
                    'skills': grouped_skills[category]
                }
                for category in sorted_categories
            ]
        }
        
        return Response(payload, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.exception(f"Erreur dans frontend_skills: {str(e)}")
        return _error_server()


@api_view(['GET'])
@permission_classes([AllowAny])
def frontend_certificates(request):
    """
    Retourne toutes les certifications publiques (status=True) pour la page des certificats.
    Tri : d'abord les plus importantes (important=True), puis par date décroissante.
    """
    try:
        # Récupérer toutes les certifications avec status=True
        certificates = Certificates.objects.filter(status=True).order_by('-important', '-date')
        
        # Construire le payload
        payload = {
            'certificats': [
                {
                    'id': str(cert.id),
                    'categorie': cert.categorie,
                    'titre': cert.titre,
                    'description': cert.description,
                    'organisme': cert.organisme,
                    'date': cert.date.strftime('%d/%m/%Y'),
                    'credentialId': f"{cert.organisme[:4].upper()}-{str(cert.id)[:8].upper()}",
                    'url': cert.url,
                    'image': request.build_absolute_uri(cert.image.url) if cert.image else None,
                    'important': cert.important,
                }
                for cert in certificates
            ]
        }
        
        return Response(payload, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.exception(f"Erreur dans frontend_certificates: {str(e)}")
        return _error_server()


@api_view(['GET'])
@permission_classes([AllowAny])
def frontend_certificates_highlights(request):
    """
    Retourne les certifications mises en avant (important=True et status=True) 
    pour le composant d'accueil.
    Tri par date décroissante.
    """
    try:
        # Récupérer les certifications importantes et actives
        certificates = Certificates.objects.filter(
            status=True, 
            important=True
        ).order_by('-date')
        
        # Construire le payload
        payload = {
            'certificats': [
                {
                    'id': str(cert.id),
                    'categorie': cert.categorie,
                    'titre': cert.titre,
                    'description': cert.description,
                    'organisme': cert.organisme,
                    'date': cert.date.strftime('%d/%m/%Y'),
                    'credentialId': f"{cert.organisme[:4].upper()}-{str(cert.id)[:8].upper()}",
                    'url': cert.url,
                    'image': request.build_absolute_uri(cert.image.url) if cert.image else None,
                    'important': cert.important,
                }
                for cert in certificates
            ]
        }
        
        return Response(payload, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.exception(f"Erreur dans frontend_certificates_highlights: {str(e)}")
        return _error_server()


@api_view(['GET'])
@permission_classes([AllowAny])
def frontend_projects(request):
    """
    Retourne tous les projets publics (status=True) pour la page des projets.
    Tri : d'abord les plus importants (important=True), puis par date de création décroissante.
    """
    try:
        projects = Projects.objects.filter(status=True).prefetch_related(
            'tec_projets__technologie'
        ).order_by('-important', '-created_at')

        payload = {
            'projets': [
                {
                    'id': str(project.id),
                    'categorie': project.categorie,
                    'titre': project.titre,
                    'description': project.description,
                    'image': request.build_absolute_uri(project.image.url) if project.image else None,
                    'url': project.url,
                    'codeSource': project.code_source,
                    'important': project.important,
                    'date': project.created_at.strftime('%d/%m/%Y'),
                    'technologies': [
                        tech.technologie.libelle
                        for tech in project.tec_projets.all()
                    ],
                }
                for project in projects
            ]
        }

        return Response(payload, status=status.HTTP_200_OK)

    except Exception as e:
        logger.exception(f"Erreur dans frontend_projects: {str(e)}")
        return _error_server()


@api_view(['GET'])
@permission_classes([AllowAny])
def frontend_projects_highlights(request):
    """
    Retourne les projets mis en avant (important=True et status=True)
    pour le composant d'accueil.
    """
    try:
        projects = Projects.objects.filter(
            status=True,
            important=True
        ).prefetch_related('tec_projets__technologie').order_by('created_at')

        payload = {
            'projets': [
                {
                    'id': str(project.id),
                    'categorie': project.categorie,
                    'titre': project.titre,
                    'description': project.description,
                    'image': request.build_absolute_uri(project.image.url) if project.image else None,
                    'url': project.url,
                    'codeSource': project.code_source,
                    'important': project.important,
                    'date': project.created_at.strftime('%d/%m/%Y'),
                    'technologies': [
                        tech.technologie.libelle
                        for tech in project.tec_projets.all()
                    ],
                }
                for project in projects
            ]
        }

        return Response(payload, status=status.HTTP_200_OK)

    except Exception as e:
        logger.exception(f"Erreur dans frontend_projects_highlights: {str(e)}")
        return _error_server()


@api_view(['GET'])
@permission_classes([AllowAny])
def frontend_contact(request):
    """
    Retourne les informations de contact publiques.
    """
    try:
        info = MyInfo.objects.order_by('-id').first()
        
        if not info:
            return Response({
                'profession': '',
                'email': '',
                'localisation': '',
                'telephone': '',
                'github': None,
                'linkedin': None,
                'instagram': None,
                'twitter_x': None,
                'tik_tok': None,
            }, status=status.HTTP_200_OK)
        
        payload = {
            'profession': info.profession,
            'email': info.email,
            'localisation': info.localisation,
            'telephone': info.telephone,
            'github': info.github,
            'linkedin': info.linkedin,
            'instagram': info.instagram,
            'twitter_x': info.twitter_x,
            'tik_tok': info.tik_tok,
        }
        
        return Response(payload, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.exception(f"Erreur dans frontend_contact: {str(e)}")
        return _error_server()


@api_view(['POST'])
@permission_classes([AllowAny])
def send_contact_email(request):
    """
    Envoie un email de contact et une réponse automatique à l'expéditeur.
    """
    try:
        data = request.data
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject', 'Nouveau message du portfolio')
        message = data.get('message')
        api_key= data.get('apiKey')
        
        api_key_error = _check_api_key(api_key)
        if api_key_error:
            return api_key_error
        
        # Validation des champs requis
        if not name or not email or not message:
            return Response(
                {"error": "Tous les champs obligatoires doivent être remplis."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        
        admin_email = EmailMessage(
            subject=f"[Portfolio] Nouveau message de {name}",
            body=(
                f"Vous avez reçu un nouveau message de votre portfolio.\n"
                f"De : {name} ({email})\n\n"
                f"Sujet : {subject}\n"
                f"Message :\n"
                f"{message}\n"
            ),
            from_email=settings.EMAIL_HOST_USER,
            to=[settings.EMAIL_USER],
            reply_to=[email],
        )
        
        user_email = EmailMessage(
            subject="Confirmation de réception - Votre message a bien été envoyé",
            body=(
                f"Bonjour M./Mme {name},\n\n"

                f"Je vous confirme la réception de votre message avec le sujet :\n"
                f"{subject}\n\n"
                f"Je prendrai connaissance de votre demande dans les plus brefs "
                f"délais et vous répondrai personnellement.\n\n"

                f"En attendant, n'hésitez pas à consulter mon portfolio pour "
                f"découvrir mes réalisations : "
                f"{settings.FRONTEND_URL + "/projects/?source=signature"}\n\n"

                f"Cordialement, JihrelDev\n\n"
                
                f"Cet email est une confirmation automatique. "
                f"Merci de ne pas y répondre directement.\n"
                f"© {datetime.now().year} - Tous droits réservés"
            ),
            from_email=settings.EMAIL_HOST_USER,
            to=[email],
        )
        
        # Envoyer les emails
        admin_email.send(fail_silently=False)
        user_email.send(fail_silently=False)
        
        return Response(
            {"success": "Votre message a été envoyé avec succès. Vous recevrez une confirmation par email."},
            status=status.HTTP_200_OK
        )
        
    except Exception as e:
        logger.exception(f"Erreur lors de l'envoi du mail de contact: {str(e)}")
        return Response(
            {"error": "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer plus tard."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def track_page_view(request):
    try:
        data = request.data
        
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        
        Dashboard.objects.create(
            path=data.get('path', '/'),
            method='GET',
            referrer=data.get('referrer', ''),
            source=data.get('source', ''),
            ip_address=ip,
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:255],
            session_key=request.session.session_key,
            device_type=data.get('device_type', 'other'),
        )
        
        return Response({'status': 'ok'}, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'status': 'error', 'detail': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
