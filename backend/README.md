# Portfolio Backend

Backend Django REST Framework pour le portfolio personnel. Il gère l’authentification, la gestion du contenu (projets, certificats, compétences, informations personnelles), les paramètres du site et les statistiques d’analytics.

## Stack technique

- Python 3.12+
- Django 6.0
- Django REST Framework
- SimpleJWT
- drf-spectacular
- SQLite par défaut
- Pillow pour les images

## Structure du projet

```text
backend/
├── api/
│   ├── backends/
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── email_utils.py
│   ├── models.py
│   ├── serializers.py
│   ├── tests.py
│   ├── tokens.py
│   ├── urls.py
│   └── views.py
├── backend/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── media/
├── .env
├── .env.example
├── db.sqlite3
├── manage.py
├── README.md
├── requirements.txt
└── venv/
```

## Prérequis

1. Python installé
2. Virtualenv ou venv activé
3. Variables d’environnement configurées dans un fichier `.env`

## Installation

Depuis le dossier `backend` :

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Configuration environnement

Copier le modèle d’environnement :

```bash
cp .env.example .env
```

Puis compléter les valeurs dans `.env` :

```env
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
FRONTEND_URL=http://localhost:5173
ADMIN_API_KEY=your_admin_api_key
PORTFOLIO_API_KEY=your_portfolio_api_key

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_HOST_USER=votre_email@gmail.com
EMAIL_HOST_PASSWORD=votre_mot_de_passe
EMAIL_USER=votre_email@gmail.com
```

## Lancer le projet

### Base de données

```bash
python manage.py migrate
```

### Créer un superutilisateur

```bash
python manage.py createsuperuser
```

### Démarrer le serveur

```bash
python manage.py runserver
```

L’API sera disponible sur :

```text
http://localhost:8000/
```

## Endpoints principaux

### Authentification

- `POST /api/auth/login/`
- `POST /api/auth/confirm-login/`

### Dashboard

- `GET /api/dashboard/home/`
- `GET /api/analytics/`

### Portfolio

- `GET /api/myinfo/`
- `GET /api/skills/`
- `GET /api/projects/`
- `GET /api/projects/<id>/`
- `GET /api/certificates/`

### Paramètres

- `GET /api/settings/`
- `GET /api/settings/security/`
- `GET /api/settings/change-password/`

## Documentation API

Le projet utilise `drf-spectacular` pour générer une documentation OpenAPI. Une fois le serveur démarré, la documentation est accessible ici :

```text
http://localhost:8000/api/schema/
```

## Gestion des fichiers médias

Les images et documents uploadés sont stockés dans le dossier `media/` :

```text
media/
├── certifications/
├── myinfo/
├── projects/
```

## Bonnes pratiques

- Toujours garder les variables sensibles dans le fichier `.env`
- Ne pas committer les clés de production
- Vérifier les migrations avant chaque déploiement
- Préférer les tests avant la mise en production

## Commandes utiles

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py test
python manage.py check
```

## Notes

Ce backend sert de source de données pour l’application frontend du portfolio et centralise la gestion du contenu éditorial, de l’authentification et des statistiques.


