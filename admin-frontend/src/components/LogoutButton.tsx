import { useAppDispatch } from "@/store/hook";
import { Button } from "./ui/button";
import { logout } from "@/features/auth/auth.slice";
import { useNavigate } from "react-router";
import { deleteAuthCookie } from "@/lib/cookie";

import logoutIcon from "@/assets/logout-icon.svg";

const LogoutButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    deleteAuthCookie();
    dispatch(logout());
    navigate("/authentification/connexion");
  };

  return (
    <Button
      className="flex items-center gap-x-2 bg-transparent"
      onClick={() => handleClick()}
    >
      <img
        src={logoutIcon}
        alt="se déconnecter"
        className="brightness-0 invert filter"
      />
      Se déconnecter
    </Button>
  );
};

export default LogoutButton;
