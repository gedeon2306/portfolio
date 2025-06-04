from django.urls import path
from .views import *

urlpatterns = [
    path('', index, name='index'),
    path('projects/', projects, name='projects'),
    path('connexion/', connexion, name='connexion'),
    path('gestion/', gestion, name='gestion'),
    path('myInfo/', myInfo, name='myInfo'),
    path('mails/', mails, name='mails'),
    path('skills/', skills, name='skills'),
    path('modfifierSkill/<int:id>', modfifierSkill, name='modfifierSkill'),
    path('list_skills/<int:id>', list_skills, name='list_skills'),
    path('modfifierTec/<int:id>', modfifierTec, name='modfifierTec'),
    path('ges_projects/', ges_projects, name='ges_projects'),
    path('add_project/', add_project, name='add_project'),
    path('modfifierProject/<int:id>', modfifier_project, name='modfifierProject'),
    path('project_tec/<int:id>', project_tec, name='project_tec'),
    path('modifier_projet_tec/<int:id>', modifier_projet_tec, name='modifier_projet_tec'),
    path('view_project/<int:id>', view_project, name='view_project'),
    path('delete/<str:name>/<int:id>', delete, name='delete'),
    path('important/<str:action>/<int:id>', important, name='important'),
    path('deconnexion/', deconnexion, name='deconnexion'),
]
