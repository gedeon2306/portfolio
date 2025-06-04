from django.shortcuts import render, redirect, get_object_or_404
from django.core.mail import send_mail
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .forms import *
import os

# Connexion pour la gestion du portfolio
def connexion(request):
    if request.method == 'POST':
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                # request.session['is_connect'] = True
                return redirect('gestion')
            else:
                form.add_error(None, 'Nom d\'utilisateur ou mot de passe incorrect.')
    else:
        form = LoginForm()
    context = {
        'form': form,
        'accueil': False,
        'projets': False,
        'connexion': True,
        'gestion': False,
    }
    return render(request, 'mailapp/gestion/connect.html', context)

# Envoi d'email
def index(request):
    if request.method == 'POST':
        form = EmailForm(request.POST)
        if form.is_valid():
            # Sauvegarder les données dans la base de données
            email_instance = form.save()

            try:
                # Envoyer l'email
                if MyInfo.objects.all().exists():
                    info = MyInfo.objects.all().first()
                    email = info.email
                else:
                    email = 'gedeon.jirehl.gangoue23@gmail.com'

                send_mail(
                    email_instance.sujet,
                    f"Nom: {email_instance.nom}\nEmail: {email_instance.email}\n\n{email_instance.message}",
                    email_instance.email,
                    [email],
                )
            except Exception as e:
                # Gérer l'erreur d'envoi d'email
                messages.error(request, "Une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer plus tard.")
                return redirect('index')
            else:
                messages.info(request, "Votre message a été reçu et est en cours de traitement. Vous recevrez une réponse très bientôt")
                return redirect('index')
    else:
        form = EmailForm()

        if MyInfo.objects.all().exists():
            info = MyInfo.objects.all().first()
        else:
            info = []

        if Skills.objects.all().exists():
            skills = Skills.objects.all()
        else:
            skills = []
        
        if Skills_list.objects.all().exists():
            technologies = Skills_list.objects.all()
        else:
            technologies = []

        if Projets.objects.all().exists():
            projects = Projets.objects.filter(important=True)
        else:
            projects = []

        if Technologies.objects.all().exists():
            projects_tec = Technologies.objects.all()
        else:
            projects_tec = []


    context = {
        'form': form,
        'info': info,
        'skills': skills,
        'technologies': technologies,
        'projects': projects,
        'projects_tec': projects_tec,
        'accueil': True,
        'projets': False,
        'connexion': False,
        'gestion': False,
    }
    return render(request, 'mailapp/index.html', context)

# Tout les projets
def projects(request):
    if MyInfo.objects.all().exists():
            info = MyInfo.objects.all().first()
    else:
        info = []

    if Projets.objects.all().exists():
        projects = Projets.objects.all().order_by('-important')
    else:
        projects = []

    if Technologies.objects.all().exists():
        projects_tec = Technologies.objects.all()
    else:
        projects_tec = []
    context = {
        'accueil': False,
        'projets': True,
        'connexion': False,
        'gestion': False,
        'info': info,
        'projects': projects,
        'projects_tec': projects_tec,
    }
    return render(request, 'mailapp/projects.html', context)

# Espace de gestion du portfolio
@login_required(login_url='connexion')
def gestion(request):
    context = {
        'accueil': False,
        'projets': False,
        'connexion': False,
        'gestion': True,
        'style': '',
    }
    return render(request, 'mailapp/gestion/gestion.html', context)

@login_required(login_url='connexion')
def myInfo(request):
    
    if request.method == 'POST':
        if MyInfo.objects.all().exists(): 
            info = MyInfo.objects.all().first()
            form = MyInfoForm(request.POST, instance=info) 

            if form.is_valid():
                info = form.save(commit=False)

                # Gestion de la photo de profil
                if "image" in request.FILES:
                    # Supprimer l'ancienne photo si elle existe
                    if info.image:
                        if os.path.exists(info.image.path):
                            os.remove(info.image.path)
                    
                    info.image = request.FILES["image"]

                # Gestion du cv
                if "cv" in request.FILES:
                    # Supprimer l'ancien cv si il existe
                    if info.cv:
                        if os.path.exists(info.cv.path):
                            os.remove(info.cv.path)
                    
                    info.cv = request.FILES["cv"]
                    
                info.save()
                messages.info(request, "Informations mises à jour avec succès.")
                return redirect('myInfo')
            else:
                for field, errors in form.errors.items():
                    for error in errors:
                        messages.error(request, f"{field}: {error}")
                return redirect("myInfo")
        else:
            form = MyInfoForm(request.POST)
            if form.is_valid():
                info = form.save(commit=False)

                # Gestion de la photo de profil
                if "image" in request.FILES:
                    info.image = request.FILES["image"]

                # Gestion du cv
                if "cv" in request.FILES:
                    info.cv = request.FILES["cv"]
                
                info.save()
                messages.info(request, "Informations ajoutées avec succès.")
                return redirect('myInfo')
            else:
                for field, errors in form.errors.items():
                    for error in errors:
                        messages.error(request, f"{field}: {error}")
                return redirect("myInfo")
    else:
        if MyInfo.objects.all().exists():
            info = MyInfo.objects.all().first()
            form = MyInfoForm(instance=info)
        else:
            form = MyInfoForm()
            info = []
            
    context = {
        'form': form,
        'info': info,
        'accueil': False,
        'projets': False,
        'connexion': False,
        'gestion': True,
        'style': '',
    }
    return render(request, 'mailapp/gestion/myInfo.html', context)

@login_required(login_url='connexion')
def mails(request):
    if SentEmail.objects.all().exists():
        emails = SentEmail.objects.all().order_by('-date_envoi')
    else:
        emails = []
    context = {
        'accueil': False,
        'projets': False,
        'connexion': False,
        'gestion': True,
        'emails': emails,
        'style': '',
    }
    return render(request, 'mailapp/gestion/mails.html', context)

@login_required(login_url='connexion')
def skills(request):
    if request.method == 'POST':
        form = SkillForm(request.POST)
        if form.is_valid():
            form.save()
            messages.info(request, "Compétence ajoutée avec succès.")
            return redirect('skills')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
            return redirect("skills")
    else:
        context = {
            'form': SkillForm(),
            'skills': Skills.objects.all(),
            'list_skills': Skills_list.objects.all(),
            'accueil': False,
            'projets': False,
            'connexion': False,
            'gestion': True,
            'style': 'skills.css',
        }
    return render(request, 'mailapp/gestion/skills.html', context)

@login_required(login_url='connexion')
def modfifierSkill(request, id):
    skill = get_object_or_404(Skills, id=id)
    if request.method == 'POST':
        form = SkillForm(request.POST, instance=skill)
        if form.is_valid():
            form.save()
            messages.info(request, "Compétence modifiée avec succès.")
            return redirect('skills')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
            return redirect("skills")

@login_required(login_url='connexion')
def list_skills(request, id):
    if request.method == 'POST':
        form = SkillsListForm(request.POST)
        if form.is_valid():
            form.save()
            messages.info(request, "Téchnologie ajoutée avec succès.")
            return redirect('list_skills', id=id)
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
            return redirect("list_skills", id=id)
    else:
        skill = get_object_or_404(Skills, id=id)
        list_skills=Skills_list.objects.filter(skill=skill)
        context = {
            'form': SkillsListForm(initial={'skill': skill.id}),
            'list_skills': list_skills,
            'skill': skill,
            'accueil': False,
            'projets': False,
            'connexion': False,
            'gestion': True,
            'style': 'skills.css',
        }
    return render(request, 'mailapp/gestion/list_skills.html', context)

@login_required(login_url='connexion')
def modfifierTec(request, id):
    tec = get_object_or_404(Skills_list, id=id)
    if request.method == 'POST':
        form = SkillsListForm(request.POST, instance=tec)
        if form.is_valid():
            form.save()
            messages.info(request, "Téchnologie modifiée avec succès.")
            return redirect('list_skills', id=tec.skill.id)
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
            return redirect("list_skills", id=tec.skill.id)

@login_required(login_url='connexion')
def ges_projects(request):

    context = {
        'projects': Projets.objects.all(),
        'accueil': False,
        'projets': False,
        'connexion': False,
        'gestion': True,
        'style': 'ges_projects.css',
    }
    return render(request, 'mailapp/gestion/projects.html', context)

@login_required(login_url='connexion')
def add_project(request):
    if request.method == 'POST':
        form = ProjetForm(request.POST)
        if form.is_valid():
            var = form.save(commit=False)
            # Gestion de l'image
            if "image" in request.FILES:
                var.image = request.FILES["image"]
            
            # Gestion du document
            if "doc" in request.FILES:
                var.doc = request.FILES["doc"]
            
            var.save()
            messages.info(request, "Projet ajouté avec succès, vous pouvez rajouter les technologie utilisées pour le projet.")
            return redirect('ges_projects')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
            return redirect("projects")
    else:
        context = {
            'form': ProjetForm(),
            'accueil': False,
            'projets': False,
            'connexion': False,
            'gestion': True,
            'style': 'ges_projects.css',
            'titre': 'Ajouter un projet',
        }
    return render(request, 'mailapp/gestion/form_project.html', context)

@login_required(login_url='connexion')
def modfifier_project(request, id):
    project = get_object_or_404(Projets, id=id)
    if request.method == 'POST':
        form = ProjetForm(request.POST, instance=project)
        if form.is_valid():
            var = form.save(commit=False)

            # Gestion de l'image
            if "image" in request.FILES:
                # Supprimer l'ancienne image si elle existe
                if project.image:
                    if os.path.exists(project.image.path):
                        os.remove(project.image.path)
                
                var.image = request.FILES["image"]
            
            # Gestion du document
            if "doc" in request.FILES:
                # Supprimer l'ancien document si il existe
                if project.doc:
                    if os.path.exists(project.doc.path):
                        os.remove(project.doc.path)
                
                var.doc = request.FILES["doc"]
            
            var.save()
            messages.info(request, "Projet modifié avec succès.")
            return redirect('ges_projects')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
            return redirect("projects")
    else:
        context = {
            'form': ProjetForm(instance=project),
            'accueil': False,
            'projets': False,
            'connexion': False,
            'gestion': True,
            'style': 'ges_projects.css',
            'titre': 'Modifier le projet',
            'project': project,
        }
        return render(request, 'mailapp/gestion/form_project.html', context)

@login_required(login_url='connexion')
def project_tec(request, id):
    if request.method == 'POST':
        form = TechnologieForm(request.POST)
        if form.is_valid():
            form.save()
            messages.info(request, "Téchnologie ajoutée avec succès.")
            return redirect('project_tec', id=id)
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
            return redirect("project_tec", id=id)
    else:
        project = get_object_or_404(Projets, id=id)
        technologies=Technologies.objects.filter(project=project)
        context = {
            'form': TechnologieForm(initial={'project': project}),
            'technologies': technologies,
            'project': project,
            'accueil': False,
            'projets': False,
            'connexion': False,
            'gestion': True,
            'style': 'skills.css',
        }
    return render(request, 'mailapp/gestion/technologie.html', context)

@login_required(login_url='connexion')
def modifier_projet_tec(request, id):
    technologie = get_object_or_404(Technologies, id=id)
    if request.method == 'POST':
        form = TechnologieForm(request.POST, instance=technologie)
        if form.is_valid():
            form.save()
            messages.info(request, "Téchnologie modifiée avec succès.")
            return redirect('project_tec', id=technologie.project.id)
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
            return redirect("project_tec", id=technologie.project.id)
            # return redirect(request.META.get('HTTP_REFERER', 'index'))

@login_required(login_url='connexion')
def view_project(request, id):
    project = get_object_or_404(Projets, id=id)
    context = {
            'accueil': False,
            'projets': False,
            'connexion': False,
            'gestion': True,
            'project': project,
            'style': 'ges_projects.css',
        }
    return render(request, 'mailapp/gestion/view_project.html', context)

@login_required(login_url='connexion')
def important(request, action, id):
    project = get_object_or_404(Projets, id=id)
    match action:
        case "important":
            if project.important:
                messages.error(request, "Le projet est déjà marqué comme important.")
                return redirect('ges_projects')
            else:
                project.important = True
                project.save()
                messages.info(request, "Le projet a été ajouté aux projets importants.")
                return redirect('ges_projects')
        case "not_important":
            if not project.important:
                messages.error(request, "Le projet est déjà marqué comme non important.")
                return redirect('ges_projects')
            else:
                project.important = False
                project.save()
                messages.info(request, "Le projet a été rétiré des projets importants.")
                return redirect('ges_projects')
        case _:
            messages.error(request, "Action non reconnue.")
            return redirect('ges_projects')

# Suppresion
@login_required(login_url='connexion')
def delete(request, name, id):
    match name:
        case "email":
            mail = get_object_or_404(SentEmail, id=id)
            mail.delete()
            messages.info(request, "Le mail a été supprimé avec succès.")
            return redirect('mails')
        case "skill":
            skill = get_object_or_404(Skills, id=id)
            skill.delete()
            messages.info(request, "La compétence a été supprimée avec succès.")
            return redirect('skills')
        case "list_skill":
            list_skill = get_object_or_404(Skills_list, id=id)
            list_skill.delete()
            messages.info(request, "La technologie a été supprimée avec succès.")
            return redirect('list_skills', id=list_skill.skill.id)
        case "project":
            project = get_object_or_404(Projets, id=id)
            # Supprimer l'image du projet
            if project.image:
                if os.path.exists(project.image.path):
                    os.remove(project.image.path)
            # Supprimer le document du projet
            if project.doc:
                if os.path.exists(project.doc.path):
                    os.remove(project.doc.path)
            project.delete()
            messages.info(request, "Le projet a été supprimé avec succès.")
            return redirect('ges_projects')
        case "technologie":
            technologie = get_object_or_404(Technologies, id=id)
            technologie.delete()
            messages.info(request, "La technologie a été supprimée avec succès.")
            return redirect('project_tec', id=technologie.project.id)

# Déconnexion de la partie gestion
@login_required(login_url='connexion')
def deconnexion(request):
    logout(request)
    return redirect('connexion')






