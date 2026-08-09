from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from drf_spectacular.utils import extend_schema_field
from .models import (
    User, Dashboard, MyInfo, Langues, Skills, Skills_list, 
    Projects, Technologies, Certificates, Journal, Settings
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'role', 'is_active', 'is_staff', 
            'dfa', 'validate_code', 'created_at', 'password'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'validate_code': {'write_only': True}
        }
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer pour la mise à jour sans le mot de passe"""
    class Meta:
        model = User
        fields = [
            'id', 'username', 'role', 'is_active', 'is_staff', 
            'dfa', 'validate_code', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
