import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store/store';
import { logout } from '@/features/auth/auth.slice';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    dispatch(logout());
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">
              RE
            </span>
          </div>
          <span className="font-bold text-sm text-gray-900 hidden sm:block">
            (RE)SOURCES RELATIONNELLES
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Accueil
          </Link>
          <Link
            aria-label="resource-link"
            to="/resources"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Ressources
          </Link>
          <Link
            to="/help"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Aide
          </Link>

          {user ? (
            <>
              <Link
                to="/resources/create"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Créer
              </Link>
              <Link
                aria-label="profile"
                to="/profile"
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
              >
                <User className="h-4 w-4" />
                {user.username}
              </Link>
              <button
                aria-label="logout"
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Connexion
              </Link>
              <Link
                to="/auth/register"
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-700"
              >
                S'inscrire
              </Link>
            </>
          )}
        </nav>

        <button
          aria-label="menu"
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link
            to="/"
            className="block text-sm text-gray-600"
            onClick={() => setMenuOpen(false)}
          >
            Accueil
          </Link>
          <Link
            to="/resources"
            className="block text-sm text-gray-600"
            onClick={() => setMenuOpen(false)}
          >
            Ressources
          </Link>
          <Link
            to="/help"
            className="block text-sm text-gray-600"
            onClick={() => setMenuOpen(false)}
          >
            Aide
          </Link>

          {user ? (
            <>
              <Link
                to="/resources/create"
                className="block text-sm text-blue-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                + Créer une ressource
              </Link>
              <Link
                to="/profile"
                className="block text-sm text-gray-600"
                onClick={() => setMenuOpen(false)}
              >
                Mon profil ({user.username})
              </Link>
              <button
                aria-label="logout"
                onClick={handleLogout}
                className="block w-full text-left text-sm text-red-500"
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="block text-sm text-gray-600"
                onClick={() => setMenuOpen(false)}
              >
                Connexion
              </Link>
              <Link
                to="/auth/register"
                className="block bg-blue-600 text-white text-sm text-center px-4 py-2.5 rounded-full"
                onClick={() => setMenuOpen(false)}
              >
                S'inscrire
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
