import random
import string
import base64
import io
from io import BytesIO
from PIL import Image
from decimal import Decimal, InvalidOperation

from django.shortcuts import render, redirect
from django.conf import settings
from django.db import models
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
        
