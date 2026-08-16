# Portfolio Personnel

<div align="center">
  <img src="/admin/public/logo_jd_violet_sbg.png" alt="learnEnglish Logo" width="120" />
  <h3>Une application web pour apprendre l'anglais de manière ludique et efficace</h3>
</div>

---
Application full-stack pour un portfolio personnel avec une interface d’administration et un backend API. Le projet permet de gérer les informations du profil, les compétences, les projets, les certificats, les statistiques et les paramètres du site.

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
