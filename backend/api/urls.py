from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    login,
    confirm_login,
    dashboard_home,
    my_info,
)

urlpatterns = [
    ## Auth routes
 
    # Connexion (envoi du mail avec le code de connexion)
    path('auth/login/', login, name='login'),
    
    # Confirmation de la connexion (Génère le JWT Access et Refresh)
    path('auth/confirm-login/', confirm_login, name='confirm_login'),
    
    # Les routes dashboard
    # Home
    path('dashboard/home/', dashboard_home, name='dashboard_home'),
    
    # A propos
    path('myinfo/', my_info, name='my_info'),

]