import logging

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .serializers import ( 
    SettingsSerializer 
)

from django.conf import settings

from .models import Langues, MyInfo, Settings, Skills_list

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
    if cle != settings.PORTFOLIO_API_KEY:
        return _unauthorized("utiliser cette ressource")
    return None

@api_view(['GET'])
@permission_classes([AllowAny])
def settings_public(request):
    try:
        config = Settings.objects.first()

        if not config:
            return Response({"settings": None}, status=status.HTTP_200_OK)
        return Response({"settings": SettingsSerializer(config).data}, status=status.HTTP_200_OK)

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
        
        # Construire le payload
        payload = {
            'competences': [
                {
                    'categorie': category,
                    'skills': skills
                }
                for category, skills in grouped_skills.items()
            ]
        }
        
        return Response(payload, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.exception(f"Erreur dans frontend_skills: {str(e)}")
        return _error_server()

