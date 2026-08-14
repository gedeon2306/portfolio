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
            'id', 'email', 'role', 'is_active', 'is_staff', 
            'dfa', 'validate_code', 'created_at', 'password'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'validate_code': {'write_only': True}
        }
        read_only_fields = ['id', 'email', 'created_at']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer pour la mise à jour sans le mot de passe"""
    class Meta:
        model = User
        fields = [
            'id', 'email', 'role', 'is_active', 'is_staff', 
            'dfa', 'validate_code', 'created_at'
        ]
        read_only_fields = ['id', 'email', 'created_at']


class DashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dashboard
        fields = [
            'id', 'path', 'method', 'referrer', 'ip_address', 
            'user_agent', 'session_key', 'device_type', 'timestamp'
        ]
        read_only_fields = ['id', 'timestamp']


class MyInfoSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    cv = serializers.SerializerMethodField()
    class Meta:
        model = MyInfo
        fields = [
            'id', 'nom', 'prenom', 'email', 'telephone', 'localisation', 
            'profession', 'description1', 'description2', 'image', 'cv', 
            'formation', 'experience', 'passions', 'github', 'linkedin', 
            'instagram', 'twitter_x', 'tik_tok'
        ]
        read_only_fields = ['id']
        extra_kwargs = {
            'github': {'required': False, 'allow_blank': True, 'allow_null': True},
            'linkedin': {'required': False, 'allow_blank': True, 'allow_null': True},
            'instagram': {'required': False, 'allow_blank': True, 'allow_null': True},
            'twitter_x': {'required': False, 'allow_blank': True, 'allow_null': True},
            'tik_tok': {'required': False, 'allow_blank': True, 'allow_null': True},
        }
    
    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def get_cv(self, obj):
        if obj.cv:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cv.url)
            return obj.cv.url
        return None


class LanguesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Langues
        fields = ['id', 'langue', 'niveau']
        read_only_fields = ['id']


class SkillsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skills_list
        fields = ['id', 'skill', 'libelle', 'pourcentage']
        read_only_fields = ['id']


class SkillsSerializer(serializers.ModelSerializer):
    skills_list = SkillsListSerializer(many=True, read_only=True)
    
    class Meta:
        model = Skills
        fields = ['id', 'competence', 'skills_list']
        read_only_fields = ['id']


class TechnologiesSerializer(serializers.ModelSerializer):
    technologie_details = SkillsListSerializer(source='technologie', read_only=True)
    project_titre = serializers.ReadOnlyField(source='project.titre')
    
    class Meta:
        model = Technologies
        fields = ['id', 'project', 'project_titre', 'technologie', 'technologie_details']
        read_only_fields = ['id']


class ProjectsSerializer(serializers.ModelSerializer):
    tec_projets = TechnologiesSerializer(many=True, read_only=True)
    
    class Meta:
        model = Projects
        fields = [
            'id', 'titre', 'categorie', 'status', 'important', 
            'description', 'image', 'url', 'doc', 'code_source', 
            'created_at', 'updated_at', 'tec_projets'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProjectsListSerializer(serializers.ModelSerializer):
    """Serializer léger pour les listes de projets"""
    image = serializers.SerializerMethodField()
    technologies = serializers.SerializerMethodField()
    
    class Meta:
        model = Projects
        fields = [
            'id', 'titre', 'categorie', 'status', 'important', 
            'description', 'image', 'url', 'code_source',
            'created_at', 'updated_at', 'technologies'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def get_technologies(self, obj):
        return [tech.technologie.libelle for tech in obj.tec_projets.all()]


class CertificatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificates
        fields = [
            'id', 'titre', 'categorie', 'organisme', 'date', 
            'url', 'description', 'image', 'status', 'important', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class JournalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Journal
        fields = ['id', 'action', 'created_at']
        read_only_fields = ['id', 'created_at']


class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = ['id', 'titre_app', 'mode_maintenance', 'notification_email']
        read_only_fields = ['id']


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Ajout de claims personnalisés dans le token JWT
        # token['role'] = user.role
        token['username'] = 'Jihreldev'
        
        return token

