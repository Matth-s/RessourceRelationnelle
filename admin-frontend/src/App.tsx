import { Route, Routes } from 'react-router';

import LoginPage from './pages/(auth)/LoginPage';
import AuthLayout from './pages/(auth)/AuthLayout';

const App = () => {
  return (
    <Routes>
      {/* Authentification */}
      <Route element={<AuthLayout />}>
        <Route
          path="/authentification/connexion"
          element={<LoginPage />}
        />
      </Route>
    </Routes>
  );
};

export default App;
