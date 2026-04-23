using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA;

namespace RessourceRelationnelle.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public class StatisticsController : ControllerBase
    {
        private readonly DataContext context;

        public StatisticsController(DataContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllStats()
        {
            // Utilisateurs par zone géographique
            var usersByZone = await context.Users
                .Where(u => u.DemographicZoneId != null)
                .Join(context.DemographicsZone,
                    u => u.DemographicZoneId,
                    z => z.Id,
                    (u, z) => z.Zone)
                .GroupBy(z => z)
                .Select(g => new { Zone = g.Key, Count = g.Count() })
                .ToListAsync();

            // Ressources par catégorie
            var resourcesByCategory = await context.Resources
                .Join(context.Categories,
                    r => r.CategoryId,
                    c => c.Id,
                    (r, c) => c.CategoryName)
                .GroupBy(c => c)
                .Select(g => new { Category = g.Key, Count = g.Count() })
                .ToListAsync();

            // Ressources par type
            var resourcesByType = await context.Resources
                .Join(context.TypeResources,
                    r => r.TypeRessourceId,
                    t => t.Id,
                    (r, t) => t.TypeRessource)
                .GroupBy(t => t)
                .Select(g => new { Type = g.Key, Count = g.Count() })
                .ToListAsync();

            // Ressources les plus mises en favori
            var topFavorites = await context.Progression
                .Where(p => p.IsFavorite)
                .GroupBy(p => p.ResourceId)
                .Select(g => new { ResourceId = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Take(10)
                .Join(context.Resources,
                    p => p.ResourceId,
                    r => r.Id,
                    (p, r) => new { r.Title, p.Count })
                .ToListAsync();

            // Ressources les plus bookmarkées
            var topBookmarked = await context.Progression
                .Where(p => p.BookMarked)
                .GroupBy(p => p.ResourceId)
                .Select(g => new { ResourceId = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Take(10)
                .Join(context.Resources,
                    p => p.ResourceId,
                    r => r.Id,
                    (p, r) => new { r.Title, p.Count })
                .ToListAsync();

            // Commentaires par statut
            var commentsByStatus = await context.Comments
                .GroupBy(c => c.ModerationStatus)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();

            // Totaux généraux
            var totalUsers = await context.Users.CountAsync();
            var totalResources = await context.Resources.CountAsync();
            var totalComments = await context.Comments.CountAsync();
            var totalEvents = await context.Event.CountAsync();

            return Ok(new
            {
                Totals = new
                {
                    Users = totalUsers,
                    Resources = totalResources,
                    Comments = totalComments,
                    Events = totalEvents
                },
                UsersByZone = usersByZone,
                ResourcesByCategory = resourcesByCategory,
                ResourcesByType = resourcesByType,
                TopFavorites = topFavorites,
                TopBookmarked = topBookmarked,
                CommentsByStatus = commentsByStatus
            });
        }
    }
}