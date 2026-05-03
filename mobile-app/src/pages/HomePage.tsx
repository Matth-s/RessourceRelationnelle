import { Link } from "react-router";
import { ArrowRight, BookOpen, Users, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const FEATURES = [
  { icon: BookOpen, title: "Ressources variées", description: "Articles, vidéos, guides, activités et jeux pour tous les types de relations : couple, famille, amis, collègues...", color: "bg-blue-100", iconColor: "text-blue-600" },
  { icon: Users, title: "Communauté active", description: "Partagez vos expériences, créez vos propres ressources et échangez avec d'autres citoyens.", color: "bg-green-100", iconColor: "text-green-600" },
  { icon: Sparkles, title: "Suivi personnalisé", description: "Suivez votre progression, enregistrez vos favoris et personnalisez votre parcours d'apprentissage.", color: "bg-purple-100", iconColor: "text-purple-600" },
];

const THEMES = [
  { name: "Communication", color: "bg-blue-500" },
  { name: "Résolution de conflits", color: "bg-green-500" },
  { name: "Écoute active", color: "bg-purple-500" },
  { name: "Empathie", color: "bg-pink-500" },
  { name: "Confiance", color: "bg-indigo-400" },
  { name: "Intimité", color: "bg-red-500" },
  { name: "Respect", color: "bg-amber-500" },
  { name: "Gestion des émotions", color: "bg-teal-500" },
];

const HomePage = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Cultivez des relations <span className="text-blue-600">épanouissantes</span>
          </h1>
          <p className="text-gray-600 text-base md:text-lg mb-8 px-2">
            Des ressources, outils et activités pour créer, renforcer et enrichir tous vos liens relationnels.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/resources" className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-full font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-700">
              Explorer les ressources <ArrowRight className="h-4 w-4" />
            </Link>
            {!user && (
              <Link to="/auth/register" className="w-full sm:w-auto border border-blue-200 text-blue-600 px-6 py-3 rounded-full font-medium text-sm text-center hover:bg-blue-50">
                Créer un compte
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">Pourquoi (RE)SOURCES RELATIONNELLES ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className={`w-12 h-12 ${f.color} rounded-full flex items-center justify-center mb-4`}>
                  <f.icon className={`h-6 w-6 ${f.iconColor}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">Explorez par thématique</h2>
          <p className="text-gray-500 text-sm text-center mb-8 px-2">Nos ressources couvrent tous les aspects de vos relations.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {THEMES.map((t) => (
              <Link to={`/resources?theme=${encodeURIComponent(t.name)}`} key={t.name} className="bg-white rounded-xl p-5 border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 ${t.color} rounded-full mb-3`} />
                <span className="text-sm font-medium text-gray-900">{t.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
