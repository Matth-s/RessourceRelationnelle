import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import {
  ArrowLeft,
  Heart,
  Share2,
  Pencil,
  Bookmark,
  Eye,
  Calendar,
  User,
  MessageCircle,
  Send,
  Film,
  FileText,
  Music,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  type ResourceReturn,
  getResourceByIdApi,
} from '@/features/resources/api/resources-api';
import { toggleBookmarkApi } from '@/features/resources/api/profile-api';
import { addToViewHistory } from '@/features/resources/api/profile-api';
import { createGameApi } from '@/features/game/api/game-api';
import { Users } from 'lucide-react';
import { api } from '@/lib/axios-client';

const ResourceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const [resource, setResource] = useState<ResourceReturn | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      if (!id) return;
      try {
        const data = await getResourceByIdApi(id);
        setResource(data);
        setLiked(data.liked);
        setLikeCount(data.likeCount);
        addToViewHistory(data);

        // Vérifier si bookmarké
        if (user) {
          try {
            const { data: prog } = await api.get(
              `/Progression/status/${id}`,
            );
            if (prog) setBookmarked(prog.bookMarked);
          } catch {
            /* pas de progression */
          }
        }
      } catch {
        setError('Ressource introuvable');
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id, user]);

  const handleLike = async () => {
    if (!user || !id) return;
    try {
      if (liked) {
        await api.delete(`/Like/${id}`);
        setLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        await api.post('/Like', { resourceId: id });
        setLiked(true);
        setLikeCount(likeCount + 1);
      }
    } catch {
      /* silencieux */
    }
  };

  const handleBookmark = async () => {
    if (!user || !id) return;
    try {
      await toggleBookmarkApi(id);
      setBookmarked(!bookmarked);
    } catch {
      /* silencieux */
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: resource?.title,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Lien copié !');
    }
  };

  const handlePostComment = async () => {
    if (!user || !id || !commentText.trim()) return;
    setCommentLoading(true);
    try {
      await api.post('/Commentary', {
        resourceId: id,
        content: commentText,
      });
      setCommentText('');
      const data = await getResourceByIdApi(id);
      setResource(data);
    } catch {
      /* silencieux */
    } finally {
      setCommentLoading(false);
    }
  };

  const handleStartGame = async () => {
    if (!id) return;
    try {
      const response = await createGameApi(id);
      if (!user && response.playerId) {
        localStorage.setItem('guest_player_id', response.playerId);
      }
      navigate(`/game/${response.session.id}`);
    } catch {
      /* silencieux */
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500">
            {error ?? 'Ressource introuvable'}
          </p>
          <button
            onClick={() => navigate('/resources')}
            className="text-blue-600 text-sm hover:underline"
          >
            Retour aux ressources
          </button>
        </div>
      </div>
    );
  }

  const typeName = resource.typeResource?.typeRessource ?? '';
  const categoryName = resource.category?.categoryName ?? '';
  const relationName = resource.typeRelation?.typeRelation ?? '';
  const isOwner = user && resource.user?.username === user.username;
  const formattedDate = resource.publishedAt
    ? new Date(resource.publishedAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const isUploadedVideo =
    resource.mediaUrl &&
    resource.mediaType === 'video' &&
    !resource.mediaUrl.includes('youtube.com') &&
    !resource.mediaUrl.includes('youtu.be');

  const isExternalLink =
    resource.mediaUrl &&
    resource.mediaType !== 'image' &&
    resource.mediaType !== 'audio' &&
    resource.mediaType !== 'pdf' &&
    !isUploadedVideo;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full">
        {/* Retour */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 px-4 py-4"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </button>

        {/* Media */}
        <div className="mx-4 rounded-2xl overflow-hidden">
          {resource.mediaUrl && resource.mediaType === 'image' ? (
            <img
              src={resource.mediaUrl}
              alt={resource.title}
              className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-2xl"
            />
          ) : isUploadedVideo ? (
            <video
              controls
              className="w-full h-48 sm:h-64 md:h-80 bg-black rounded-2xl"
            >
              <source src={resource.mediaUrl} />
            </video>
          ) : resource.mediaUrl && resource.mediaType === 'audio' ? (
            <div className="h-32 bg-gradient-to-br from-green-100 to-teal-100 flex flex-col items-center justify-center gap-3 rounded-2xl">
              <Music className="h-10 w-10 text-green-600" />
              <audio
                controls
                src={resource.mediaUrl}
                className="w-4/5"
              />
            </div>
          ) : resource.mediaUrl && resource.mediaType === 'pdf' ? (
            <div className="h-48 bg-gradient-to-br from-red-50 to-orange-50 flex flex-col items-center justify-center gap-2 rounded-2xl">
              <FileText className="h-10 w-10 text-red-500" />
              <a
                href={resource.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Ouvrir le PDF
              </a>
            </div>
          ) : isExternalLink ? (
            <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center gap-3 rounded-2xl">
              <Film className="h-10 w-10 text-blue-600" />
              <p className="text-sm text-gray-600 font-medium">
                Ressource externe
              </p>
              <a
                href={resource.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                Ouvrir le lien
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </a>
            </div>
          ) : (
            <div className="h-48 sm:h-64 md:h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-2xl" />
          )}
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {categoryName && (
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                {categoryName}
              </span>
            )}
            {typeName && (
              <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                {typeName}
              </span>
            )}
          </div>

          {/* Titre */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {resource.title}
              </h1>
              {isOwner && (
                <Link
                  to={`/resources/${resource.id}/edit`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 flex-shrink-0"
                >
                  <Pencil className="h-3.5 w-3.5" /> Modifier
                </Link>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-2">
              {resource.resume}
            </p>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {resource.user?.username ?? 'Anonyme'}
            </span>
            {formattedDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formattedDate}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {resource.viewCount} vues
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {likeCount} j'aime
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {/* Like */}
            <button
              aria-label="like-button"
              onClick={handleLike}
              disabled={!user}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-xs font-medium transition-all ${
                liked
                  ? 'bg-red-50 border-red-300 text-red-600 shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart
                className={`h-4 w-4 transition-all ${liked ? 'fill-red-500 text-red-500 scale-110' : ''}`}
              />
              <span>{liked ? "J'aime" : 'Aimer'}</span>
              <span
                className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] ${liked ? 'bg-red-100' : 'bg-gray-100'}`}
              >
                {likeCount}
              </span>
            </button>

            {/* Bookmark */}
            <button
              aria-label="bookmark-button"
              onClick={handleBookmark}
              disabled={!user}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-xs font-medium transition-all ${
                bookmarked
                  ? 'bg-blue-50 border-blue-300 text-blue-600 shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Bookmark
                className={`h-4 w-4 transition-all ${bookmarked ? 'fill-blue-500 text-blue-500 scale-110' : ''}`}
              />
              <span>
                {bookmarked ? 'Mis de côté' : 'Mettre de côté'}
              </span>
            </button>

            {/* Partager */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4" />
              <span>Partager</span>
            </button>
          </div>

          {!user && (
            <p className="text-xs text-gray-400">
              Connectez-vous pour aimer, mettre de côté et commenter
            </p>
          )}

          {/* Bouton Jouer si c'est un jeu */}
          {typeName.toLowerCase().includes('jeu') && (
            <button
              aria-label="create-game"
              onClick={handleStartGame}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <Users className="h-4 w-4" /> Créer une partie
            </button>
          )}

          {/* Relation */}
          {relationName && (
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-semibold text-sm text-gray-900 mb-2">
                Types de relations concernées
              </h3>
              <span className="bg-white text-gray-700 text-xs px-3 py-1 rounded-full border border-gray-200">
                {relationName}
              </span>
            </div>
          )}

          {/* Contenu */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-bold text-lg text-gray-900 mb-3">
              Contenu
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {resource.content}
            </p>
          </div>

          {/* Télécharger PDF */}
          {resource.mediaUrl && resource.mediaType === 'pdf' && (
            <a
              href={resource.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-blue-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-blue-700"
            >
              Télécharger le PDF
            </a>
          )}

          {/* Commentaires */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="flex items-center gap-2 font-bold text-lg text-gray-900 mb-4">
              <MessageCircle className="h-5 w-5" /> Commentaires (
              {resource.comments?.length ?? 0})
            </h2>

            {user ? (
              <div className="flex gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">
                    {user.username.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    aria-label="post-comment"
                    type="text"
                    placeholder="Partagez votre expérience..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && handlePostComment()
                    }
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    aria-label="submit-comment"
                    onClick={handlePostComment}
                    disabled={!commentText.trim() || commentLoading}
                    className={`px-4 py-2.5 rounded-xl flex items-center gap-1.5 text-sm font-medium transition-colors ${
                      commentText.trim()
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-400'
                    } disabled:opacity-50`}
                  >
                    <Send className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {commentLoading ? '...' : 'Envoyer'}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4 mb-4 text-center">
                <p className="text-sm text-gray-500 mb-2">
                  Vous devez être connecté pour commenter
                </p>
                <Link
                  to="/auth/login"
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Se connecter
                </Link>
              </div>
            )}

            {resource.comments && resource.comments.length > 0 ? (
              <div className="space-y-4">
                {resource.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-xs font-bold">
                        {(comment.user?.username ?? 'A')
                          .substring(0, 2)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {comment.user?.username ?? 'Anonyme'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(
                            comment.createdAt,
                          ).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
                Aucun commentaire pour le moment. Soyez le premier à
                partager votre avis !
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResourceDetailPage;
