from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    login,
    confirm_login,
    dashboard_home,
    my_info,
    skills_management,
    projects_list,
    project_detail,
    project_create,
    project_update,
    project_delete,
    project_categories,
    project_technologies,
)

urlpatterns = [
    ## Auth routes
    path('auth/login/', login, name='login'),
    path('auth/confirm-login/', confirm_login, name='confirm_login'),
    
    ## Dashboard routes
    path('dashboard/home/', dashboard_home, name='dashboard_home'),
    
    ## MyInfo routes
    path('myinfo/', my_info, name='my_info'),
    
    ## Skills routes
    path('skills/', skills_management, name='skills_management'),
    
    ## Projects routes
    path('projects/', projects_list, name='projects_list'),
    path('projects/create/', project_create, name='project_create'),
    path('projects/categories/', project_categories, name='project_categories'),
    path('projects/technologies/', project_technologies, name='project_technologies'),
    path('projects/<uuid:pk>/', project_detail, name='project_detail'),
    path('projects/<uuid:pk>/update/', project_update, name='project_update'),
    path('projects/<uuid:pk>/delete/', project_delete, name='project_delete'),
]