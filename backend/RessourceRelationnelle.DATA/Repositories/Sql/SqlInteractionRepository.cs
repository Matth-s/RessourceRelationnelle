using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA.Models;

namespace RessourceRelationnelle.DATA.Repositories.Sql
{
    public class SqlInteractionRepository : IInteractionRepository
    {
        private readonly DataContext context;

        public SqlInteractionRepository(DataContext context)
        {
            this.context = context;
        }

        public async Task<InteractionModel?> GetByUserAndResource(string userId, string resourceId)
        {
            return await context.Interactions
                .FirstOrDefaultAsync(i => i.UserId == userId && i.ResourceId == resourceId);
        }

        public async Task<InteractionModel> ToggleFavorite(string userId, string resourceId)
        {
            var interaction = await GetByUserAndResource(userId, resourceId);

            if (interaction == null)
            {
                interaction = new InteractionModel
                {
                    UserId = userId,
                    ResourceId = resourceId,
                    IsFavorite = true,
                    BookMarked = false,
                    IsExploited = false,
                    updatedAt = DateTime.UtcNow
                };
                context.Interactions.Add(interaction);
            }
            else
            {
                interaction.IsFavorite = !interaction.IsFavorite;
                interaction.updatedAt = DateTime.UtcNow;
            }

            await context.SaveChangesAsync();
            return interaction;
        }

        public async Task<InteractionModel> ToggleBookmark(string userId, string resourceId)
        {
            var interaction = await GetByUserAndResource(userId, resourceId);

            if (interaction == null)
            {
                interaction = new InteractionModel
                {
                    UserId = userId,
                    ResourceId = resourceId,
                    IsFavorite = false,
                    BookMarked = true,
                    IsExploited = false,
                    updatedAt = DateTime.UtcNow
                };
                context.Interactions.Add(interaction);
            }
            else
            {
                interaction.BookMarked = !interaction.BookMarked;
                interaction.updatedAt = DateTime.UtcNow;
            }

            await context.SaveChangesAsync();
            return interaction;
        }

        public async Task<InteractionModel> ToggleExploitation(string userId, string resourceId)
        {
            var interaction = await GetByUserAndResource(userId, resourceId);

            if (interaction == null)
            {
                interaction = new InteractionModel
                {
                    UserId = userId,
                    ResourceId = resourceId,
                    IsFavorite = false,
                    BookMarked = false,
                    IsExploited = true,
                    updatedAt = DateTime.UtcNow
                };
                context.Interactions.Add(interaction);
            }
            else
            {
                interaction.IsExploited = !interaction.IsExploited;
                interaction.updatedAt = DateTime.UtcNow;
            }

            await context.SaveChangesAsync();
            return interaction;
        }

        public async Task<InteractionModel> MarkAsExploited(string userId, string resourceId)
        {
            var interaction = await GetByUserAndResource(userId, resourceId);

            if (interaction == null)
            {
                interaction = new InteractionModel
                {
                    UserId = userId,
                    ResourceId = resourceId,
                    IsFavorite = false,
                    BookMarked = false,
                    IsExploited = true,
                    updatedAt = DateTime.UtcNow
                };
                context.Interactions.Add(interaction);
                await context.SaveChangesAsync();
            }
            else if (!interaction.IsExploited)
            {
                interaction.IsExploited = true;
                interaction.updatedAt = DateTime.UtcNow;
                await context.SaveChangesAsync();
            }

            return interaction;
        }

        public async Task<List<InteractionModel>> GetFavorites(string userId)
        {
            return await context.Interactions
                .Where(i => i.UserId == userId && i.IsFavorite)
                .ToListAsync();
        }

        public async Task<List<InteractionModel>> GetBookmarks(string userId)
        {
            return await context.Interactions
                .Where(i => i.UserId == userId && i.BookMarked)
                .ToListAsync();
        }

        public async Task<List<InteractionModel>> GetExploited(string userId)
        {
            return await context.Interactions
                .Where(i => i.UserId == userId && i.IsExploited)
                .ToListAsync();
        }
    }
}