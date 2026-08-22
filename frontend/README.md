# README du frontend public

Le frontend public est la vitrine du portfolio. Il affiche les informations professionnelles, les projets, les certifications, les compétences et le formulaire de contact, en s’appuyant sur l’API Django.

## Objectif

Cette interface permet de :

- présenter le profil et les compétences ;
- mettre en avant les projets et certifications ;
- afficher les informations de contact ;
- envoyer un message via le formulaire de contact ;
- afficher un mode maintenance configuré côté backend ;
- suivre les visites de pages depuis le front.

## Stack technique

- React 19
- TypeScript
- Vite 8
- React Router 7
- Axios
- TanStack React Query
- React Icons
- CSS personnalisé

## Structure du projet

```text
frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── Actions.ts
│   │   ├── AxiosConfig.ts
│   │   └── tracking.ts
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── css/
│   ├── hooks/
│   ├── pages/
│   │   ├── CertificatesPage.tsx
│   │   ├── Maintenance.tsx
│   │   ├── NotFound.tsx
│   │   ├── PortfolioPage.tsx
│   │   └── ProjectsPage.tsx
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── config.ts
│   ├── index.css
│   └── main.tsx
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

## Pages publiques

Les pages du site public sont principalement :

- `/` : page d’accueil du portfolio
- `/projects` : liste complète des projets
- `/certificates` : liste complète des certifications
- `*` : page 404 / route inconnue

Le composant principal de rendu est :

- [frontend/src/App.tsx](frontend/src/App.tsx)

## Chargement des paramètres

Les paramètres du site sont chargés depuis le backend via `loadSiteSettings()` dans :

- [frontend/src/config.ts](frontend/src/config.ts)

Cela permet de récupérer :

- `modeMaintenance`
- `notificationEmail`
- `linkedin`

Si l’API est indisponible, le frontend utilise des valeurs de secours.

## Intégration API

La couche d’appel API est définie dans :

- [frontend/src/api/AxiosConfig.ts](frontend/src/api/AxiosConfig.ts)
- [frontend/src/api/Actions.ts](frontend/src/api/Actions.ts)

Les données exposées sont :

- paramètres publics ;
- à propos / profil ;
- compétences ;
- projets ;
- certifications ;
- contact ;
- envoi de messages de contact.

## Variables d’environnement

Copiez le fichier d’exemple avant de lancer le projet :

```bash
cp .env.example .env
```

Exemple :

```env
VITE_PUBLIC_API_URL=http://localhost:8000/
VITE_MAINTENANCE=false
VITE_LINKEDIN_URL=https://linkedin.com/in/your-profile
```

## Installation

```bash
cd frontend
npm install
```

## Lancement local

```bash
npm run dev
```

Le site est généralement servi sur :

```text
http://localhost:5174/
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Flux de données du site public

1. le frontend charge les paramètres du backend ;
2. si le site est en maintenance, il affiche la page de maintenance ;
3. sinon, il charge les sections de contenu public ;
4. chaque page utilise les endpoint dédiés comme `frontend/about/`, `frontend/projects/`, `frontend/certificates/` ;
5. le formulaire de contact envoie les données vers `frontend/contact/send/` ;
6. les vues de pages peuvent être tracées côté backend.

## Fonctionnalités visibles côté utilisateur

### Page d’accueil

- présentation personnelle ;
- résumé de la profession ;
- liens vers réseaux sociaux ;
- sections mises en avant ;
- accès rapide aux projets.

### Section compétences

- compétences regroupées par catégories ;
- niveaux de maîtrise avec pourcentage ;
- rendu visuel lisible et hiérarchisé.

### Section projets

- liste des projets actifs ;
- catégorie, date, description, technologies ;
- image et liens externes ou code source ;
- mise en avant des projets importants.

### Section certifications

- certifications actives ;
- informations de date, organisme et catégorie ;
- liens et visualisation des réalisations ;
- mise en avant des éléments importants.

### Formulaire de contact

- nom, email, objet, message ;
- validation côté serveur ;
- envoi d’email de confirmation à l’expéditeur ;
- notification mail au propriétaire du portfolio.

## Envoi de messages

La logique d’envoi est définie dans :

- [frontend/src/api/Actions.ts](frontend/src/api/Actions.ts)

Le backend vérifie en plus la clé `PORTFOLIO_API_KEY` avant d’envoyer les emails.

## Bonnes pratiques

- garder la configuration publique dans les variables d’environnement ;
- ne pas exposer les secrets côté navigateur ;
- vérifier la disponibilité de l’API avant de dépendre de données critiques ;
- tester le mode maintenance et les cas d’erreur de réseau ;
- maintenir la cohérence entre `Settings` backend et le code du frontend.

## Déploiement

Pour un déploiement stable :

- configurer le bon domaine public ;
- fournir une URL backend accessible ;
- sécuriser les fichiers `.env` ;
- vérifier le CORS du backend ;
- tester la page de maintenance et le formulaire de contact ;
- vérifier que les liens vers GitHub, LinkedIn et projets sont corrects.

## Fichiers clés

- [frontend/src/App.tsx](frontend/src/App.tsx)
- [frontend/src/config.ts](frontend/src/config.ts)
- [frontend/src/api/Actions.ts](frontend/src/api/Actions.ts)
- [frontend/src/pages/PortfolioPage.tsx](frontend/src/pages/PortfolioPage.tsx)
- [frontend/src/pages/ProjectsPage.tsx](frontend/src/pages/ProjectsPage.tsx)
- [frontend/src/pages/CertificatesPage.tsx](frontend/src/pages/CertificatesPage.tsx)

## Résumé

Le frontend public est la vitrine du portfolio. Il intègre les données du backend, expose le profil professionnel et permet au visiteur de découvrir les compétences, les projets et les réalisations ainsi que de prendre contact avec le propriétaire.


