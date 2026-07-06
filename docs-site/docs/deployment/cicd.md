# Pipeline CI/CD

## GitFlow

Le projet suit un workflow GitFlow :

```text
main ← release ← develop ← feature/*
```

| Branche | Rôle |
|---------|------|
| `main` | Code en production, stable |
| `develop` | Intégration des features, base pour les releases |
| `feature/*` | Développement de nouvelles fonctionnalités |
| `release` | Préparation d'une release (staging) |

## Pipeline d'intégration (Feature → Develop)

Déclenché à chaque push sur une branche `feature/*` ou pull request vers `develop` :

1. **Build** : compilation du backend (.NET) et des frontends (npm)
2. **Tests** : exécution des 139 tests automatisés avec couverture
3. **SonarQube** : analyse qualité du code (runner self-hosted)

## Pipeline de staging (Develop → Release)

Déclenché lors du merge vers la branche `release` :

1. **Trivy** : scan de vulnérabilités des images Docker (severity: CRITICAL, HIGH)
2. **Build & Push Docker** : construction et push des images
3. **K6** : tests de performance/charge sur l'environnement de staging

## Pipeline de production (Release → Main)

Déclenché lors du merge vers `main` :

1. **ZAP** : tests de sécurité automatisés (OWASP ZAP)
2. **Déploiement** : mise en production

## Secrets GitHub

| Secret | Usage |
|--------|-------|
| `SONAR_TOKEN_BACK` | Token d'analyse SonarQube backend |
| `SONAR_TOKEN_FRONT` | Token d'analyse SonarQube frontend |

## Protections de branches

Les branches `main` et `develop` sont protégées :

- Pull request requise pour merge
- Approbation requise (review)
- Checks CI obligatoires (build + tests + SonarQube)