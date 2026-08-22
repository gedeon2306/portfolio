# Portfolio Personnel Fullstack

<div align="center">
  <img src="./admin/public/logo_jd_violet_sbg.png" alt="learnEnglish Logo" width="120" />
  <h3>Porfolio Fullstack, moderne et dynamique</h3>
</div>

---

Portfolio personnel complet conçu en architecture multi-applications : un backend Django REST API, une interface d’administration React pour gérer le contenu, et un frontend public React pour présenter le profil, les projets, les certifications et les contacts.

## Vue d’ensemble

Ce projet permet de :

- gérer les informations personnelles du profil professionnel ;
- administrer les compétences, projets et certifications ;
- exposer un site vitrine public statique/dynamique ;
- recevoir des messages de contact ;
- suivre l’activité du site via un journal et des vues de pages ;
- contrôler les paramètres de maintenance et d’email.

## Architecture globale

- Backend : Django + Django REST Framework + SimpleJWT + drf-spectacular
- Interface d’administration : React + TypeScript + Vite + React Router
- Frontend public : React + TypeScript + Vite + React Router
- Base de données : SQLite dans l’environnement local
- Stockage des médias : images, fichiers CV, documents projets/certifications
- Authentification : JWT avec validation supplémentaire par code email

## Modules du projet

```text
portfolio/
├── admin/                        # Back-office privé pour gérer le contenu
│   ├── public/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   ├── README.md
│   ├── vite.config.ts
│   └── ...
├── backend/                     # API Django + logique métier
│   ├── api/
│   ├── backend/
│   ├── media/
│   ├── .env.example
│   ├── db.sqlite3
│   ├── manage.py
│   ├── requirements.txt
│   ├── README.md
│   └── ...
├── frontend/                    # Site public du portfolio
│   ├── public/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   ├── README.md
│   ├── vite.config.ts
│   └── ...
├── .gitignore
├── README.md
└── ...
```

## Fonctionnalités principales

### 1) Backend API

- authentification admin avec email/mot de passe ;
- jetons JWT avec refresh token ;
- validation en deux étapes via code envoyé par email ;
- gestion de Mes Infos ;
- gestion des compétences et catégories ;
- gestion des projets avec technologies, image, code source, documentation ;
- gestion des certifications avec statut et mise en avant ;
- chargement des données publiques pour le frontend ;
- tracking des vues de pages sur le site public ;
- journal d’activité et analytics dashboard ;
- gestion des paramètres du site, maintenance et notifications ;
- API publique pour le formulaire de contact.

### 2) Admin

- tableau de bord avec statistiques ;
- pages de gestion des informations personnelles ;
- gestion des compétences ;
- gestion des projets ;
- gestion des certifications ;
- consultation des analytics ;
- paramètres de configuration du site ;
- navigation protectée par authentification.

### 3) Frontend public

- page d’accueil avec présentation du profil ;
- section compétences ;
- section projets ;
- section certificats ;
- page contact avec envoi de message ;
- mode maintenance configurable ;
- gestion du chargement de paramètres depuis l’API ;
- tracking analytique basic des pages vues.

## Stack technique

### Backend

- Python 3.12+
- Django 6.0.7
- Django REST Framework 3.17.1
- django-environ
- django-cors-headers
- djangorestframework-simplejwt
- drf-spectacular
- Pillow
- SQLite (dev local)

### Admin / Frontend

- React 19
- TypeScript
- Vite 8
- React Router 7
- Axios
- React Icons
- Oxlint
- TanStack React Query côté frontend

## Prérequis

- Git
- Node.js 18 +
- npm
- Python 3.12+
- accès à un terminal bash / zsh

## Démarrage rapide

### 1) Cloner le projet

```bash
git clone <url-du-repo>
cd portfolio
```

### 2) Démarrer le backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Le backend sera disponible sur :

```text
http://localhost:8000/
```

Documentation OpenAPI :

```text
http://localhost:8000/api/schema/
```

### 3) Démarrer l’admin

```bash
cd ../admin
npm install
cp .env.example .env
npm run dev
```

L’admin est généralement accessible sur :

```text
http://localhost:5173/
```

### 4) Démarrer le frontend public

```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

Le frontend public est généralement accessible sur :

```text
http://localhost:5174/
```

> Les ports peuvent varier selon les configurations locales de Vite et des variables d’environnement.

## Variables d’environnement

### Backend

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

### Admin

```env
VITE_PUBLIC_API_URL=http://localhost:8000/
VITE_PUBLIC_ADMIN_API_KEY='votre_cle_generee_ici'
```

### Frontend public

```env
VITE_PUBLIC_API_URL=http://localhost:8000/
VITE_MAINTENANCE=false
VITE_LINKEDIN_URL=https://linkedin.com/in/your-profile
```

## Points d’entrée API importants

Le backend expose plusieurs zones fonctionnelles regroupées dans la route principale `api/` :

- Auth : login, confirm-login
- Dashboard : statistiques et vues de pages
- Mes infos : profil personnel et langues
- Compétences : catégories et niveaux
- Projets : CRUD, catégories, technologies
- Certifications : CRUD, catégories
- Analytics : données de suivi
- Paramètres : maintenance, sécurité, mot de passe, export
- Frontend public : données pour la vitrine et le formulaire de contact

Les routes publiques du frontend sont définies dans :

- [backend/api/urls.py](backend/api/urls.py)
- [backend/api/views_frontend.py](backend/api/views_frontend.py)

## Sécurité et gestion des accès

- le backend utilise JWT pour sécuriser les demandes authentifiées ;
- les endpoints sensibles sont protégés par `IsAuthenticated` ;
- certaines actions du formulaire public vérifient également une clé API ;
- l’authentification de connexion en admin peut fonctionner avec une validation email + code ;
- les variables sensibles ne doivent pas être versionnées dans le dépôt.

## Déploiement

Avant le déploiement, il faut :

- configurer un `.env` de production ;
- utiliser une réelle base de données (ex. PostgreSQL ou MySQL selon besoin) ;
- sécuriser les secrets ;
- activer les bons CORS et domaines ;
- vérifier les permissions des dossiers `media/` ;
- lancer les migrations sur l’environnement cible ;
- contrôler les erreurs SMTP et l’email de confirmation.

## Documentation associée

- [backend/README.md](backend/README.md)
- [admin/README.md](admin/README.md)
- [frontend/README.md](frontend/README.md)

## Bonnes pratiques de développement

- garder le backend, l’admin et le frontend synchronisés sur les structures de données ;
- mettre à jour les migrations Django si le modèle évolue ;
- tester les endpoints avant publication ;
- vérifier les fichiers média téléchargés ;
- documenter chaque changement d’API ou de configuration.

## Résumé

Ce projet est une solution complète de portfolio professionnel avec :

- un système de gestion éditoriale côté admin ;
- un backend fiable et extensible ;
- un frontend public moderne ;
- une logique de suivi et de contact adaptée à un profil freelance ou développeur.
