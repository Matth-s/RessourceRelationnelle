# Déploiement SonarQube

## Vue d'ensemble

Le projet utilise une instance **SonarQube Community** auto-hébergée sur une **VM Azure**, couplée à un **runner GitHub Actions self-hosted** permettant d'analyser toutes les branches grâce au Community Branch Plugin.

## Architecture

| Composant | Rôle |
|-----------|------|
| VM Azure (Ubuntu 24.04, B2ms) | Héberge SonarQube + runner CI |
| SonarQube Community + Community Branch Plugin | Analyse qualité multi-branches |
| PostgreSQL (conteneur Docker) | Base de données SonarQube |
| Runner GitHub Actions self-hosted | Exécute l'analyse depuis la VM |
| Bicep + cloud-init | Infrastructure as Code |

## Pourquoi self-hosted

SonarCloud (SaaS gratuit) n'analyse que la branche principale et les Pull Requests. L'édition Community auto-hébergée, couplée au Community Branch Plugin, permet d'analyser `develop`, les branches `feature/*`, etc.

## Déploiement

### Prérequis

- Abonnement Azure (ex. Azure for Students)
- Azure CLI installé
- Paire de clés SSH

### Étapes

1. Générer les clés SSH : `ssh-keygen -t rsa -b 4096 -f sonarqube-key -N '""'`
2. Définir le mot de passe BDD : `$env:SONAR_DB_PASSWORD = "MotDePasseFort"`
3. Lancer le déploiement : `.\deploy.ps1`
4. Attendre l'installation cloud-init (~10 min)
5. Accéder à SonarQube : `http://<FQDN>:9000` (login : admin/admin)

### Configuration

1. Créer les projets (backend + frontend)
2. Générer les tokens d'analyse
3. Ajouter les tokens dans les secrets GitHub

## Exploitation

```powershell
# Éteindre la VM (économie de crédits)
az vm deallocate -g rg-sonarqube -n vm-sonarqube

# Redémarrer la VM
az vm start -g rg-sonarqube -n vm-sonarqube
```

Les données sont persistées dans des volumes Docker et survivent aux redémarrages.