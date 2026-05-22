import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import {
  ArrowLeft,
  Copy,
  Check,
  Send,
  RotateCcw,
  MessageCircle,
  Users,
  Trophy,
  X as XIcon,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import {
  type GameSession,
  getGameApi,
  joinGameApi,
  moveGameApi,
  resetGameApi,
  sendChatApi,
} from '@/features/game/api/game-api';

const POLL_INTERVAL = 1500;

const GamePage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const [game, setGame] = useState<GameSession | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Déterminer le playerId effectif
  const effectivePlayerId = playerId || guestId;

  // Démarrer le polling
  useEffect(() => {
    if (!sessionId || !joined) return;

    const poll = () => {
      getGameApi(sessionId)
        .then((data) => {
          setGame(data);
          setLastMessageCount((prev) =>
            Math.max(prev, data.messages.length),
          );
        })
        .catch(() => {});
    };

    poll();
    pollRef.current = setInterval(poll, POLL_INTERVAL);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [sessionId, joined]);

  useEffect(() => {
    const loadGame = async () => {
      if (!sessionId) return;
      try {
        const data = await getGameApi(sessionId);
        setGame(data);

        if (user) {
          const result = await joinGameApi(sessionId);
          setPlayerId(result.playerId);
          setJoined(true);
        } else {
          // Vérifier si c'est le créateur invité
          const storedGuestId =
            localStorage.getItem('guest_player_id');
          if (
            storedGuestId &&
            (data.playerX?.id === storedGuestId ||
              data.playerO?.id === storedGuestId)
          ) {
            setGuestId(storedGuestId);
            setPlayerId(storedGuestId);
            setJoined(true);
          }
        }
      } catch {
        setError('Partie introuvable');
      } finally {
        setLoading(false);
      }
    };
    loadGame();
  }, [sessionId, user]);

  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [game?.messages.length]);

  const handleJoinAsGuest = async () => {
    if (!sessionId || !guestName.trim()) return;
    try {
      const newGuestId = crypto
        .randomUUID()
        .replace(/-/g, '')
        .substring(0, 16);
      const result = await joinGameApi(
        sessionId,
        guestName,
        newGuestId,
      );
      setGuestId(newGuestId);
      setPlayerId(result.playerId);
      setGame(result.session);
      setJoined(true);
    } catch {
      setError('Impossible de rejoindre la partie');
    }
  };

  const handleMove = async (position: number) => {
    if (!sessionId || !effectivePlayerId) return;
    try {
      const data = await moveGameApi(
        sessionId,
        position,
        guestId ?? undefined,
      );
      setGame(data);
    } catch {
      /* silencieux */
    }
  };

  const handleReset = async () => {
    if (!sessionId) return;
    try {
      const data = await resetGameApi(sessionId);
      setGame(data);
    } catch {
      /* silencieux */
    }
  };

  const handleSendChat = async () => {
    if (!sessionId || !chatMessage.trim() || !effectivePlayerId)
      return;
    try {
      await sendChatApi(sessionId, chatMessage, guestId ?? undefined);
      setChatMessage('');
      const data = await getGameApi(sessionId);
      setGame(data);
    } catch {
      /* silencieux */
    }
  };

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/game/${sessionId}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const link = `${window.location.origin}/game/${sessionId}`;
    if (navigator.share) {
      await navigator.share({
        title: 'Partie de Morpion',
        text: 'Rejoins ma partie de morpion !',
        url: link,
      });
    } else {
      handleCopyLink();
    }
  };

  // Déterminer le symbole du joueur
  const myMark =
    game?.playerX?.id === effectivePlayerId
      ? 'X'
      : game?.playerO?.id === effectivePlayerId
        ? 'O'
        : null;
  const isMyTurn = game?.currentTurn === myMark;
  const gameOver = game?.winner !== null || game?.isDraw;
  const waitingForPlayer = !game?.playerO;
  const newMessages = game
    ? game.messages.length - lastMessageCount
    : 0;

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

  if (error || !game) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500">
            {error ?? 'Partie introuvable'}
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

  if (!joined && !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
              Rejoindre la partie
            </h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              Entrez votre nom pour jouer
            </p>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && handleJoinAsGuest()
              }
              placeholder="Votre nom"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <button
              onClick={handleJoinAsGuest}
              disabled={!guestName.trim()}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              Rejoindre
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 px-4 py-4 max-w-lg mx-auto w-full">
        {/* Retour */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </button>

        {/* Info joueurs */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5" /> Morpion
            </h2>
            {myMark && (
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${myMark === 'X' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}
              >
                Vous êtes {myMark}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div
              className={`flex items-center gap-2 ${game.currentTurn === 'X' ? 'font-bold' : 'text-gray-400'}`}
            >
              <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded flex items-center justify-center text-xs font-bold">
                X
              </span>
              {game.playerX?.name ?? 'En attente...'}
            </div>
            <span className="text-gray-300">vs</span>
            <div
              className={`flex items-center gap-2 ${game.currentTurn === 'O' ? 'font-bold' : 'text-gray-400'}`}
            >
              {game.playerO?.name ?? 'En attente...'}
              <span className="w-6 h-6 bg-red-100 text-red-700 rounded flex items-center justify-center text-xs font-bold">
                O
              </span>
            </div>
          </div>
        </div>

        {/* Invitation */}
        {waitingForPlayer && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-amber-800 font-medium mb-3">
              En attente d'un adversaire...
            </p>
            <div className="flex gap-2">
              <button
                aria-label="copy-url-game"
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center gap-2 bg-white border border-amber-200 text-amber-800 px-3 py-2.5 rounded-xl text-xs font-medium hover:bg-amber-100"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? 'Copié !' : 'Copier le lien'}
              </button>
              <button
                aria-label="send-inv"
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2.5 rounded-xl text-xs font-medium hover:bg-blue-700"
              >
                <Send className="h-4 w-4" /> Inviter
              </button>
            </div>
          </div>
        )}

        {/* Statut */}
        <div className="text-center mb-4">
          {gameOver ? (
            <div className="flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-bold text-gray-900">
                {game.winner
                  ? game.winner === myMark
                    ? 'Vous avez gagné !'
                    : 'Vous avez perdu...'
                  : 'Match nul !'}
              </span>
            </div>
          ) : waitingForPlayer ? (
            <p className="text-sm text-gray-400">
              Partagez le lien pour inviter un joueur
            </p>
          ) : (
            <p
              className={`text-sm font-medium ${isMyTurn ? 'text-green-600' : 'text-gray-400'}`}
            >
              {isMyTurn
                ? "C'est votre tour !"
                : "Tour de l'adversaire..."}
            </p>
          )}
        </div>

        {/* Plateau */}
        <div className="grid grid-cols-3 gap-2 mb-4 max-w-xs mx-auto">
          {game.board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleMove(index)}
              disabled={
                !!cell || !isMyTurn || gameOver || waitingForPlayer
              }
              className={`aspect-square rounded-xl text-3xl font-bold flex items-center justify-center transition-all ${
                cell === 'X'
                  ? 'bg-blue-100 text-blue-600'
                  : cell === 'O'
                    ? 'bg-red-100 text-red-600'
                    : isMyTurn && !gameOver && !waitingForPlayer
                      ? 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
                      : 'bg-gray-50 border-2 border-gray-100 cursor-not-allowed'
              }`}
            >
              {cell || ''}
            </button>
          ))}
        </div>

        {/* Boutons */}
        <div className="flex gap-2 mb-4">
          {gameOver && (
            <button
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700"
            >
              <RotateCcw className="h-4 w-4" /> Rejouer
            </button>
          )}
          <button
            onClick={() => setShowChat(!showChat)}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border relative ${
              showChat
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'bg-white border-gray-200 text-gray-600'
            } ${gameOver ? '' : 'flex-1'}`}
          >
            <MessageCircle className="h-4 w-4" />
            Chat
            {!showChat && newMessages > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {newMessages}
              </span>
            )}
          </button>
        </div>

        {/* Chat */}
        {showChat && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-4">
            <div className="p-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" /> Chat
              </h3>
              <button onClick={() => setShowChat(false)}>
                <XIcon className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            <div className="h-48 overflow-y-auto p-3 space-y-2">
              {game.messages.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">
                  Aucun message
                </p>
              ) : (
                game.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.playerId === effectivePlayerId ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-gray-400 mb-0.5">
                      {msg.playerName}
                    </span>
                    <div
                      className={`px-3 py-1.5 rounded-xl text-sm max-w-[80%] ${
                        msg.playerId === effectivePlayerId
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && handleSendChat()
                }
                placeholder="Votre message..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendChat}
                disabled={!chatMessage.trim()}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GamePage;
