using System.Collections.Concurrent;

namespace RessourceRelationnelle.API.Services
{
    public class GameSession
    {
        public string Id { get; set; } = string.Empty;
        public string? ResourceId { get; set; }
        public string GameType { get; set; } = "tictactoe";

        public string[] Board { get; set; } = new string[9] { "", "", "", "", "", "", "", "", "" };

        public string CurrentTurn { get; set; } = "X";

        public string? Winner { get; set; }
        public bool IsDraw { get; set; }

        public PlayerInfo? PlayerX { get; set; }
        public PlayerInfo? PlayerO { get; set; }

        public List<ChatMessage> Messages { get; set; } = new();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class PlayerInfo
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public bool IsGuest { get; set; }
    }

    public class ChatMessage
    {
        public string Id { get; set; } = string.Empty;
        public string PlayerId { get; set; } = string.Empty;
        public string PlayerName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }

    public class GameSessionService
    {
        private readonly ConcurrentDictionary<string, GameSession> _sessions = new();

        public GameSession Create(string? resourceId, PlayerInfo creator)
        {
            var session = new GameSession
            {
                Id = Guid.NewGuid().ToString("N").Substring(0, 10),
                ResourceId = resourceId,
                PlayerX = creator,
            };

            _sessions[session.Id] = session;
            return session;
        }

        public GameSession? Get(string id)
        {
            _sessions.TryGetValue(id, out var session);
            return session;
        }

        public GameSession? Join(string id, PlayerInfo player)
        {
            if (!_sessions.TryGetValue(id, out var session)) return null;

            if (session.PlayerX != null && session.PlayerX.Id == player.Id) return session;
            if (session.PlayerO != null && session.PlayerO.Id == player.Id) return session;

            if (session.PlayerX == null)
            {
                session.PlayerX = player;
            }
            else if (session.PlayerO == null)
            {
                session.PlayerO = player;
            }
            else
            {
                return null;
            }

            session.UpdatedAt = DateTime.UtcNow;
            return session;
        }

        public (GameSession? Session, string? Error) Move(string id, string playerId, int position)
        {
            if (!_sessions.TryGetValue(id, out var session))
                return (null, "Session introuvable");
            if (session.Winner != null || session.IsDraw)
                return (session, "La partie est terminée");
            if (position < 0 || position > 8)
                return (session, "Position invalide");
            if (!string.IsNullOrEmpty(session.Board[position]))
                return (session, "Case déjà jouée");

            string? mark = null;
            if (session.PlayerX != null && session.PlayerX.Id == playerId) mark = "X";
            else if (session.PlayerO != null && session.PlayerO.Id == playerId) mark = "O";

            if (mark == null)
                return (session, "Joueur non inscrit dans la partie");
            if (mark != session.CurrentTurn)
                return (session, "Ce n'est pas votre tour");
            if (session.PlayerO == null)
                return (session, "En attente du second joueur");

            session.Board[position] = mark;
            session.UpdatedAt = DateTime.UtcNow;

            session.Winner = ComputeWinner(session.Board);
            if (session.Winner == null)
            {
                session.IsDraw = session.Board.All(c => !string.IsNullOrEmpty(c));
                session.CurrentTurn = mark == "X" ? "O" : "X";
            }

            return (session, null);
        }

        public GameSession? Reset(string id)
        {
            if (!_sessions.TryGetValue(id, out var session)) return null;

            session.Board = new string[9] { "", "", "", "", "", "", "", "", "" };
            session.CurrentTurn = "X";
            session.Winner = null;
            session.IsDraw = false;
            session.UpdatedAt = DateTime.UtcNow;

            return session;
        }

        public ChatMessage? AddMessage(string sessionId, string playerId, string content)
        {
            if (!_sessions.TryGetValue(sessionId, out var session)) return null;

            string playerName = "Inconnu";
            if (session.PlayerX != null && session.PlayerX.Id == playerId)
                playerName = session.PlayerX.Name;
            else if (session.PlayerO != null && session.PlayerO.Id == playerId)
                playerName = session.PlayerO.Name;
            else
                return null;

            var message = new ChatMessage
            {
                Id = Guid.NewGuid().ToString("N").Substring(0, 8),
                PlayerId = playerId,
                PlayerName = playerName,
                Content = content,
                SentAt = DateTime.UtcNow
            };

            session.Messages.Add(message);
            session.UpdatedAt = DateTime.UtcNow;

            return message;
        }

        private static string? ComputeWinner(string[] b)
        {
            int[][] lines =
            [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6],
            ];

            foreach (var line in lines)
            {
                var a = b[line[0]];
                if (!string.IsNullOrEmpty(a) && a == b[line[1]] && a == b[line[2]])
                    return a;
            }

            return null;
        }
    }
}