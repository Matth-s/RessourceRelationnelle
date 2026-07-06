# Guide d'installation

## Prérequis

| Outil | Version minimale |
|-------|-----------------|
| .NET SDK | 9.0 |
| Node.js | 20.x |
| npm | 10.x |
| Git | 2.x |

Un compte Supabase est nécessaire pour la base de données et le stockage de fichiers.

## 1. Cloner le dépôt

```bash
git clone https://github.com/Matth-s/RessourceRelationnelle.git
cd RessourceRelationnelle
```

## 2. Backend

### Configuration

Créer un fichier `appsettings.Development.json` dans `backend/RessourceRelationnelle.API/` :

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=<SUPABASE_HOST>;Port=5432;Database=postgres;Username=postgres;Password=<SUPABASE_PASSWORD>"
  },
  "JWT": {
    "Secret": "<CLE_SECRETE_JWT_MIN_32_CHARS>"
  },
  "Supabase": {
    "Url": "https://<PROJECT_ID>.supabase.co",
    "Key": "<SUPABASE_ANON_KEY>",
    "Bucket": "resources"
  }
}
```

### Lancer le backend

```bash
cd backend/RessourceRelationnelle.API
dotnet restore
dotnet ef database update
dotnet run
```

Le backend est accessible sur `http://localhost:5223`. Le Swagger est disponible sur `http://localhost:5223/swagger`.

### Comptes de démonstration

Le `DbSeeder` crée automatiquement les comptes suivants au premier lancement :

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| `admin.demo@rr.local` | `Demo123!` | Admin |
| `alice.demo@rr.local` | `Demo123!` | User |

## 3. Frontend Admin

```bash
cd admin-frontend
npm install
```

Créer un fichier `.env` :

```env
VITE_API_URL=http://localhost:5223/api
```

Lancer :

```bash
npm run dev
```

Accessible sur `http://localhost:5174`.

## 4. Frontend Mobile

```bash
cd mobile-app
npm install
```

Créer un fichier `.env` :

```env
VITE_API_URL=http://localhost:5223/api
```

Lancer :

```bash
npm run dev
```

Accessible sur `http://localhost:5173`.

### Test sur réseau local (mobile physique)

Pour tester sur un téléphone connecté au même Wi-Fi :

1. Modifier `package.json` : `"dev": "vite --host"`
2. Modifier `.env` : `VITE_API_URL=http://<IP_PC>:5223/api`
3. Modifier `launchSettings.json` du backend : `"applicationUrl": "http://0.0.0.0:5223"`
4. Ouvrir `http://<IP_PC>:5173` sur le téléphone

## 5. Tests

```bash
cd backend
dotnet test --collect:"XPlat Code Coverage" --settings coverage.runsettings
```

Générer le rapport de couverture :

```bash
reportgenerator -reports:"RessourceRelationnelle.Tests/TestResults/**/coverage.cobertura.xml" -targetdir:"TestResults/CoverageReport" -reporttypes:Html
```

Le rapport HTML est consultable dans `TestResults/CoverageReport/index.html`.