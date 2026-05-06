import AuthLayout from "./pages/(auth)/AuthLayout";
import LoginPage from "./pages/(auth)/LoginPage";
import RegisterPage from "./pages/(auth)/RegisterPage";
import HomePage from "./pages/HomePage";
import ResourcesPage from "./pages/ResourcesPage";
import ResourceDetailPage from "./pages/ResourceDetailPage";
import CreateResourcePage from "./pages/CreateResourcePage";
import EditResourcePage from "./pages/EditResourcePage";
import ProfilePage from "./pages/ProfilePage";
import GamePage from "./pages/GamePage";
import { Route, Routes } from "react-router";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/resources/create" element={<CreateResourcePage />} />
      <Route path="/resources/:id" element={<ResourceDetailPage />} />
      <Route path="/resources/:id/edit" element={<EditResourcePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/game/:sessionId" element={<GamePage />} />
      <Route path="/auth/" element={<AuthLayout />}>
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
};

export default App;