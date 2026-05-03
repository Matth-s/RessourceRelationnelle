using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA;
using RessourceRelationnelle.Data.Repositories.Sql;
using System.Security.Claims;

namespace RessourceRelationnelle.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProgressionController : ControllerBase
    {
        private readonly DataContext context;

        public ProgressionController(DataContext context)
        {
            this.context = context;
        }

        [HttpGet("favorites")]
        [Authorize]
        public async Task<ActionResult> GetFavorites()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var favorites = await context.Progression
                .Where(p => p.UserId == userId && p.IsFavorite)
                .Include(p => p.Resource)
                    .ThenInclude(r => r.User)
                .Include(p => p.Resource)
                    .ThenInclude(r => r.Category)
                .Include(p => p.Resource)
                    .ThenInclude(r => r.TypeRessource)
                .Include(p => p.Resource)
                    .ThenInclude(r => r.TypeRelation)
                .Include(p => p.Resource)
                    .ThenInclude(r => r.Likes)
                .OrderByDescending(p => p.updatedAt)
                .Select(p => new ResourcesReturn
                {
                    Id = p.Resource.Id,
                    Title = p.Resource.Title,
                    Resume = p.Resource.Resume,
                    Content = p.Resource.Content,
                    MediaUrl = p.Resource.MediaUrl ?? "",
                    MediaType = p.Resource.MediaTtype ?? "",
                    IsVisible = p.Resource.IsVisible,
                    PublicationStatus = p.Resource.PublicationStatus,
                    CreatedAt = p.Resource.CreatedAt,
                    PublishedAt = p.Resource.PublishedAt,
                    ViewCount = p.Resource.ViewCount,
                    LikeCount = p.Resource.Likes.Count,
                    User = new UserDto { Id = p.Resource.User.Id, Username = p.Resource.User.UserName },
                    Category = p.Resource.Category,
                    TypeResource = p.Resource.TypeRessource,
                    TypeRelation = new TypeRelationDto { Id = p.Resource.TypeRelation.Id, TypeRelation = p.Resource.TypeRelation.TypeRelation }
                })
                .ToListAsync();

            return Ok(favorites);
        }

        [HttpGet("bookmarks")]
        [Authorize]
        public async Task<ActionResult> GetBookmarks()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var bookmarks = await context.Progression
                .Where(p => p.UserId == userId && p.BookMarked)
                .Include(p => p.Resource)
                    .ThenInclude(r => r.User)
                .Include(p => p.Resource)
                    .ThenInclude(r => r.Category)
                .Include(p => p.Resource)
                    .ThenInclude(r => r.TypeRessource)
                .Include(p => p.Resource)
                    .ThenInclude(r => r.TypeRelation)
                .Include(p => p.Resource)
                    .ThenInclude(r => r.Likes)
                .OrderByDescending(p => p.updatedAt)
                .Select(p => new ResourcesReturn
                {
                    Id = p.Resource.Id,
                    Title = p.Resource.Title,
                    Resume = p.Resource.Resume,
                    Content = p.Resource.Content,
                    MediaUrl = p.Resource.MediaUrl ?? "",
                    MediaType = p.Resource.MediaTtype ?? "",
                    IsVisible = p.Resource.IsVisible,
                    PublicationStatus = p.Resource.PublicationStatus,
                    CreatedAt = p.Resource.CreatedAt,
                    PublishedAt = p.Resource.PublishedAt,
                    ViewCount = p.Resource.ViewCount,
                    LikeCount = p.Resource.Likes.Count,
                    User = new UserDto { Id = p.Resource.User.Id, Username = p.Resource.User.UserName },
                    Category = p.Resource.Category,
                    TypeResource = p.Resource.TypeRessource,
                    TypeRelation = new TypeRelationDto { Id = p.Resource.TypeRelation.Id, TypeRelation = p.Resource.TypeRelation.TypeRelation }
                })
                .ToListAsync();

            return Ok(bookmarks);
        }

        [HttpPost("favorite/{resourceId}")]
        [Authorize]
        public async Task<ActionResult> ToggleFavorite(string resourceId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var progression = await context.Progression.FindAsync(userId, resourceId);

            if (progression == null)
            {
                progression = new DATA.Models.ProgressionModel
                {
                    UserId = userId,
                    ResourceId = resourceId,
                    IsFavorite = true,
                    updatedAt = DateTime.UtcNow
                };
                context.Progression.Add(progression);
            }
            else
            {
                progression.IsFavorite = !progression.IsFavorite;
                progression.updatedAt = DateTime.UtcNow;
            }

            await context.SaveChangesAsync();
            return Ok(new { isFavorite = progression.IsFavorite });
        }

        [HttpPost("bookmark/{resourceId}")]
        [Authorize]
        public async Task<ActionResult> ToggleBookmark(string resourceId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var progression = await context.Progression.FindAsync(userId, resourceId);

            if (progression == null)
            {
                progression = new DATA.Models.ProgressionModel
                {
                    UserId = userId,
                    ResourceId = resourceId,
                    BookMarked = true,
                    updatedAt = DateTime.UtcNow
                };
                context.Progression.Add(progression);
            }
            else
            {
                progression.BookMarked = !progression.BookMarked;
                progression.updatedAt = DateTime.UtcNow;
            }

            await context.SaveChangesAsync();
            return Ok(new { bookMarked = progression.BookMarked });
        }
    }
}