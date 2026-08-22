# README du backend Django

Ce dossier contient l’API principale du projet. Il s’agit du moteur de données du portfolio : gestion des contenus, authentification admin, données publiques, statistiques, messages de contact et paramètres du site.

## Stack technique

- Python 3.12+
- Django 6.0.7
- Django REST Framework 3.17.1
- djangorestframework-simplejwt
- django-cors-headers
- django-environ
- drf-spectacular
- Pillow
- SQLite (en local)

## Objectif

Le backend a trois rôles principaux :

1. servir les données de contenu au frontend public ;
2. exposer les endpoints nécessaires à l’admin pour gérer le portfolio ;
3. centraliser l’authentification, les permissions et les statistiques.

## Structure du projet

```text
backend/
├── api/
│   ├── backends/
│   │   └── custom_email_backend.py
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
│   ├── views.py
│   └── views_frontend.py
├── backend/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── media/
│   ├── certifications/
│   ├── myinfo/
│   └── projects/
├── .env.example
├── db.sqlite3
├── manage.py
├── README.md
├── requirements.txt
└── ...
```

## Modèles principaux

Le backend définit plusieurs modèles métier :

- `User` : utilisateur admin avec email, mot de passe, rôle et jetons ;
- `Dashboard` : journaux de vues et données de tracking ;
- `MyInfo` : informations du profil, réseaux sociaux, photo, CV ;
- `Langues` : langues et niveaux ;
- `Skills` : catégories de compétences ;
- `Skills_list` : compétences avec pourcentage ;
- `Projects` : projets avec catégorie, image, URL, code source et technologies ;
- `Technologies` : liaison entre projet et compétence ;
- `Certificates` : certifications, organismes et dates ;
- `Journal` : historique d’actions ;
- `Settings` : paramètres publics de maintenance et notifications.

## Authentification

Le système d’auth fonctionne en deux temps :

1. `POST /api/auth/login/`
   - vérifie email + mot de passe ;
   - contrôle la clé API `ADMIN_API_KEY` ;
   - envoie un code d’authentification par email ;
   - retourne `uid`, `token` et un statut de validation.

2. `POST /api/auth/confirm-login/`
   - vérifie le code reçu par email ;
   - valide le token de confirmation ;
   - renvoie les JWT access/refresh.

La configuration est faite dans :

- [backend/backend/settings.py](backend/backend/settings.py)
- [backend/api/tokens.py](backend/api/tokens.py)
- [backend/api/email_utils.py](backend/api/email_utils.py)

## Endpoints majeurs

### Auth

- `POST /api/auth/login/`
- `POST /api/auth/confirm-login/`

### Dashboard

- `GET /api/dashboard/home/`
- paramètres supportés : `search`, `device`, `page`

### Profil

- `GET /api/myinfo/`
- `POST /api/myinfo/`

### Compétences

- `GET /api/skills/`

### Projets

- `GET /api/projects/`
- `POST /api/projects/create/`
- `GET /api/projects/<uuid>/`
- `PUT /api/projects/<uuid>/update/`
- `DELETE /api/projects/<uuid>/delete/`
- `GET /api/projects/categories/`
- `GET /api/projects/technologies/`

### Certifications

- `GET /api/certificates/`
- `POST /api/certificates/create/`
- `GET /api/certificates/<uuid>/`
- `PUT /api/certificates/<uuid>/update/`
- `DELETE /api/certificates/<uuid>/delete/`
- `GET /api/certificates/categories/`

### Analytics / paramètres

- `GET /api/analytics/`
- `GET /api/settings/`
- `GET /api/settings/security/`
- `POST /api/settings/change-password/`
- `GET /api/settings/backup/`

### Frontend public

- `GET /api/settings/public/`
- `GET /api/frontend/about/`
- `GET /api/frontend/skills/`
- `GET /api/frontend/certificates/`
- `GET /api/frontend/certificates/highlights/`
- `GET /api/frontend/projects/`
- `GET /api/frontend/projects/highlights/`
- `GET /api/frontend/contact/`
- `POST /api/frontend/contact/send/`
- `POST /api/frontend/track/`

## Documentation OpenAPI

Le projet utilise `drf-spectacular` pour produire une documentation API auto-générée.

Lancez le serveur puis ouvrez :

```text
http://localhost:8000/api/schema/
```

## Configuration environnement

Copiez le fichier d’exemple :

```bash
cp .env.example .env
```

Exemple de configuration :

```env
SECRET_KEY='votre_cle_secrete'
DEBUG=True
ALLOWED_HOSTS='localhost,127.0.0.1'
CORS_ALLOWED_ORIGINS='http://localhost:5173, http://localhost:5174'
FRONTEND_URL='http://localhost:5173'
EMAIL_USER='votre_email@example.com'
ADMIN_API_KEY='votre_cle_generee_ici'
PORTFOLIO_API_KEY='votre_cle_generee_ici'

EMAIL_HOST='smtp.example.com'
EMAIL_PORT=587
EMAIL_HOST_USER='votre_email@example.com'
EMAIL_HOST_PASSWORD='votre_mot_de_passe_email'
```

## Installation

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Commandes de développement

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
python manage.py makemigrations
python manage.py check
python manage.py test
```

## Gestion des fichiers médias

Les fichiers uploadés sont stockés sous `media/` :

```text
media/
├── certifications/
│   └── images/
├── myinfo/
│   ├── cv/
│   └── photos/
└── projects/
    ├── docs/
    └── images/
```

Ces médias sont utilisés pour :

- les photos de profil ;
- les CV ;
- les images de projets ;
- les images de certifications ;
- les documents associés aux projets.

## Tracking et analytics

Le backend enregistre les pages vues via le modèle `Dashboard` avec les informations suivantes :

- route visitée ;
- méthode HTTP ;
- referrer ;
- source ;
- adresse IP ;
- user-agent ;
- session ;
- type d’appareil ;
- timestamp.

Les données sont ensuite exposées dans le dashboard admin pour analyser le trafic.

## Gestion des emails

Le projet configure un backend email personnalisé via :

- [backend/api/backends/custom_email_backend.py](backend/api/backends/custom_email_backend.py)

Il est utilisé pour :

- envoi du code de connexion ;
- confirmation de réception de message de contact ;
- notifications d’administration.

## Sécurité

Le backend met en place :

- JWT pour les routes authentifiées ;
- contrôle des clés API pour certaines actions publiques ;
- validation côté serveur sur les formulaires ;
- throtling par défaut sur les endpoints DRF ;
- configuration CORS limitée via les variables d’environnement.

## Bonnes pratiques

- ne jamais publier de fichiers `.env` ;
- ne pas modifier le modèle sans créer de migration ;
- vérifier les médias et les permissions de fichiers ;
- tester les endpoints avant mise en production ;
- garder les `ALLOWED_HOSTS` et `CORS_ALLOWED_ORIGINS` cohérents avec le domaine réel.

## Fichiers clés

- [backend/backend/settings.py](backend/backend/settings.py)
- [backend/api/models.py](backend/api/models.py)
- [backend/api/urls.py](backend/api/urls.py)
- [backend/api/views.py](backend/api/views.py)
- [backend/api/views_frontend.py](backend/api/views_frontend.py)
- [backend/api/serializers.py](backend/api/serializers.py)

## Résumé

Le backend est la base logique et technique du portfolio. Il centralise la gestion des contenus, les sécurité, l’authentification et les données de consultation du site.


