import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { logout } from "@/features/auth/auth.slice";
import {
  Heart, Bookmark, FileText, Clock, LogOut,
  Eye, Pencil, Image, Film, Music,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { ResourceReturn } from "@/features/resources/api/resources-api";
import {
  getFavoritesApi,
  getBookmarksApi,
  getUserResourcesApi,
  getViewHistory,
} from "@/features/resources/api/profile-api";

type Tab = "favorites" | "bookmarks" | "myResources" | "history";

const TABS: { key: Tab; label: string; icon: typeof Heart }[] = [
  { key: "favorites", label: "Favoris", icon: Heart },
  { key: "bookmarks", label: "Mis de côté", icon: Bookmark },
  { key: "myResources", label: "Mes ressources", icon: FileText },
  { key: "history", label: "Récents", icon: Clock },
];

const CATEGORY_COLORS: Record<string, string> = {
  "COMMUNICATION": "bg-blue-100 text-blue-700",
  "CULTURES": "bg-green-100 text-green-700",
  "DÉVELOPPEMENT PERSONNEL": "bg-purple-100 text-purple-700",
  "INTELLIGENCE ÉMOTIONNELLE": "bg-amber-100 text-amber-700",
  "LOISIRS": "bg-pink-100 text-pink-700",
  "MONDE PROFESSIONNEL": "bg-indigo-100 text-indigo-700",
  "PARENTALITÉ": "bg-rose-100 text-rose-700",
  "QUALITÉ DE VIE": "bg-teal-100 text-teal-700",
  "RECHERCHE DE SENS": "bg-cyan-100 text-cyan-700",
  "SANTÉ PHYSIQUE": "bg-lime-100 text-lime-700",
  "SANTÉ PSYCHIQUE": "bg-violet-100 text-violet-700",
  "SPIRITUALITÉ": "bg-fuchsia-100 text-fuchsia-700",
  "VIE AFFECTIVE": "bg-red-100 text-red-700",
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [activeTab, setActiveTab] = useState<Tab>("favorites");
  const [favorites, setFavorites] = useState<ResourceReturn[]>([]);
  const [bookmarks, setBookmarks] = useState<ResourceReturn[]>([]);
  const [myResources, setMyResources] = useState<ResourceReturn[]>([]);
  const [history, setHistory] = useState<ResourceReturn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [favs, marks] = await Promise.all([
          getFavoritesApi(),
          getBookmarksApi(),
        ]);
        setFavorites(favs);
        setBookmarks(marks);
        setHistory(getViewHistory());

        // Pour les ressources de l'utilisateur, on a besoin de l'ID
        // On le récupère depuis le endpoint current user
        try {
          const { data: currentUser } = await (await import("@/lib/axios-client")).api.get("/User/current");
          if (currentUser?.id) {
            const userRes = await getUserResourcesApi(currentUser.id);
            setMyResources(userRes);
          }
        } catch { /* silencieux */ }
      } catch {
        console.error("Erreur chargement profil");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    dispatch(logout());
    navigate("/");
  };

  if (!user) return null;

  const currentResources = {
    favorites,
    bookmarks,
    myResources,
    history,
  }[activeTab];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full">
        {/* Profil header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl font-bold">
                {user.username.substring(0, 2).toUpperCase()}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl font-bold text-gray-900">{user.username}</h1>
              <p className="text-sm text-gray-500">{user.role.join(", ")}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <StatCard icon={Heart} value={favorites.length} label="Favoris" color="bg-red-50 text-red-500" />
            <StatCard icon={Bookmark} value={bookmarks.length} label="Mis de côté" color="bg-blue-50 text-blue-500" />
            <StatCard icon={FileText} value={myResources.length} label="Mes ressources" color="bg-green-50 text-green-500" />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {TABS.map((tab) => {
              const count = {
                favorites: favorites.length,
                bookmarks: bookmarks.length,
                myResources: myResources.length,
                history: history.length,
              }[tab.key];

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Contenu */}
          <div className="p-4">
            {loading ? (
              <p className="text-center text-gray-400 py-10">Chargement...</p>
            ) : currentResources.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400 mb-2">
                  {activeTab === "favorites" && "Vous n'avez pas encore de favoris"}
                  {activeTab === "bookmarks" && "Vous n'avez rien mis de côté"}
                  {activeTab === "myResources" && "Vous n'avez pas encore créé de ressource"}
                  {activeTab === "history" && "Aucune ressource consultée récemment"}
                </p>
                {(activeTab === "favorites" || activeTab === "bookmarks") && (
                  <Link to="/resources" className="text-blue-600 text-sm hover:underline">
                    Explorer les ressources
                  </Link>
                )}
                {activeTab === "myResources" && (
                  <Link to="/resources/create" className="text-blue-600 text-sm hover:underline">
                    Créer ma première ressource
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentResources.map((resource) => (
                  <ProfileResourceCard
                    key={resource.id}
                    resource={resource}
                    showEdit={activeTab === "myResources"}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: typeof Heart;
  value: number;
  label: string;
  color: string;
}) => (
  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  </div>
);

const MediaIcon = ({ type }: { type: string }) => {
  switch (type?.toLowerCase()) {
    case "image": return <Image className="h-4 w-4" />;
    case "video": return <Film className="h-4 w-4" />;
    case "pdf": return <FileText className="h-4 w-4" />;
    case "audio": return <Music className="h-4 w-4" />;
    default: return null;
  }
};

const ProfileResourceCard = ({
  resource,
  showEdit,
}: {
  resource: ResourceReturn;
  showEdit: boolean;
}) => {
  const categoryName = resource.category?.categoryName ?? "";
  const typeName = resource.typeResource?.typeRessource ?? "";
  const categoryColor = CATEGORY_COLORS[categoryName] ?? "bg-gray-100 text-gray-700";
  const hasImage = resource.mediaUrl && resource.mediaType === "image";

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/resources/${resource.id}`}>
        {hasImage ? (
          <div className="h-36 overflow-hidden">
            <img src={resource.mediaUrl} alt={resource.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="h-36 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <MediaIcon type={resource.mediaType} />
          </div>
        )}
      </Link>

      <div className="p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          {categoryName && (
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryColor}`}>{categoryName}</span>
          )}
          {typeName && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{typeName}</span>
          )}
        </div>

        <Link to={`/resources/${resource.id}`}>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{resource.title}</h3>
        </Link>
        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{resource.resume}</p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" />{resource.viewCount}</span>
            <span className="flex items-center gap-0.5"><Heart className="h-3 w-3" />{resource.likeCount}</span>
          </div>
          {showEdit && (
            <Link
              to={`/resources/${resource.id}/edit`}
              className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              <Pencil className="h-3 w-3" /> Modifier
            </Link>
          )}
        </div>

        {showEdit && (
          <div className="mt-2">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
              resource.publicationStatus === "Approved"
                ? "bg-green-100 text-green-700"
                : resource.publicationStatus === "Rejected"
                ? "bg-red-100 text-red-700"
                : "bg-amber-100 text-amber-700"
            }`}>
              {resource.publicationStatus === "Approved" ? "Approuvée" : resource.publicationStatus === "Rejected" ? "Rejetée" : "En attente"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;