# RessourceRelationnelle

Application de gestion de ressources et de relations entre ressources.

## Table des matières

- [Architecture du projet](#architecture-du-projet)
- [Prérequis](#prérequis)
- [Installation et configuration](#installation-et-configuration)
- [Lancer le projet](#lancer-le-projet)
- [Structure du projet](#structure-du-projet)
- [Dépannage](#dépannage)

## Architecture du projet

Le projet est composé de trois modules principaux :

1. **Backend** - API REST .NET Core avec base de données PostgreSQL
2. **Admin Frontend** - Interface d'administration React/TypeScript
3. **Mobile App** - Application mobile React/TypeScript avec Capacitor

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

### Pour tous les développeurs
- **Git** - Pour cloner le projet
- **Node.js** - `v24.11.1` minimum
- **npm** - `11.6.2` minimum

### Pour le backend
- **.NET SDK** - Version 8.0 ou supérieure
- **Entity Framework CLI** - Installé via `dotnet tool install -g dotnet-ef`
- **PostgreSQL** - Base de données (ou utiliser Docker)
- **Docker & Docker Compose** - Pour containeriser l'application (optionnel)

### Pour la version mobile
- **Android SDK** (pour Android) ou **Xcode** (pour iOS)
- **Java Development Kit (JDK)** - Version 11 ou supérieure

## Installation et configuration

### 1. Cloner le repository

```bash
git clone https://github.com/Matth-s/RessourceRelationnelle.git
cd RessourceRelationnelle
```

### 2. Configuration du Backend

#### Étape 1 : Accéder au répertoire backend

```bash
cd backend/RessourceRelationnelle.API
```

#### Étape 2 : Restaurer les packages NuGet

```bash
dotnet restore
```

#### Étape 3 : Configurer la base de données

Mettre à jour le fichier `appsettings.Development.json` avec vos paramètres de connexion PostgreSQL :

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=votre-host;Port=5432;Database=votre-db;Username=votre-utilisateur;Password=votre-mot-de-passe;"
  }
}
```

Ou utiliser Docker Compose pour lancer PostgreSQL automatiquement :

```bash
cd ..  # Revenir au dossier backend
docker-compose up -d
```

#### Étape 4 : Appliquer les migrations

```bash
cd RessourceRelationnelle.API
dotnet ef database update
```

Cette commande crée les tables et applique toutes les migrations de base de données.

### 3. Configuration du Frontend Admin

#### Étape 1 : Accéder au répertoire

```bash
cd admin-frontend
```

#### Étape 2 : Installer les dépendances

```bash
npm install
```

#### Étape 3 : Créer le fichier `.env`

Créer un fichier `.env` à la racine du dossier `admin-frontend` :

```env
VITE_PUBLIC_API_ROUTE="https://localhost:7090/api/"
```

**Note** : Adapter le port selon la configuration de votre backend (7090 par défaut pour HTTPS, 5000 pour HTTP).

### 4. Configuration de l'application Mobile (optionnel)

#### Étape 1 : Accéder au répertoire

```bash
cd mobile-app
```

#### Étape 2 : Installer les dépendances

```bash
npm install
```

#### Étape 3 : Créer le fichier `.env`

Créer un fichier `.env` à la racine du dossier `mobile-app` :

```env
VITE_PUBLIC_API_ROUTE="https://localhost:7090/api/"
```

#### Étape 4 : Synchroniser Capacitor (pour compilation native)

```bash
npx cap sync
```

## Lancer le projet

### Option 1 : Lancer chaque composant séparément

#### Terminal 1 - Backend

```bash
cd backend/RessourceRelationnelle.API
dotnet run
```

Le backend sera accessible à `https://localhost:7090` (ou `http://localhost:5000` selon votre configuration).

#### Terminal 2 - Admin Frontend

```bash
cd admin-frontend
npm run dev
```

L'interface sera accessible à `http://localhost:5173` (port par défaut Vite).

#### Terminal 3 - Mobile App (optionnel)

```bash
cd mobile-app
npm run dev
```

### Option 2 : Utiliser Docker Compose (Backend uniquement)

```bash
cd backend
docker-compose up
```

Puis lancer les frontends comme indiqué ci-dessus.

## Tests

### Backend

- Lancez les tests unitaires et d'intégration avec SQLite en mémoire :
  ```
  cd backend/RessourceRelationnelle.Tests
  dotnet test
  ```

### Frontend

- Pour l'admin-frontend :
  ```
  cd admin-panel
<!-- TODO A complété car je sais pas -->
  ```

- Pour la mobile-app :
  ```
  cd mobile-app
<!-- TODO A complété car je sais pas -->
  ```

## Structure du projet

```
RessourceRelationnelle/
├── backend/
│   ├── RessourceRelationnelle.API/       # API .NET Core
│   │   ├── Controllers/                  # Endpoints de l'API
│   │   ├── Services/                     # Logique métier
│   │   ├── Migrations/                   # Migrations Entity Framework
│   │   ├── appsettings.json              # Configuration
│   │   └── Program.cs                    # Configuration du démarrage
│   ├── RessourceRelationnelle.Tests/     # Tests unitaires
│   ├── docker-compose.yml                # Configuration Docker
│   └── Dockerfile
│
├── admin-frontend/                       # Interface d'administration React
│   ├── src/
│   │   ├── components/                   # Composants réutilisables
│   │   ├── features/                     # Fonctionnalités métier
│   │   ├── pages/                        # Pages de l'application
│   │   ├── api/                          # Appels API
│   │   ├── store/                        # Redux store
│   │   └── main.tsx                      # Point d'entrée
│   ├── .env                              # Variables d'environnement
│   └── vite.config.ts                    # Configuration Vite
│
├── mobile-app/                           # Application mobile React + Capacitor
│   ├── src/                              # Code source
│   ├── android/                          # Code Android natif
│   ├── ios/                              # Code iOS natif
│   ├── .env                              # Variables d'environnement
│   └── capacitor.config.ts               # Configuration Capacitor
│
└── README.md                             # Cette documentation
```

## Commandes utiles

### Backend

```bash
# Lancer le serveur en développement
dotnet run

# Créer une nouvelle migration
dotnet ef migrations add NomDeLaMigration

# Lancer les tests
dotnet test

# Compiler le projet
dotnet build
```

### Frontend Admin

```bash
# Démarrer le serveur de développement
npm run dev

# Compiler pour la production
npm run build

# Prévisualiser la version de production
npm run preview

# Vérifier le linting
npm run lint
```

### Mobile App

```bash
# Démarrer le serveur de développement
npm run dev

# Compiler pour la production
npm run build

# Synchroniser avec Capacitor (iOS et Android)
npx cap sync

# Générer une APK pour Android
npx cap run android

# Générer une application pour iOS
npx cap run ios
```

## Variables d'environnement

### Backend (appsettings.Development.json)

- `ConnectionStrings.DefaultConnection` - Chaîne de connexion à PostgreSQL
- `JWT.Secret` - Clé secrète JWT pour l'authentification
- `Roles` - Rôles disponibles dans l'application

### Frontend (admin-frontend/.env et mobile-app/.env)

- `VITE_PUBLIC_API_ROUTE` - URL de base de l'API backend (ex: `https://localhost:7090/api/`)

## Utilisateurs par défaut

L'application est livrée avec un utilisateur administrateur par défaut :

- **Email** : `admin@mail.com`
- **Mot de passe** : `Admin123!`
- **Rôle** : `Admin`

**Important** : Changer le mot de passe après la première connexion en production.

## Dépannage

### Le frontend ne se connecte pas à l'API

1. Vérifier que le backend est en cours d'exécution : `https://localhost:7090/api/`
2. Vérifier la variable `VITE_PUBLIC_API_ROUTE` dans le fichier `.env`
3. Vérifier que le port correspond à celui du backend

### Erreur de migration de base de données

```bash
# Supprimer la dernière migration (si non appliquée)
dotnet ef migrations remove

# Recréer la migration
dotnet ef migrations add NomDeLaMigration
dotnet ef database update
```

### Problèmes avec les dépendances Node

```bash
# Nettoyer les dépendances
rm -rf node_modules package-lock.json

# Réinstaller
npm install
```

### Port déjà utilisé

Si un port est déjà utilisé, modifier la configuration :

- **Backend** : Modifier `Properties/launchSettings.json`
- **Frontend** : `npm run dev -- --port 3000` pour changer le port Vite

## Support

En cas de problème avec la configuration, consultez la documentation :

- [Documentation .NET Core](https://docs.microsoft.com/dotnet/)
- [Documentation Entity Framework](https://docs.microsoft.com/en-us/ef/core/)
- [Documentation React](https://react.dev/)
- [Documentation Vite](https://vitejs.dev/)
- [Documentation Capacitor](https://capacitorjs.com/)

---

**Dernière mise à jour** : Mai 2026


