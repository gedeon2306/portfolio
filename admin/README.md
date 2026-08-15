# Admin Portfolio

Interface d’administration du portfolio. Elle permet de gérer les informations personnelles, les compétences, les projets, les certificats, les statistiques et les paramètres du site.

## Stack technique

- React 19
- TypeScript
- Vite
- React Router
- Axios
- React Icons
- Oxlint

## Structure du projet

```text
admin/
├── public/
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── css/
│   ├── pages/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── node_modules/
```

## Prérequis

- Node.js 18+
- npm ou un gestionnaire de paquets équivalent
- Backend Django démarré localement

## Installation

Depuis le dossier `admin` :

```bash
npm install
```

## Configuration environnement

Copier le fichier d’exemple :

```bash
cp .env.example .env
```

Puis compléter les variables :

```env
VITE_API_URL=http://localhost:8000/api
```

## Démarrage en local

```bash
npm run dev
```

L’application est ensuite accessible sur :

```text
http://localhost:5173
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Fonctionnalités principales

- Authentification admin
- Gestion du profil personnel
- Gestion des compétences et catégories
- Gestion des projets avec images et documents
- Gestion des certificats
- Dashboard analytics
- Paramètres système et sécurité
- Export de sauvegarde JSON

## Connexion API

La configuration Axios est centralisée dans :

- [admin/src/api/AxiosConfig.ts](admin/src/api/AxiosConfig.ts)

Les appels backend sont regroupés dans :

- [admin/src/api/Actions.ts](admin/src/api/Actions.ts)

## Bonnes pratiques

- Garder les variables d’environnement dans `.env`
- Ne pas exposer les clés API dans le code source
- Vérifier les types TypeScript avant le déploiement
- Préférer des changements simples et lisibles dans les composants

## Notes

Cette interface est la partie de gestion du portfolio côté administration. Elle communique avec le backend Django REST API pour la mise à jour du contenu et la supervision du site.
