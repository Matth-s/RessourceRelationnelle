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
                return Ok(new { isFavorite = false, bookMarked = false, resourceId });
            }

            return Ok(new
            {
                interaction.IsFavorite,
                interaction.BookMarked,
                interaction.ResourceId
            });
        }

        [HttpPost("favorite/{resourceId}")]
        public async Task<ActionResult> ToggleFavorite(string resourceId)
        {
            var userId = userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var result = await repository.ToggleFavorite(userId, resourceId);
            return Ok(new { result.IsFavorite, result.BookMarked, result.ResourceId });
        }

        [HttpPost("bookmark/{resourceId}")]
        public async Task<ActionResult> ToggleBookmark(string resourceId)
        {
            var userId = userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var result = await repository.ToggleBookmark(userId, resourceId);
            return Ok(new { result.IsFavorite, result.BookMarked, result.ResourceId });
        }
    }
}