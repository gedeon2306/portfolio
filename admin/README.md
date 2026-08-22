# README du back-office admin

L’application admin est la partie privée du projet. Elle fournit une interface de gestion du portfolio pour mettre à jour les informations du profil, les compétences, les projets, les certificats, les statistiques et les paramètres globaux du site.

## Générale

- Application principale : React 19
- Langage : TypeScript
- Outil de build : Vite
- Routage : React Router
- Requêtes HTTP : Axios
- Styling : CSS personnalisé + composants dédiés

## Objectif

Cette application sert à :

- authentifier l’administrateur ;
- gérer le contenu éditorial du portfolio ;
- superviser les données publiques ;
- visualiser les statistiques du site ;
- contrôler les paramètres de maintenance et de communication.

## Structure du projet

```text
admin/
├── public/
├── src/
│   ├── api/
│   │   ├── Actions.ts
│   │   └── AxiosConfig.ts
│   ├── assets/
│   ├── components/
│   │   ├── CommandPalette.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── Pagination.tsx
│   │   └── Spinner.tsx
│   ├── context/
│   │   ├── ThemeContext.tsx
│   │   └── ToastContext.tsx
│   ├── css/
│   ├── pages/
│   │   ├── analytics/
│   │   ├── certificates/
│   │   ├── content/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── myInfo/
│   │   ├── projects/
│   │   ├── settings/
│   │   └── skills/
│   ├── routes.tsx
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── ...
```

## Navigation principale

La configuration des routes est centralisée dans :

- [admin/src/routes.tsx](admin/src/routes.tsx)

Les routes importantes sont :

- `/` ou `/connexion` : écran de connexion
- `/connexion/otp` : vérification du code email
- `/dashboard` : tableau de bord principal
- `/dashboard/myinfo` : informations personnelles
- `/dashboard/skills` : gestion des compétences
- `/dashboard/projects` : gestion des projets
- `/dashboard/certificates` : gestion des certifications
- `/dashboard/analytics` : statistiques et vues
- `/dashboard/settings` : réglages du site

## Dépendances principales

Le fichier [admin/package.json](admin/package.json) contient notamment :

- `react` et `react-dom` en version 19
- `react-router-dom` pour le routage
- `axios` pour les appels API
- `react-icons` pour les icônes
- `vite` pour le build / dev server
- `typescript` pour la validation statique
- `oxlint` pour le linting

## Prérequis

- Node.js 18+
- npm
- un backend Django démarré localement
- une clé API backend compatible configurée dans les variables d’environnement

## Installation

Depuis le dossier `admin` :

```bash
npm install
```

## Configuration environnement

Copiez le fichier d’exemple :

```bash
cp .env.example .env
```

Exemple de contenu :

```env
VITE_PUBLIC_API_URL=http://localhost:8000/
VITE_PUBLIC_ADMIN_API_KEY='votre_cle_generee_ici'
```

## Lancer le projet

```bash
npm run dev
```

L’interface admin est alors accessible par défaut sur :

```text
http://localhost:5173/
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Intégration API

La configuration API côté admin est gérée dans :

- [admin/src/api/AxiosConfig.ts](admin/src/api/AxiosConfig.ts)
- [admin/src/api/Actions.ts](admin/src/api/Actions.ts)

Le back-office contacte le backend Django pour :

- authentifier l’utilisateur ;
- récupérer les données de profil ;
- créer / modifier / supprimer les projets ;
- gérer les certificats et compétences ;
- charger les statistiques du dashboard ;
- mettre à jour les paramètres du site.

## Fonctionnalités fonctionnelles

### Authentification

- écran de connexion email / mot de passe ;
- validation OTP par code envoyé par email ;
- sécurisation des routes à partir des tokens JWT ;
- contrôle des accès administrateur.

### Dashboard

- résumé des projets ;
- nombre d’entrées de données ;
- statistiques de visites ;
- historique d’activité ;
- suivi des vues de pages.

### Gestion du contenu

- `MyInfo` : nom, profession, description, réseau sociaux, localisation ;
- `Skills` : catégories et compétences avec niveaux ;
- `Projects` : projet, catégorie, image, URL, technologies, document ;
- `Certificates` : titre, organisme, date, catégorie, image, lien ;
- `Settings` : paramètres d’application et maintenance.

## Gestion d’état et UI

Le projet utilise :

- contexte React pour le thème ;
- contexte React pour les notifications ;
- composants réutilisables pour layout, pagination, chargement ;
- CSS dédié dans le dossier `src/css/` ;
- pages segmentées par domaine fonctionnel.

## Bonnes pratiques

- garder les clés d’API dans `.env` et non dans le code source ;
- sécuriser les appels API avec les bons tokens ;
- vérifier les types TypeScript avant validation ;
- garder la structure des modules cohérente avec le backend ;
- éviter les changements de schéma sans synchroniser le backend.

## Déploiement

Avant la mise en production :

- définir la bonne URL de l’API backend ;
- sécuriser le fichier `.env` ;
- construire le bundle avec `npm run build` ;
- tester le build en environnement de préprod ;
- configurer le reverse proxy ou le serveur web qui servira l’admin.

## Fichiers clés

- [admin/src/App.tsx](admin/src/App.tsx)
- [admin/src/routes.tsx](admin/src/routes.tsx)
- [admin/src/components/DashboardLayout.tsx](admin/src/components/DashboardLayout.tsx)
- [admin/src/context/ThemeContext.tsx](admin/src/context/ThemeContext.tsx)
- [admin/src/context/ToastContext.tsx](admin/src/context/ToastContext.tsx)

## Résumé

Le back-office admin est le panneau de commande du portfolio. Il centralise la mise à jour du contenu, la supervision du site et la gestion des données techniques et éditoriales exposées au public.
