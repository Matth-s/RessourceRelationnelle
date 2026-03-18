import { Route, Routes, useNavigate } from "react-router";
import { AuthOutlet } from "./components/AuthOutlet";
import { USER_ROLE } from "./types/user-role-type";
import { useAppDispatch } from "./store/hook";
import { getCurrentUserApi } from "./features/user/api/get-current-user-api";
import { useMutation } from "@tanstack/react-query";
import { login } from "./features/auth/auth.slice";
import { useEffect } from "react";

import LoginPage from "./pages/(auth)/LoginPage";
import AuthLayout from "./pages/(auth)/AuthLayout";
import DashboardPage from "./pages/(main)/DashboardPage";
import ResourcePage from "./pages/(main)/ResourcePage";
import CategoryPage from "./pages/(main)/CategoryPage";
import UserPage from "./pages/(main)/UserPage";
import StatsPage from "./pages/(main)/StatsPage";
import { Toaster } from "./components/ui/sonner";

const App = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // const getCurrentUser = useMutation({
  //   mutationFn: getCurrentUserApi,

  //   onSuccess: (data) => {
  //     dispatch(login(data));
  //   },

  //   onError: () => {
  //     navigate("/authentification/connexion");
  //   },
  // });

  // useEffect(() => {
  //   getCurrentUser.mutate();
  // }, []);

  return (
    <Routes>
      {/* Authentification */}
      <Route element={<AuthLayout />}>
        <Route path="/authentification/connexion" element={<LoginPage />} />
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
