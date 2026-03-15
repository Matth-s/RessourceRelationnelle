import { Route, Routes } from 'react-router';
import { AuthOutlet } from './components/AuthOutlet';
import { USER_ROLE } from './types/user-role-type';

import LoginPage from './pages/(auth)/LoginPage';
import AuthLayout from './pages/(auth)/AuthLayout';
import TestAdminPage from './pages/(main)/TestAdminPage';

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

      <Route element={<AuthOutlet roles={[USER_ROLE.ADMIN]} />}>
        <Route path="/admin/dashboard" element={<TestAdminPage />} />
      </Route>
    </Routes>
  );
};

export default App;
