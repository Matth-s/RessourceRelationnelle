import { Route, Routes, useLocation, useNavigate } from "react-router";
import { AuthOutlet } from "./components/AuthOutlet";
import { USER_ROLE } from "./types/user-role-type";
import { useAppDispatch, useAppSelector } from "./store/hook";
import { getCurrentUserApi } from "./features/user/api/get-current-user-api";
import { useQuery } from "@tanstack/react-query";
import { login } from "./features/auth/auth.slice";
import { useEffect } from "react";

import LoginPage from "./pages/(auth)/LoginPage";
import AuthLayout from "./pages/(auth)/AuthLayout";
import DashboardPage from "./pages/(main)/DashboardPage";
import ResourcePage from "./pages/(main)/ResourcePage";
import CategoryPage from "./pages/(main)/CategoryPage";
import UserPage from "./pages/(main)/UserPage";
import StatsPage from "./pages/(main)/StatsPage";
import NotFoundGlobalPage from "./pages/NotFoundGlobalPage";

const App = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isPending, isError, data } = useQuery({
    queryFn: getCurrentUserApi,
    queryKey: ["current-user"],
    retry: false,
  });

  useEffect(() => {
    if (data) {
      dispatch(login(data));
      const pathnameUrl =
        pathname === "/authentification/connexion" ? "/" : pathname;
      navigate(pathnameUrl);
    }
  }, [data, user, dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/authentification/connexion");
    }
  }, [isError]);

  if (isPending) return;

  return (
    <Routes>
      {/* Authentification */}
      <Route element={<AuthLayout />}>
        <Route path="/authentification/connexion" element={<LoginPage />} />
        <Route path="*" element={<NotFoundGlobalPage />} />
      </Route>

      <Route
        element={<AuthOutlet roles={[USER_ROLE.ADMIN, USER_ROLE.MODERATOR]} />}
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/ressources" element={<ResourcePage />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/utilisateurs" element={<UserPage />} />
        <Route path="/statistiques" element={<StatsPage />} />
      </Route>
    </Routes>
  );
};

export default App;
