using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RessourceRelationnelle.API.Services;
using RessourceRelationnelle.DATA.Models;
using System.Security.Claims;

namespace RessourceRelationnelle.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly GameSessionService sessionService;
        private readonly UserManager<UserModel> userManager;

        public GameController(GameSessionService sessionService, UserManager<UserModel> userManager)
        {
            this.sessionService = sessionService;
            this.userManager = userManager;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult> Create([FromBody] CreateGameSessionModel model)
        {
            string? userId = userManager.GetUserId(User);

            PlayerInfo creator;
            if (userId != null)
            {
                UserModel? user = await userManager.FindByIdAsync(userId);
                creator = new PlayerInfo
                {
                    Id = userId,
                    Name = user?.UserName ?? "Joueur",
                    IsGuest = false,
                };
            }
            else
            {
                var guestId = Guid.NewGuid().ToString("N").Substring(0, 16);
                creator = new PlayerInfo
                {
                    Id = guestId,
                    Name = "Invité",
                    IsGuest = true,
                };
            }

            var session = sessionService.Create(model.ResourceId, creator);
            return Ok(new { session, playerId = creator.Id });
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public ActionResult Get(string id)
        {
            var session = sessionService.Get(id);
            if (session == null) 
                return NotFound(new { message = "Partie introuvable" });
            return Ok(session);
        }

        [HttpPost("{id}/join")]
        [AllowAnonymous]
        public async Task<ActionResult> Join(string id, [FromBody] JoinGameSessionModel? model)
        {
            string? userId = userManager.GetUserId(User);

            PlayerInfo player;
            if (userId != null)
            {
                UserModel? user = await userManager.FindByIdAsync(userId);
                player = new PlayerInfo
                {
                    Id = userId,
                    Name = user?.UserName ?? "Joueur",
                    IsGuest = false,
                };
            }
            else
            {
                var guestId = model?.GuestId;
                if (string.IsNullOrEmpty(guestId))
                    guestId = Guid.NewGuid().ToString("N");

                player = new PlayerInfo
                {
                    Id = guestId,
                    Name = string.IsNullOrWhiteSpace(model?.Name) ? "Invité" : model!.Name!,
                    IsGuest = true,
                };
            }

            var session = sessionService.Join(id, player);
            if (session == null) 
                return BadRequest(new { message = "Impossible de rejoindre la partie" });

            return Ok(new { session, playerId = player.Id });
        }

        [HttpPost("{id}/move")]
        [AllowAnonymous]
        public ActionResult Move(string id, [FromBody] MoveGameModel model)
        {
            string? userId = userManager.GetUserId(User);
            string? playerId = userId ?? model.GuestId;

            if (string.IsNullOrEmpty(playerId))
                return BadRequest(new { message = "Joueur non identifié" });

            var (session, error) = sessionService.Move(id, playerId, model.Position);

            if (session == null) 
                return NotFound(new { message = error ?? "Partie introuvable" });
            if (error != null) 
                return BadRequest(new { message = error });

            return Ok(session);
        }

        [HttpPost("{id}/reset")]
        [AllowAnonymous]
        public ActionResult Reset(string id)
        {
            var session = sessionService.Reset(id);
            if (session == null) 
                return NotFound(new { message = "Partie introuvable" });
            return Ok(session);
        }

        [HttpPost("{id}/chat")]
        [AllowAnonymous]
        public ActionResult SendMessage(string id, [FromBody] ChatMessageModel model)
        {
            string? userId = userManager.GetUserId(User);
            string? playerId = userId ?? model.GuestId;

            if (string.IsNullOrEmpty(playerId))
                return BadRequest(new { message = "Joueur non identifié" });

            var message = sessionService.AddMessage(id, playerId, model.Content);
            if (message == null)
                return BadRequest(new { message = "Impossible d'envoyer le message" });

            return Ok(message);
        }

        public class ChatMessageModel
        {
            public string Content { get; set; } = string.Empty;
            public string? GuestId { get; set; }
        }

        public class CreateGameSessionModel
        {
            public string? ResourceId { get; set; }
        }

        public class JoinGameSessionModel
        {
            public string? Name { get; set; }
            public string? GuestId { get; set; }
        }

        public class MoveGameModel
        {
            public int Position { get; set; }
            public string? GuestId { get; set; }
        }
    }
}
