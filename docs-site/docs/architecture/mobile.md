# Frontend Mobile

## Stack technique

| Technologie | Usage |
|-------------|-------|
| React 19 | Framework UI |
| TypeScript | Typage statique |
| Vite | Build tool |
| Tailwind CSS | Styling mobile-first |
| Redux Toolkit | State management (authentification) |
| Axios | Requêtes HTTP avec intercepteur JWT |
| Capacitor | Compilation native iOS/Android |
| Lucide React | Icônes |

## Approche mobile-first

Chaque composant est d'abord conçu pour un écran de 380px, puis adapté vers les écrans plus grands via les breakpoints Tailwind (`sm`, `md`, `lg`) :

- **Header** : menu hamburger sur mobile, barre de navigation complète sur desktop
- **Grilles de ressources** : 1 colonne sur mobile, 2 sur tablette, 3 sur desktop
- **Boutons d'action** : icônes seules sur mobile, icônes + texte sur desktop

## Organisation du code

```text
src/
├── components/layout/     # Header, Footer
├── features/
│   ├── auth/              # Login, Register (api, components, slice)
│   ├── resources/         # API ressources, profil
│   └── game/              # API jeu multijoueur
├── pages/
│   ├── HomePage.tsx        # Accueil
│   ├── ResourcesPage.tsx   # Catalogue avec filtres
│   ├── ResourceDetailPage.tsx  # Détail (médias, likes, commentaires)
│   ├── CreateResourcePage.tsx  # Formulaire de création
│   ├── EditResourcePage.tsx    # Formulaire d'édition
│   ├── ProfilePage.tsx     # Profil (4 onglets)
│   └── GamePage.tsx        # Morpion multijoueur + chat
├── store/                 # Configuration Redux
└── lib/                   # Axios client
```

## Pages et fonctionnalités

### Catalogue de ressources

Recherche textuelle + 3 niveaux de filtres cumulables (catégorie, type de relation, type de ressource). Compteur de filtres actifs et bouton de réinitialisation.

### Détail d'une ressource

Affichage adaptatif des médias selon le type :

| Type | Rendu |
|------|-------|
| Image | Balise `<img>` responsive |
| Vidéo uploadée (.mp4) | Lecteur vidéo HTML5 natif |
| Audio (.mp3) | Lecteur audio HTML5 |
| PDF | Icône + lien d'ouverture/téléchargement |
| Lien externe (YouTube, jeu) | Bouton "Ouvrir le lien" |

### Interactions

- **Like** : cœur rempli rouge (activé) / cœur vide (désactivé), compteur instantané
- **Bookmark** : signet rempli bleu (activé) / vide (désactivé)
- **Commentaires** : soumis à modération, affichés par ordre chronologique
- **Partage** : `navigator.share()` sur mobile, copie du lien sur desktop

### Profil utilisateur

4 onglets : Favoris, Mis de côté, Mes ressources (avec statut et bouton Modifier), Historique (4 dernières consultations, stocké en localStorage).

### Jeu de morpion multijoueur

Création de partie, invitation par lien, jeu tour par tour avec polling (1,5s), chat live intégré, support des invités non connectés.