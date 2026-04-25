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
    }
}