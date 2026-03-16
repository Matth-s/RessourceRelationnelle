export const formatCurrentLocation = (path: string): string => {
  let formatted = '';

  console.log(path);

  switch (path.toLowerCase()) {
    case '/':
      formatted = 'Dashboard';
      break;
    case '/ressources':
      formatted = 'Ressources';
      break;
    case '/categories':
      formatted = 'Catégories';
      break;
    case '/utilisateurs':
      formatted = 'Utilisateurs';
      break;
    case '/statistiques':
      formatted = 'Statistiques';
      break;
    default:
      formatted = '';
  }

  return formatted;
};
