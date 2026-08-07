from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from drf_spectacular.utils import extend_schema_field
from .models import User, Dashboard, MyInfo, Langues, Skills, Skills_list, Projects, Technologies, Certificates, Journal, Settings