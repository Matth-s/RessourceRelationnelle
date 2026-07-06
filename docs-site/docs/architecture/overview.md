# Vue d'ensemble de l'architecture

## Architecture globale

Le projet (RE)Sources Relationnelles suit un modèle **client-serveur** articulé autour d'une API REST centrale. Le backend constitue le point d'entrée unique pour toutes les opérations de données : il reçoit les requêtes HTTP des clients, exécute la logique métier, interagit avec la base de données et retourne les réponses au format JSON.

Deux applications frontend consomment cette API de manière indépendante :

- **Application web d'administration** : utilisée par les modérateurs et administrateurs pour superviser la plateforme
- **Application mobile-first** : destinée aux citoyens, compilable en application native via Capacitor

Cette séparation permet à chaque interface d'évoluer indépendamment tout en partageant la même source de données et les mêmes règles métier.

## Communication

Les échanges entre les clients et le serveur s'effectuent exclusivement via des requêtes HTTP (GET, POST, PUT, DELETE). L'authentification est gérée par tokens JWT transmis dans l'en-tête `Authorization` de chaque requête.

Les fichiers médias (images, vidéos, audio, PDF) sont uploadés via des requêtes multipart vers le backend, qui les transfère vers Supabase Storage et retourne l'URL publique du fichier au client.

## Jeu multijoueur

Pour le jeu multijoueur, une approche par **polling** a été adoptée : le client interroge le serveur toutes les 1,5 secondes via `GET /api/Game/{id}` pour récupérer l'état de la partie et les messages du chat. Les sessions de jeu sont maintenues en mémoire côté serveur via un service Singleton utilisant un `ConcurrentDictionary`, garantissant un accès rapide et thread-safe.

## Schéma d'architecture

```text
┌──────────────────┐     ┌──────────────────┐
│   Admin Web App  │     │  Mobile App      │
│   React 19 / TS  │     │  React 19 / TS   │
│   shadcn/ui      │     │  Capacitor       │
└────────┬─────────┘     └────────┬─────────┘
         │         HTTPS/JSON     │
         └────────────┬───────────┘
                      │
              ┌───────▼────────┐
              │   API REST     │
              │  ASP.NET Core  │
              │  C# / EF Core  │
              └───────┬────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
   ┌─────▼─────┐ ┌───▼───┐ ┌─────▼──────┐
   │ PostgreSQL │ │Supabase│ │  In-Memory │
   │ (Supabase) │ │Storage │ │   (Game)   │
   └────────────┘ └────────┘ └────────────┘
```