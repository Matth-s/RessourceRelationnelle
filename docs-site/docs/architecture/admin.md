# Frontend Admin

## Stack technique

| Technologie | Usage |
|-------------|-------|
| React 19 | Framework UI |
| TypeScript | Typage statique |
| Vite | Build tool |
| Tailwind CSS | Styling utility-first |
| shadcn/ui | Composants d'interface |
| Recharts | Graphiques statistiques |
| Redux Toolkit | State management (authentification) |
| TanStack React Query | Cache et synchronisation des données serveur |
| React Hook Form + Zod | Gestion et validation des formulaires |

## Organisation du code

L'architecture suit une organisation par fonctionnalité (feature-based) :

```text
src/
├── components/          # Composants partagés (UI, layout)
├── features/
│   ├── auth/            # Authentification (api, components, schemas)
│   ├── categories/      # Gestion des catégories
│   ├── comments/        # Modération des commentaires
│   ├── resources/       # Gestion des ressources
│   ├── statistics/      # Tableau de bord statistiques
│   └── user/            # Gestion des utilisateurs
├── pages/               # Composants de page (routes)
├── store/               # Configuration Redux
├── lib/                 # Axios (instance, intercepteurs)
└── types/               # Types TypeScript partagés
```

## Fonctionnalités

### Gestion des utilisateurs

CRUD complet : création, modification des rôles (User, Moderator, Admin, SuperAdmin), activation/désactivation, suppression.

### Modération des commentaires

Les commentaires arrivent avec le statut "Pending". Le modérateur peut les approuver ou les supprimer. Seuls les commentaires approuvés sont visibles par les utilisateurs.

### Gestion des ressources

Vue d'ensemble des contenus publiés. Modification du statut de publication (Pending, Approved, Rejected). Suppression si nécessaire.

### Tableau de bord statistiques

Implémenté avec Recharts :

- **PieChart** : répartition des utilisateurs par zone géographique
- **BarChart** : ressources les plus mises en favoris
- **BarChart** : ressources les plus bookmarkées
- **Cartes de totaux** : utilisateurs, ressources, commentaires, événements