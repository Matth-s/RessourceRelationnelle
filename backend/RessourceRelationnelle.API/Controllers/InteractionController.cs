using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;

namespace RessourceRelationnelle.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class InteractionController : ControllerBase
    {
        private readonly IInteractionRepository repository;
        private readonly UserManager<UserModel> userManager;

        public InteractionController(IInteractionRepository repository, UserManager<UserModel> userManager)
        {
            this.repository = repository;
            this.userManager = userManager;
        }

        [HttpGet("{resourceId}")]
        public async Task<ActionResult> Get(string resourceId)
        {
            var userId = userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var interaction = await repository.GetByUserAndResource(userId, resourceId);

            if (interaction == null)
            {
                return Ok(new { isFavorite = false, bookMarked = false,isExploited = false, resourceId });
            }

            return Ok(new
            {
                interaction.IsFavorite,
                interaction.BookMarked,
                interaction.IsExploited,
                interaction.ResourceId
            });
        }

        [HttpPost("favorite/{resourceId}")]
        public async Task<ActionResult> ToggleFavorite(string resourceId)
        {
            var userId = userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var result = await repository.ToggleFavorite(userId, resourceId);
            return Ok(new { result.IsFavorite, result.BookMarked, result.IsExploited, result.ResourceId });
        }

        [HttpPost("bookmark/{resourceId}")]
        public async Task<ActionResult> ToggleBookmark(string resourceId)
        {
            var userId = userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var result = await repository.ToggleBookmark(userId, resourceId);
            return Ok(new { result.IsFavorite, result.BookMarked, result.IsExploited, result.ResourceId });
        }

        [HttpPost("exploitation/{resourceId}")]
        public async Task<ActionResult> ToggleExploitation(string resourceId)
        {   
            var userId = userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var result = await repository.ToggleExploitation(userId, resourceId);
            return Ok(new { result.IsFavorite, result.BookMarked, result.IsExploited, result.ResourceId });
        }

        [HttpPost("mark-exploited/{resourceId}")]
        public async Task<ActionResult> MarkAsExploited(string resourceId)
        {
            var userId = userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var result = await repository.MarkAsExploited(userId, resourceId);
            return Ok(new { result.IsFavorite, result.BookMarked, result.IsExploited, result.ResourceId });
        }

        [HttpGet("favorites")]
        public async Task<ActionResult> GetFavorites()
        {
            var userId = userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var favorites = await repository.GetFavorites(userId);
            return Ok(favorites);
        }

        [HttpGet("bookmarks")]
        public async Task<ActionResult> GetBookmarks()
        {
            var userId = userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var bookmarks = await repository.GetBookmarks(userId);
            return Ok(bookmarks);
        }

        [HttpGet("exploited")]
        public async Task<ActionResult> GetExploited()
        {
            var userId = userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var exploited = await repository.GetExploited(userId);
            return Ok(exploited);
        }

    }
}