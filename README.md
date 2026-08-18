# Portfolio Personnel

<div align="center">
  <img src="/admin/public/logo_jd_violet_sbg.png" alt="learnEnglish Logo" width="120" />
  <h3>Une application web pour apprendre l'anglais de manière ludique et efficace</h3>
</div>

---


## Architecture

- Backend: Django + Django REST Framework
- Authentification: JWT via SimpleJWT
- Interface d’admin: React + TypeScript + Vite
- Base de données: SQLite en environnement local
- Fichiers media: images, CV et documents uploadés
- Documentation API: drf-spectacular / OpenAPI

## Structure du projet

```text
portfolio/
├── admin/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── ...
├── backend/
│   ├── api/
│   ├── backend/
│   ├── media/
│   ├── .env
│   ├── .env.example
│   ├── db.sqlite3
│   ├── manage.py
│   ├── README.md
│   ├── requirements.txt
│   └── ...
├── README.md
└── .gitignore
```

## Fonctionnalités principales

### Backend

- Authentification admin
- Gestion des informations personnelles
- Gestion des compétences et catégories
- Gestion des projets avec images et documents
- Gestion des certificats
- Analytics et statistiques
- Paramètres système et sécurité
- Export de sauvegarde JSON

### Interface d’administration

- Dashboard principal
- Gestion du profil
- Administration des compétences
- Administration des projets
- Administration des certificats
- Analyse des données
- Paramètres et sécurité

## Prérequis

- Python 3.12+
- Node.js 18+
- npm ou yarn
- Git

## Démarrage rapide

### 1) Backend Django

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

L’API sera disponible sur :

```text
http://localhost:8000/
```

La documentation OpenAPI est accessible sur :

```text
http://localhost:8000/api/schema/
```

### 2) Interface d’administration

```bash
cd admin
npm install
cp .env.example .env
npm run dev
```

L’interface d’administration sera accessible sur :

```text
http://localhost:5173/
```

## Variables d’environnement

### Backend

Le fichier `.env` du backend contient notamment :

```env
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
FRONTEND_URL=http://localhost:5173
ADMIN_API_KEY=your_admin_api_key
PORTFOLIO_API_KEY=your_portfolio_api_key
```

### Admin

Le fichier `.env` de l’admin contient généralement :

```env
VITE_API_URL=http://localhost:8000/api
```

## Documentation associée

- Backend: [backend/README.md](backend/README.md)
- Admin: [admin/README.md](admin/README.md)

## Bonnes pratiques

- Ne pas versionner les fichiers `.env` sensibles
- Vérifier les migrations avant un déploiement
- Tester les changements côté backend et admin avant publication
- Garder les routes API et les composants administratifs cohérents entre eux

## Notes

Ce projet est structuré en deux parties bien distinctes :

- le backend gère les données, l’authentification et les endpoints API
- l’admin permet la gestion du contenu et de la configuration via une interface simple et fonctionnelle

La logique est pensée pour être facilement maintenable, lisible et évolutive.
