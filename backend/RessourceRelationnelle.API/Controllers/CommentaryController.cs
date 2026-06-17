using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA;
using RessourceRelationnelle.DATA.Models;
using System.Security.Claims;

namespace RessourceRelationnelle.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentaryController : ControllerBase
    {
        private readonly DataContext context;

        public CommentaryController(DataContext context)
        {
            this.context = context;
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Create([FromBody] CreateCommentDto model)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var resource = await context.Resources.FindAsync(model.ResourceId);
            if (resource == null) return NotFound(new { message = "Ressource introuvable" });

            bool isAutoApprovedUser = User.IsInRole("Admin") ||
                                      User.IsInRole("SuperAdmin") ||
                                      User.IsInRole("Moderator");

            var comment = new CommentaryModel
            {
                Id = Guid.NewGuid().ToString(),
                Content = model.Content,

                ModerationStatus = isAutoApprovedUser ? "Approved" : "Pending",

                CreatedAt = DateTime.UtcNow,
                UserId = userId,
                ResourceId = model.ResourceId
            };

            context.Comments.Add(comment);
            await context.SaveChangesAsync();

            return Ok(new
            {
                message = "Commentaire ajouté",
                id = comment.Id
            });
        }

        [HttpGet("resource/{resourceId}")]
        [AllowAnonymous]
        public async Task<ActionResult> GetByResource(string resourceId)
        {
            var comments = await context.Comments
                .Where(c => c.ResourceId == resourceId && c.ModerationStatus == "Approved")
                .Include(c => c.User)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new
                {
                    c.Id,
                    c.Content,
                    c.CreatedAt,
                    c.ModerationStatus,
                    User = new { c.User.Id, Username = c.User.UserName }
                })
                .ToListAsync();

            return Ok(comments);
        }
    }

    public class CreateCommentDto
    {
        public string ResourceId { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }
}