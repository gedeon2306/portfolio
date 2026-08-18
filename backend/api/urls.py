from django.urls import path

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
    certificates_list,
    certificate_detail,
    certificate_create,
    certificate_update,
    certificate_delete,
    certificate_categories,
    analytics_data,
    settings_view,
    security_settings,
    change_password,
    backup_export,
)
from .views_frontend import (
    settings_public,
    frontend_about,
    frontend_skills,
    frontend_certificates,
    frontend_certificates_highlights,
    frontend_projects,
    frontend_projects_highlights,
)

urlpatterns = [
    # Admin routes
    path('auth/login/', login, name='login'),
    path('auth/confirm-login/', confirm_login, name='confirm_login'),

    path('dashboard/home/', dashboard_home, name='dashboard_home'),

    path('myinfo/', my_info, name='my_info'),

    path('skills/', skills_management, name='skills_management'),

    path('projects/', projects_list, name='projects_list'),
    path('projects/create/', project_create, name='project_create'),
    path('projects/categories/', project_categories, name='project_categories'),
    path('projects/technologies/', project_technologies, name='project_technologies'),
    path('projects/<uuid:pk>/', project_detail, name='project_detail'),
    path('projects/<uuid:pk>/update/', project_update, name='project_update'),
    path('projects/<uuid:pk>/delete/', project_delete, name='project_delete'),

    path('certificates/', certificates_list, name='certificates_list'),
    path('certificates/create/', certificate_create, name='certificate_create'),
    path('certificates/categories/', certificate_categories, name='certificate_categories'),
    path('certificates/<uuid:pk>/', certificate_detail, name='certificate_detail'),
    path('certificates/<uuid:pk>/update/', certificate_update, name='certificate_update'),
    path('certificates/<uuid:pk>/delete/', certificate_delete, name='certificate_delete'),

    path('analytics/', analytics_data, name='analytics_data'),

    path('settings/', settings_view, name='settings_view'),
    path('settings/security/', security_settings, name='security_settings'),
    path('settings/change-password/', change_password, name='change_password'),
    path('settings/backup/', backup_export, name='backup_export'),

    # Portfolio routes (frontend)
    path('settings/public/', settings_public, name='settings_public'),
    path('frontend/about/', frontend_about, name='frontend_about'),
    path('frontend/skills/', frontend_skills, name='frontend_skills'),
    path('frontend/certificates/', frontend_certificates, name='frontend_certificates'),
    path('frontend/certificates/highlights/', frontend_certificates_highlights, name='frontend_certificates_highlights'),
    path('frontend/projects/', frontend_projects, name='frontend_projects'),
    path('frontend/projects/highlights/', frontend_projects_highlights, name='frontend_projects_highlights'),
]