## Portfolio Django – Documentation du projet

Ce projet est un **portfolio personnel** développé avec **Django**.  
Il permet de présenter vos informations, vos compétences, vos projets et de recevoir des messages via un formulaire de contact, tout en offrant une interface de gestion dédiée.

---

### Fonctionnalités principales

- **Page d’accueil du portfolio**
  - Affichage de vos informations principales (nom, titre, description, photo, CV, liens sociaux).
  - Section **compétences** avec niveau de maîtrise (barres de progression ou équivalent).
  - Section **projets** avec image, description, technologies, liens de démo et/ou documentation.
  - Liens vers vos profils (GitHub, LinkedIn, etc.) via le template `social-link`.

- **Gestion des projets**
  - Création / modification / suppression de projets.
  - Gestion des champs principaux : titre, image, description, lien de démo, lien de documentation.
  - Possibilité de marquer certains projets comme **importants / mis en avant**.
  - Vue liste + vue détaillée (`projects.html`, `view_project.html`).

- **Gestion des compétences (skills)**
  - Ajout, édition et suppression de compétences.
  - Gestion d’un pourcentage ou niveau de maîtrise.
  - Affichage structuré sur la partie publique (section compétences) et côté gestion (`skills.html`, `list_skills.html`).

- **Gestion des technologies**
  - Gestion d’une liste de technologies utilisées dans vos projets.
  - Association possible aux projets (via les modèles/migrations `Technologies`/`technologie.html`).

- **Gestion des informations personnelles**
  - Modification des informations de profil (nom, description, image, CV, contacts) via l’interface de gestion (`myInfo.html`).
  - Mise à jour en temps réel de ce qui est affiché sur la page publique.

- **Messagerie / formulaire de contact**
  - Formulaire de contact sur le site public pour permettre aux visiteurs de vous écrire.
  - Enregistrement ou envoi des messages via un **backend e‑mail personnalisé** (`custom_email_backend.py`).
  - Section de gestion des messages reçus dans l’interface de gestion (`mails.html`).

- **Interface de gestion (dashboard)**
  - Espace de connexion dédié (`connect.html`) pour accéder à la partie **gestion** du portfolio.
  - Tableau de bord global (`gestion.html`) regroupant les raccourcis vers :
    - Gestion des informations personnelles.
    - Gestion des compétences.
    - Gestion des technologies.
    - Gestion des projets.
    - Gestion des messages / mails.
  - Interface utilisateur travaillée avec plusieurs feuilles de style (`style.css`, `gestion.css`, `ges_projects.css`, `skills.css`, `connexion.css`, `myInfo.css`).

- **Expérience utilisateur**
  - Utilisation de **SweetAlert2** pour des popups modernes (confirmation / succès / erreurs).
  - Utilisation de **Notyf** pour les notifications toast (feedback rapide des actions).
  - Scripts JavaScript dédiés (`script.js`, `search.js`) pour améliorer l’interactivité (par exemple : recherche de projets, interactions dans le dashboard).
  - Favicon personnalisé et assets graphiques (images, avatar placeholder).

- **Administration Django**
  - Application enregistrée dans l’admin Django (`admin.py`) pour gérer les modèles directement depuis le back-office standard si nécessaire.

---

### Structure générale du projet

- `portfolio/`
  - `manage.py` : script principal de gestion Django.
  - `portfolio/` : configuration du projet (settings, urls, wsgi, asgi).
  - `mailapp/` : application principale du portfolio.
    - `models.py` : définitions des modèles (infos personnelles, projets, compétences, technologies, messages, etc.).
    - `views.py` : vues publiques et vues de gestion.
    - `forms.py` : formulaires (contact, projets, compétences, connexion, etc.).
    - `urls.py` : routes de l’application.
    - `backends/custom_email_backend.py` : backend e‑mail personnalisé.
    - `templates/mailapp/` : templates HTML (parties publique et gestion).
    - `static/mailapp/` : fichiers statiques (CSS, JS, images, librairies externes).
  - `templates/admin/` : surcharge des templates d’admin Django (branding du site d’administration).
  - `.env.example` : exemple de configuration environnementale.
  - `packages.txt` : dépendances Python à installer (équivalent `requirements.txt`).
  - `my.cnf`, `my.example.cnf` : exemples de configuration pour la base de données MySQL/MariaDB (selon le cas).

---

### Prérequis

- **Python** (version 3.x recommandée).
- **pip** (gestionnaire de paquets Python).
- **Base de données** :
  - Par défaut, Django utilise SQLite, mais ce projet semble prévu pour fonctionner avec MySQL/MariaDB (fichiers `my.cnf`, `my.example.cnf`).  
  - Adaptez la configuration dans `settings.py` selon vos besoins.
- **Virtualenv** recommandé pour isoler l’environnement Python.

---

### Installation et configuration

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/gedeon2306/portfolio
   cd portfolio
   ```

2. **Créer et activer un environnement virtuel (optionnel mais recommandé)**

   ```bash
   python -m venv env
   # Windows
   env\Scripts\activate
   # Linux / macOS
   source env/bin/activate
   ```

3. **Installer les dépendances**

   À partir du fichier `packages.txt` :

   ```bash
   pip install -r portfolio/packages.txt
   ```

4. **Configurer les variables d’environnement**

   - Copiez `.env.example` vers `.env`.
   - Remplissez les valeurs nécessaires :
     - Paramètres de base de données.
     - Clés secrètes Django (`SECRET_KEY`).
     - Paramètres e‑mail (hôte, port, identifiants, TLS/SSL) pour le backend personnalisé.

5. **Appliquer les migrations**

   ```bash
   python manage.py migrate
   ```

6. **Créer un superutilisateur (accès admin Django)**

   ```bash
   python manage.py createsuperuser
   ```

7. **Lancer le serveur de développement**

   ```bash
   python manage.py runserver
   ```

   Le site sera accessible sur `http://127.0.0.1:8000/`.

---

### Utilisation

- **Partie publique**
  - Rendez‑vous sur `http://127.0.0.1:8000/` pour voir la page d’accueil du portfolio.
  - Consultez les sections **À propos**, **Compétences**, **Projets** et utilisez le **formulaire de contact**.

- **Interface de gestion (dashboard)**
  - Selon la configuration des URLs, accédez à la page de connexion de gestion (template `connect.html`), par exemple `http://127.0.0.1:8000/gestion/` ou similaire.
  - Une fois authentifié, vous pouvez :
    - Modifier vos informations personnelles.
    - Ajouter / éditer / supprimer des compétences.
    - Gérer la liste des technologies.
    - Ajouter / éditer / supprimer des projets.
    - Consulter les messages reçus depuis le formulaire de contact.

- **Administration Django**
  - Accédez à `http://127.0.0.1:8000/admin/` avec le superutilisateur créé.
  - Gérez les modèles du portfolio via l’interface admin standard.

---

### Personnalisation

- **Templates**
  - Modifiez les templates HTML dans `mailapp/templates/mailapp/` pour adapter le design (sections, textes, mise en page).
  - Les pages de gestion se trouvent dans `mailapp/templates/mailapp/gestion/`.

- **Styles**
  - Les fichiers CSS sont dans `mailapp/static/mailapp/css/`.  
    Vous pouvez ajuster les couleurs, polices, espacements, etc.

- **Scripts**
  - Les scripts JS (`script.js`, `search.js`) sont dans `mailapp/static/mailapp/js/`.  
    Vous pouvez y ajouter de nouvelles interactions ou modifier les fonctionnalités existantes.

- **E‑mails**
  - Adaptez le backend e‑mail (`custom_email_backend.py`) et la configuration dans `settings.py` pour utiliser votre fournisseur (SMTP, service tiers, etc.).

---

### Tests

- Des tests unitaires peuvent être ajoutés ou complétés dans `mailapp/tests.py`.
- Pour lancer les tests :

   ```bash
   python manage.py test
   ```

---

### Licence

Précisez ici la licence choisie pour le projet (par exemple MIT, GPL, usage personnel uniquement, etc.).

