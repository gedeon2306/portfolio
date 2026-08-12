from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    login,
    confirm_login,
    dashboard_home,
    my_info,
    skills_management,
)

urlpatterns = [
    ## Auth routes
    path('auth/login/', login, name='login'),
    path('auth/confirm-login/', confirm_login, name='confirm_login'),
    
    ## Dashboard routes
    path('dashboard/home/', dashboard_home, name='dashboard_home'),
    
    ## MyInfo routes
    path('myinfo/', my_info, name='my_info'),
    
    ## Skills routes (ajouter)
    path('skills/', skills_management, name='skills_management'),
]