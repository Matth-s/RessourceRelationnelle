# Architecture Backend

## Structure du projet

Le backend est structuré en deux projets C# au sein d'une même solution :

| Projet | Contenu |
|--------|---------|
| `RessourceRelationnelle.API` | Contrôleurs, services métier, migrations EF, configuration |
| `RessourceRelationnelle.DATA` | Modèles de données, DbContext, interfaces et implémentations des repositories |

## Pattern Repository

L'architecture interne suit le pattern Repository, organisé en trois couches :

### Couche Controller

Reçoit les requêtes HTTP, valide les entrées, vérifie les autorisations via les attributs `[Authorize]` et délègue le traitement aux repositories.

### Couche Repository

Encapsule les requêtes Entity Framework et fournit une abstraction sur l'accès aux données. Chaque entité dispose d'une interface et d'une implémentation concrète.

Exemple :

```csharp
public interface IResourceRepository
{
    Task<ResourceModel> Create(ResourceModel model);
    Task<ResourcesReturn?> GetOne(string userId, string resourceId);
    Task<IEnumerable<ResourcesReturn>> GetAll();
    Task<ResourceModel> Update(UpdateResourceModel model);
    Task Delete(string id);
}
```

### Couche Model

Définit les entités métier mappées sur les tables de la base de données via Entity Framework Core, avec les relations, les clés étrangères et les contraintes d'intégrité.

## Contrôleurs principaux

| Contrôleur | Rôle |
|------------|------|
| `AuthenticationController` | Inscription et connexion (JWT) |
| `ResourceController` | CRUD des ressources avec upload de fichiers |
| `CategoryController` | Gestion des catégories |
| `TypeRelationController` | Gestion des types de relation |
| `TypeResourceController` | Gestion des types de ressource |
| `UserController` | Informations de l'utilisateur connecté |
| `SuperAdminController` | Gestion des utilisateurs et modération des commentaires |
| `CommentaryController` | Création et consultation des commentaires |
| `LikeController` | Gestion des likes |
| `ProgressionController` | Favoris et bookmarks |
| `StatisticsController` | Agrégation de données pour le tableau de bord |
| `GameController` | Gestion des parties de jeu multijoueur |

## Injection de dépendances

Configurée dans `Program.cs`, chaque repository est enregistré avec une durée de vie `Scoped` (une instance par requête HTTP), tandis que le `GameSessionService` est enregistré en `Singleton` pour maintenir l'état des parties en mémoire.

```csharp
builder.Services.AddScoped<IResourceRepository, SqlResourceRepository>();
builder.Services.AddScoped<ICategoryRepository, SQLCategoryRepository>();
builder.Services.AddScoped<ILikeRepository, SQLLikeRepository>();
builder.Services.AddSingleton<GameSessionService>();
```

## Authentification et autorisation

La sécurité repose sur des tokens JWT couplés à ASP.NET Identity :

| Rôle | Permissions |
|------|-------------|
| `User` | Consulter, créer des ressources, liker, commenter, jouer |
| `Moderator` | Approuver/rejeter les commentaires |
| `Admin` | Gérer les catégories, ressources, utilisateurs |
| `SuperAdmin` | Accès complet, gestion des rôles |

## Stockage des fichiers

Le service `StorageService` encapsule l'interaction avec Supabase Storage :

```csharp
builder.Services.AddSingleton<IStorageService, StorageService>();
```

Les fichiers uploadés sont catégorisés automatiquement par type (images/, videos/, pdfs/, others/) et stockés dans des buckets Supabase dédiés.