# Cahier de tests

## Tests unitaires : Contrôleurs

| Contrôleur | Tests | Scénarios couverts |
|------------|-------|--------------------|
| AuthenticationController | 7 | Login réussi/échoué, inscription réussie/échouée (mots de passe, email existant, erreur création) |
| CategoryController | 12 | CRUD complet, gestion des doublons et exceptions |
| EventController | 12 | CRUD complet, autorisations, récupération par ID et par ressource |
| ResourceController | 6 | Récupération, création, gestion des autorisations |
| SuperAdminController | 16 | Gestion utilisateurs, modération commentaires, mises à jour |
| TypeRelationController | 11 | CRUD complet avec gestion des doublons et exceptions |
| TypeResourceController | 14 | CRUD complet avec gestion des doublons et exceptions |
| UserController | 4 | Récupération par token, gestion des erreurs |
| **TOTAL** | **82** | |

## Tests d'intégration : Repositories

| Repository | Tests | Scénarios couverts |
|------------|-------|--------------------|
| SqlCategoryRepository | 12 | GetAll, GetOne, GetByName, Create, Delete, Update |
| SqlCommentaryRepository | 8 | GetAll (avec relations), GetById, Delete |
| SqlEventRepository | 10 | GetAll, GetEvent, Create, Delete, GetForResource, Update |
| SqlRelationTypeRepository | 10 | GetAll, GetOne, GetByName, Create, Delete, Update |
| SqlResourceRepository | 6 | GetOne (avec relations), GetForUser, Create |
| SqlTypeResourceRepository | 8 | GetOneByName, Create, Delete, GetAll/GetOne/Update |
| SqlUserRepository | 3 | GetById (avec rôles simples et multiples, inexistant) |
| **TOTAL** | **57** | |

## Tests manuels : Scénarios fonctionnels

| Scénario | Application | Résultat |
|----------|-------------|----------|
| Inscription d'un nouvel utilisateur | Mobile | OK |
| Connexion avec identifiants valides/invalides | Mobile | OK |
| Déconnexion et mise à jour du header | Mobile | OK |
| Consultation du catalogue avec filtres | Mobile | OK |
| Recherche textuelle d'une ressource | Mobile | OK |
| Création d'une ressource avec upload d'image | Mobile | OK |
| Création d'une ressource avec lien YouTube | Mobile | OK |
| Édition d'une ressource par son créateur | Mobile | OK |
| Like/unlike avec bascule visuelle | Mobile | OK |
| Mise de côté (bookmark) d'une ressource | Mobile | OK |
| Publication d'un commentaire | Mobile | OK |
| Consultation du profil (4 onglets) | Mobile | OK |
| Création d'une partie de morpion | Mobile | OK |
| Invitation d'un joueur via lien partagé | Mobile | OK |
| Déroulement d'une partie (coups, victoire, nul) | Mobile | OK |
| Chat live entre deux joueurs | Mobile | OK |
| Modération d'un commentaire | Admin | OK |
| Gestion des utilisateurs (CRUD, rôles) | Admin | OK |
| Gestion des catégories (CRUD) | Admin | OK |
| Tableau de bord statistiques | Admin | OK |
| Validation/rejet d'une ressource | Admin | OK |