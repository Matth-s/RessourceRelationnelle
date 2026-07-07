# Stratégie de tests

## Méthodologie

La stratégie de test repose sur trois niveaux complémentaires.

### Tests unitaires (82 tests)

Validation du comportement isolé de chaque contrôleur API. Les dépendances externes (repositories, UserManager) sont simulées via **Moq**. Chaque endpoint est couvert par des scénarios de succès, d'erreur et de cas limites.

### Tests d'intégration (57 tests)

Validation de la couche d'accès aux données en exécutant les requêtes Entity Framework contre une base **SQLite en mémoire**. Chaque test crée sa propre base isolée via `TestDbContextFactory`.

### Tests manuels (21 scénarios)

Validation des parcours utilisateurs de bout en bout : inscription, création de ressource avec upload, modération, jeu multijoueur.

## Outils

| Outil | Usage |
|-------|-------|
| xUnit | Framework de test .NET |
| Moq | Mocking des dépendances |
| SQLite in-memory | Base de données de test |
| Coverlet | Collecte de couverture de code |
| ReportGenerator | Rapport HTML de couverture |

## Configuration de la couverture

Le fichier `coverage.runsettings` exclut du calcul :

- Migrations Entity Framework (code généré)
- `DbSeeder` (données de démonstration)
- `DataService` (service de configuration)
- `Program.cs` (point d'entrée)

## Exécution

```bash
# Lancer les tests avec couverture
dotnet test --collect:"XPlat Code Coverage" --settings coverage.runsettings

# Générer le rapport HTML
reportgenerator -reports:"RessourceRelationnelle.Tests/TestResults/**/coverage.cobertura.xml" -targetdir:"TestResults/CoverageReport" -reporttypes:Html
```