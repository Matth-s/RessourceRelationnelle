import { useAppSelector } from "@/store/hook";
import type { IUserRole } from "@/types/user-type";
import { Navigate, Outlet } from "react-router";

export const AuthOutlet = ({ roles }: { roles: IUserRole[] }) => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/authentification/connexion" replace />;
  }

  if (!user.role.some((r) => roles.includes(r))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
