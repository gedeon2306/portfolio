from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    login,
    confirm_login,
)

urlpatterns = [
    ## Auth routes
 
    # Connexion (envoi du mail avec le code de connexion)
    path('auth/login/', login, name='login'),
    
    # Confirmation de la connexion (Génère le JWT Access et Refresh)
    path('auth/confirm-login/', confirm_login, name='confirm_login'),

]