from django import forms
from django.contrib.auth.forms import AuthenticationForm
from .models import *

class LoginForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Nom d\'utilisateur'})
        self.fields['password'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Mot de passe'})
        self.fields['username'].label = 'Nom d\'utilisateur'
        self.fields['password'].label = 'Mot de passe'

class EmailForm(forms.ModelForm):
    class Meta:
        model = SentEmail
        fields = ['nom', 'email', 'sujet', 'message']
        widgets = {
            'nom': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Votre nom'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Votre email'}),
            'sujet': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Sujet'}),
            'message': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Votre message'}),
        }
        labels = {
            'nom': 'Nom',
            'email': 'Email',
            'sujet': 'Sujet',
            'message': 'Message',
        }

class SkillForm(forms.ModelForm):
    class Meta:
        model = Skills
        fields = ['competence']
        widgets = {
            'competence': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nom de la compétence', 'id': 'competence'}),
        }
        labels = {
            'competence': 'Compétence',
        }

class SkillsListForm(forms.ModelForm):
    class Meta:
        model = Skills_list
        fields = ['skill', 'libelle', 'pourcentage']
        widgets = {
            'skill': forms.Select(attrs={'class': 'form-select', 'hidden': True}),
            'libelle': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Libellé', 'id':'libelle'}),
            'pourcentage': forms.NumberInput(attrs={
                'class': 'form-control', 
                'placeholder': 'Pourcentage (0-100)', 
                'id':'pourcentage',
                'min': 0,
                'max': 100,
            }),
        }
        labels = {
            'skill': 'Compétence',
            'libelle': 'Libellé',
            'pourcentage': 'Pourcentage',
        }

class ProjetForm(forms.ModelForm):
    class Meta:
        model = Projets
        fields = ['titre', 'description', 'image', 'url', 'code', 'doc', 'demo']
        widgets = {
            'titre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Titre du projet', 'id': 'titre'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Description du projet', 'rows': 5, 'id': 'description'}),
            'image': forms.FileInput(attrs={'class': 'form-control', 'id': 'image', 'accept': 'image/*','hidden': True}),
            'url': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'URL du projet (optionnel)', 'id': 'url'}),
            'code': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'URL du code source (optionnel)', 'id': 'code'}),
            'doc': forms.FileInput(attrs={'class': 'form-control', 'placeholder': 'Documentation (optionnel)','accept': '.pdf', 'id': 'doc'}),
            'demo': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'URL de la video (optionnel)', 'id': 'demo'}),
        }
        labels = {
            'titre': 'Titre',
            'description': 'Description',
            'image': 'Image',
            'url': 'URL',
            'code': 'Code Source',
            'doc': 'Documentation',
            'demo': 'Demo',
        }

class TechnologieForm(forms.ModelForm):
    class Meta:
        model = Technologies
        fields = ['project', 'technologie']
        widgets = {
            'project': forms.Select(attrs={'class': 'form-control', 'hidden': True}),
            'technologie': forms.Select(attrs={'class': 'form-control', 'id': 'technologie'}),
        }
        labels = {
            'project': 'Projet',
            'technologie': 'Technologie',
        }

class MyInfoForm(forms.ModelForm):
    class Meta:
        model = MyInfo
        fields = ['nom', 'prenom', 'email', 'telephone', 'localisation', 'profession', 'description', 'image', 'cv', 'formation', 'experience', 'passions', 'github', 'linkedin', 'instagram', 'twitter_x']
        widgets = {
            'nom': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nom'}),
            'prenom': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Prénom'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email'}),
            'telephone': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Téléphone'}),
            'localisation': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Localisation'}),
            'profession': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Profession'}),
            # 'description': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Description', 'rows': 5}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Description'}),
            'image': forms.FileInput(attrs={'class': 'form-control', 'id': 'image','accept': 'image/*','hidden': True}),
            'cv': forms.FileInput(attrs={'class': 'form-control', 'accept':'.pdf'}),
            'formation': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Formation'}),
            'experience': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Expérience'}),
            'passions': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Passions'}),
            'github': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'Github (optionnel)'}),
            'linkedin': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'LinkedIn (optionnel)'}),
            'instagram': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'Instagram (optionnel)'}),
            'twitter_x': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'Twitter/X (optionnel)'}),
        }
        labels = {
            'nom': 'Nom',
            'prenom': 'Prénom',
            'email': 'Email',
            'telephone': 'Téléphone',
            'localisation': 'Localisation',
            'profession': 'Profession',
            'description': 'Description',
            'image': 'Image',
            'cv': 'CV',
            'formation': 'Formation',
            'experience': 'Expérience',
            'passions': 'Passions',
            'github': 'Github',
            'linkedin': 'LinkedIn',
            'instagram': 'Instagram',
            'twitter_x': 'Twitter/X',
        }

