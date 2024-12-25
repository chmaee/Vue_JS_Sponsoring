# Organisation d'événements - Projet Frontend (Vue.js)

## Description
Ce projet utilise **Vue.JS** pour le développement du frontend d'une application de gestion d'événements. Il permet aux utilisateurs de s'inscrire et de se désinscrire d'événements, de consulter les événements et les utilisateurs, ainsi que de gérer leur propre compte.

## Fonctionnalités principales

- **Inscription et désinscription aux événements** :
    - Les utilisateurs peuvent s'inscrire ou se désinscrire d'événements.
    - Les événements auxquels un utilisateur est inscrit sont affichés dans son propre compte.

- **Gestion de compte utilisateur** :
    - Connexion et déconnexion.
    - Modification du profil utilisateur.
    - Suppression de son compte.
    - Consultation des évènements inscrits.

- **Création d'événements** :
    - Les organisateurs peuvent créer de nouveaux événements.

- **Affichage des événements et des utilisateurs** :
    - Affichage des événements et des utilisateurs inscrits aux événements.

- **Suppression des évènements et des utilisateurs par l'admin** 
---

## Technologies Utilisées

- **Langages :** JavaScript, .ts, .vue
- **Framework :** Vue.js
- **Gestion des routes :** Vue Router
- **State Management :** Context API
- **Appels API :** API Platform
- **Versionnage :** GitLab
- **Déploiement :** Docker

---

## Installation

1. **Cloner le dépôt :**

   ```bash
   git clone https://github.com/votre-utilisateur/projet-front-end.git
   ```

2. **Installer les dépendances :**

   ```bash
   npm install
   ```

3. **Démarrer l'application en mode développement :**

   ```bash
   npm start
   ```

   L'application sera accessible à l'adresse : .

---

## Structure du projet

```plaintext
frontend/
├── public/               
├── src/  
    ├── assets/ 
        ├── main.css/                  
│   ├── components/      
        ├── css/   
        ├── BoiteEvenement.vue/ 
        ├── BoiteUtilisateur.vue/ 
        ├── FormulaireEvenement.vue/ 
        ├── FormulaireInscription.vue/ 
        ├── FormulaireConnexion.vue/ 
│   ├── router/ 
        ├── index.ts/          
│   ├── util/      
        ├── apiStore.ts/        
│   ├── view/   
        ├── AllUsers.vue/    
        ├── DetailsUsers.vue/       
        ├── DetailsEvents.vue/ 
        ├── EventMain.vue/           
│   ├── App.vue/          
│   ├── main.ts            
│   ├── types.ts                   
└── .gitignore
└── package.json
└── README.md
```

---

## Fonctionnalités détaillées

### Connexion / Déconnexion

- **Se connecter** : L'utilisateur peut se connecter avec son login et son mot de passe.
- **Se déconnecter** : L'utilisateur peut se déconnecter.

### Gestion du compte utilisateur

- **Modifier son profil** : L'utilisateur peut mettre à jour ses informations personnelles.
- **Supprimer son compte** : L'utilisateur peut supprimer son compte.

### Création et gestion des événements

- **Créer un événement** : Un utilisateur avec le rôle d'organisateur peut créer un événement.
- **Modifier un événement** : L'organisateur peut modifier les événements qu'il a créés. **Côté API uniquement**
- **Supprimer un événement** : L'organisateur ou un administrateur peut supprimer un événement. **Côté API uniquement**

### Inscription / Désinscription aux événements

- **S'inscrire à un événement** : Les utilisateurs peuvent s'inscrire à un événement.
- **Se désinscrire d'un événement** : Les utilisateurs peuvent se désinscrire des événements auxquels ils sont inscrits.

### Affichage des événements et des utilisateurs

- **Afficher les événements** : Tous les événements sont affichés avec des détails comme la date, la capacité et la description.
---

## Routes API utilisées

### Authentification

- **POST** `/api/auth` : Connexion et génération du token d'authentification.

### Routes pour l'entité `Utilisateur` :

1. **GET /utilisateurs/{id}** (Détails d'un utilisateur)
    - **Sécurité** : Accessible uniquement aux utilisateurs connectés.
    - **Action** : Retourne les informations d'un utilisateur.

2. **GET /utilisateurs** (Liste des utilisateurs)
    - **Sécurité** : Accessible en lecture publique.
    - **Action** : Retourne tous les utilisateurs.

3. **POST /utilisateurs** (Création d'un utilisateur)
    - **Sécurité** : Aucune restriction.
    - **Action** : Crée un utilisateur.

4. **DELETE /utilisateurs/{id}** (Suppression d'un utilisateur)
    - **Sécurité** : Seul un administrateur ou l'utilisateur lui-même peut supprimer son compte.
    - **Action** : Supprime un utilisateur.

5. **PATCH /utilisateurs/{id}** (Modification d'un utilisateur)
    - **Sécurité** : Un utilisateur peut modifier son propre profil ou un administrateur peut modifier n'importe quel profil.
    - **Action** : Met à jour les informations d'un utilisateur.

6. **POST /evenements/{id}/inscription** (Inscription à un événement)
    - **Sécurité** : Un utilisateur doit être connecté pour s'inscrire à un événement.
    - **Action** : Permet à un utilisateur de s'inscrire à un événement.

7. **DELETE /evenements/{id}/desinscription** (Désinscription d'un événement)
    - **Sécurité** : Un utilisateur doit être connecté pour se désinscrire.
    - **Action** : Permet à un utilisateur de se désinscrire d'un événement.

### Routes pour l'entité `Evenement` :

1. **GET /evenements/{id}** (Détails d'un événement)
    - **Sécurité** : Accessible en lecture publique.
    - **Action** : Retourne les détails d'un événement.

2. **GET /evenements** (Liste des événements)
    - **Sécurité** : Accessible en lecture publique.
    - **Action** : Retourne tous les événements.

3. **GET /utilisateurs/{id}/evenements** (Événements d'un utilisateur spécifique)
    - **Sécurité** : Un utilisateur peut voir ses propres événements.
    - **Action** : Retourne les événements auxquels un utilisateur est inscrit.

4. **GET /organisateur/evenements** (Événements créés par un organisateur)
    - **Sécurité** : Un administrateur ou un organisateur peut voir ses propres événements.
    - **Action** : Retourne tous les événements créés par un organisateur.

5. **POST /evenements** (Création d'un événement)
    - **Sécurité** : Seuls les organisateurs peuvent créer des événements.
    - **Action** : Crée un événement.

6. **DELETE /evenements/{id}** (Suppression d'un événement)
    - **Sécurité** : Seuls un administrateur ou un organisateur peuvent supprimer un événement.
    - **Action** : Supprime un événement.

7. **PATCH /evenements/{id}** (Modification d'un événement)
    - **Sécurité** : Seuls un administrateur ou un organisateur peuvent modifier un événement.
    - **Action** : Modifie un événement.

### Autres fonctionnalités spécifiques :

- **`GET /utilisateurs/{id}/evenements`** pour obtenir les événements d'un utilisateur spécifique (via un DataProvider personnalisé).
- **`POST /evenements/{id}/inscription`** et **`DELETE /evenements/{id}/desinscription`** pour gérer l'inscription et la désinscription aux événements respectivement.

---

## Contributions

- **Chaïmae Asiamar** : 33 %
- **Lilian Bramand** :33 % 
- **Cédric Leretour** : 33 %

---