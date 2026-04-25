using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;

namespace RessourceRelationnelle.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentaryController : ControllerBase
    {
        private readonly ICommentaryRepository repository;
        private readonly UserManager<UserModel> userManager;

        public CommentaryController(ICommentaryRepository repository, UserManager<UserModel> userManager)
        {
            this.repository = repository;
            this.userManager = userManager;
        }

        [HttpGet("resource/{resourceId}")]
        [AllowAnonymous]
        public async Task<ActionResult> GetByResource(string resourceId)
        {
            var comments = await repository.GetByResourceId(resourceId);
            var result = comments.Select(c => new
            {
                c.Id,
                c.Content,
                c.CreatedAt,
                c.ModerationStatus,
                c.ResourceId,
                c.UserId,
                User = c.User != null ? new { c.User.UserName } : null
            });
            return Ok(result);
        }

        [HttpGet]
        [Authorize(Roles = "Admin,SuperAdmin,Moderator")]
        public async Task<ActionResult> GetAll()
        {
            var comments = await repository.GetAll();
            var result = comments.Select(c => new
            {
                c.Id,
                c.Content,
                c.CreatedAt,
                c.ModerationStatus,
                c.ResourceId,
                c.UserId,
                User = c.User != null ? new { c.User.UserName } : null,
                Resource = c.Resource != null ? new { c.Resource.Id, c.Resource.Title } : null
            });
            return Ok(result);
        }

        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<ActionResult> GetByUser(string userId)
        {
            var comments = await repository.GetByUserId(userId);
            var result = comments.Select(c => new
            {
                c.Id,
                c.Content,
                c.CreatedAt,
                c.ModerationStatus,
                c.ResourceId,
                User = c.User != null ? new { c.User.UserName } : null,
                Resource = c.Resource != null ? new { c.Resource.Id, c.Resource.Title } : null
            });
            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Create([FromBody] CreateCommentModel model)
        {
            var userId = userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var comment = new CommentaryModel
            {
                Content = model.Content,
                ResourceId = model.ResourceId,
                UserId = userId
            };

            var created = await repository.Create(comment);
            return Ok(new
            {
                created.Id,
                created.Content,
                created.CreatedAt,
                created.ModerationStatus,
                created.ResourceId,
                created.UserId
            });
        }
    }

    public class CreateCommentModel
    {
        public string Content { get; set; } = string.Empty;
        public string ResourceId { get; set; } = string.Empty;
    }
}