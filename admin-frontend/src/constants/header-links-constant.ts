import { USER_ROLE } from "@/types/user-type";

import dashboardIcon from "@/assets/dashboard-icon.svg";
import resourceIcon from "@/assets/resources-icon.svg";
import categoriesIcon from "@/assets/category-icon.svg";
import usersIcon from "@/assets/users-icon.svg";
import commentsIcon from "@/assets/comments-icon.svg";

export const HEADER_LINKS_CONSTANT = [
  {
    name: "Dashboard",
    path: "/",
    requiredRole: USER_ROLE,
    icon: dashboardIcon,
  },
  {
    name: "Ressources",
    path: "/ressources",
    requiredRole: USER_ROLE,
    icon: resourceIcon,
  },
  {
    name: "Catégories",
    path: "/categories",
    requiredRole: USER_ROLE,
    icon: categoriesIcon,
  },
  {
    name: "Utilisateurs",
    path: "/utilisateurs",
    requiredRole: USER_ROLE,
    icon: usersIcon,
  },
  {
    name: "Commentaires",
    path: "/commentaires",
    requiredRole: USER_ROLE,
    icon: commentsIcon,
  },
];
