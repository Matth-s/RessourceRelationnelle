import AuthLayout from "./pages/(auth)/AuthLayout";
import LoginPage from "./pages/(auth)/LoginPage";
import RegisterPage from "./pages/(auth)/RegisterPage";
import HomePage from "./pages/HomePage";
import { Route, Routes } from "react-router";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<p>HomePage</p>} />
      <Route path="/auth/" element={<AuthLayout />}>
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
};

export default App;
