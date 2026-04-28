import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  ArrowLeft, Heart, CheckCircle, Bookmark, Share2, Calendar, User, MessageCircle, Send,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { type Resource, getResourceByIdApi } from "@/features/resources/api/get-resources-api";
import { type Comment, getCommentsByResourceApi, postCommentApi } from "@/features/resources/api/comments-api";
import { toggleFavoriteApi, toggleBookmarkApi, toggleExploitationApi, getInteractionApi } from "@/features/resources/api/interaction-api";

const ResourceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const [resource, setResource] = useState<Resource | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isExploited, setIsExploited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const resourceData = await getResourceByIdApi(id);
        setResource(resourceData);

        try {
          const commentsData = await getCommentsByResourceApi(id);
          setComments(commentsData);
        } catch { /* pas de commentaires */ }

        if (user) {
          const interaction = await getInteractionApi(id);
          if (interaction) {
            setIsFavorite(interaction.isFavorite)
            setIsExploited(interaction.isExploited);
            setIsBookmarked(interaction.bookMarked);
          }
        }
      } catch {
        setError("Ressource introuvable");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleToggleFavorite = async () => {
    if (!user || !id) return;
    try {
      await toggleFavoriteApi(id);
      setIsFavorite(!isFavorite);
    } catch { /* erreur silencieuse */ }
  };

  const handleToggleBookmark = async () => {
    if (!user || !id) return;
    try {
      await toggleBookmarkApi(id);
      setIsBookmarked(!isBookmarked);
    } catch { /* erreur silencieuse */ }
  };

  const handleToggleExploitation = async () => {
    if (!user || !id) return;
    try {
      await toggleExploitationApi(id);
      setIsExploited(!isExploited);
    } catch { /* erreur silencieuse */ }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: resource?.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Lien copié !");
    }
  };

  const handlePostComment = async () => {
    if (!user || !id || !newComment.trim()) return;
    setCommentLoading(true);
    try {
      await postCommentApi(id, newComment);
      setNewComment("");
      const updated = await getCommentsByResourceApi(id);
      setComments(updated);
    } catch { /* erreur */ }
    finally { setCommentLoading(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center"><p className="text-gray-400">Chargement...</p></div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500">{error ?? "Ressource introuvable"}</p>
          <button onClick={() => navigate("/resources")} className="text-blue-600 text-sm hover:underline">Retour aux ressources</button>
        </div>
      </div>
    );
  }

  const typeName = resource.typeRessource?.typeRessource ?? "";
  const categoryName = resource.category?.categoryName ?? "";
  const relationName = resource.typeRelation?.typeRelation ?? "";
  const formattedDate = resource.publishedAt
    ? new Date(resource.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 px-4 py-4">
          <ArrowLeft className="h-4 w-4" /> Retour
        </button>

        <div className="mx-4 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-200 to-purple-200 h-48 sm:h-64 md:h-80" />

        <div className="px-4 py-6 space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {categoryName && <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">{categoryName}</span>}
            {typeName && <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">{typeName}</span>}
          </div>

          {/* Titre */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{resource.title}</h1>
            <p className="text-gray-500 text-sm">{resource.resume}</p>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400">
            <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{resource.user?.userName ?? "Anonyme"}</span>
            {formattedDate && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formattedDate}</span>}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <ActionButton
              icon={Heart}
              label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              active={isFavorite}
              disabled={!user}
              onClick={handleToggleFavorite}
            />
            <ActionButton 
              icon={CheckCircle}
              label="Marquer comme exploité"
              active={isExploited}
              disabled={!user}
              onClick={handleToggleExploitation}
            />
            <ActionButton
              icon={Bookmark}
              label={isBookmarked ? "Retirer le signet" : "Mettre de côté"}
              active={isBookmarked}
              disabled={!user}
              onClick={handleToggleBookmark}
            />
            <ActionButton icon={Share2} label="Partager" onClick={handleShare} />
          </div>

          {!user && <p className="text-xs text-gray-400">Connectez-vous pour utiliser les favoris, les signets et les exploitations</p>}

          {/* Relation */}
          {relationName && (
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-semibold text-sm text-gray-900 mb-2">Types de relations concernées</h3>
              <span className="bg-white text-gray-700 text-xs px-3 py-1 rounded-full border border-gray-200">{relationName}</span>
            </div>
          )}

          {/* Contenu */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-bold text-lg text-gray-900 mb-3">Contenu</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{resource.content}</p>
          </div>

          {/* Lien */}
          {resource.url && (
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block text-center bg-blue-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-blue-700">
              Accéder à la ressource
            </a>
          )}

          {/* Commentaires */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="flex items-center gap-2 font-bold text-lg text-gray-900 mb-4">
              <MessageCircle className="h-5 w-5" /> Commentaires ({comments.length})
            </h2>

            {user ? (
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Partagez votre expérience..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handlePostComment}
                  disabled={!newComment.trim() || commentLoading}
                  className="bg-blue-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-1.5 text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">{commentLoading ? "..." : "Envoyer"}</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-400 mb-4">Vous devez être connecté pour commenter</p>
            )}

            {comments.length > 0 ? (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{comment.user?.userName ?? "Anonyme"}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">Aucun commentaire pour le moment</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const ActionButton = ({
  icon: Icon,
  label,
  active = false,
  disabled = false,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs transition-colors ${
      active
        ? "bg-blue-50 border-blue-200 text-blue-600"
        : "border-gray-200 text-gray-600 hover:bg-gray-50"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    <Icon className="h-4 w-4" />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

export default ResourceDetailPage;