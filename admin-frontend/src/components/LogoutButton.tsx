import { useAppDispatch } from "@/store/hook";
import { Button } from "./ui/button";
import { logout } from "@/features/auth/auth.slice";
import { useNavigate } from "react-router";

import logoutIcon from "@/assets/logout-icon.svg";
import { deleteAuthCookie } from "@/lib/cookie";

const LogoutButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    dispatch(logout());
    navigate("/authentification/connexion");
    deleteAuthCookie();
  };

  return (
    <Button
      className="flex items-center gap-x-2 bg-transparent"
      onClick={() => handleClick()}
    >
      <img src={logoutIcon} alt="se déconnecter" />
      Se déconnecter
    </Button>
  );
};

export default LogoutButton;
