import { Mail } from "lucide-react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-gray-900 text-[8px] font-bold">RE</span>
              </div>
              <span className="font-bold text-sm">(RE)SOURCES RELATIONNELLES</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Une plateforme pour créer, renforcer et enrichir vos relations. Des
              ressources pour tous les types de liens relationnels.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-base mb-3">Navigation</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-gray-400 hover:text-white">Accueil</Link>
              <Link to="/resources" className="block text-sm text-gray-400 hover:text-white">Ressources</Link>
              <Link to="/help" className="block text-sm text-gray-400 hover:text-white">Aide</Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-base mb-3">Contact</h3>
            <div className="space-y-2">
              <a href="mailto:contact@resources-relationnelles.fr" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
                <Mail className="h-4 w-4" />
                contact@resources-relationnelles.fr
              </a>
              <Link to="/mentions-legales" className="block text-sm text-gray-400 hover:text-white">Mentions légales</Link>
              <Link to="/cgu" className="block text-sm text-gray-400 hover:text-white">Conditions générales d'utilisation (CGU)</Link>
              <Link to="/politique-confidentialite" className="block text-sm text-gray-400 hover:text-white">Politique de confidentialité</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <p className="text-center text-xs text-gray-500 py-4 px-4">
          © 2026 (RE)SOURCES RELATIONNELLES - Ministère des Solidarités et de la Santé
        </p>
      </div>
    </footer>
  );
};

export default Footer;