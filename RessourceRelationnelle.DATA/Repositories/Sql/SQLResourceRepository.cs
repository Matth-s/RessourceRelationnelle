using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;

namespace RessourceRelationnelle.Data.Repositories.Sql
{
    public class SqlResourceRepository : IResourceRepository
    {
        private readonly DataContext context;

        public SqlResourceRepository(DataContext context)
        {
            this.context = context;
        }

        public async Task<ResourceModel> Create(ResourceModel model)
        {
            model.Id = Guid.NewGuid().ToString();
            context.Resources.Add(model);
            await context.SaveChangesAsync();

            return await context.Resources
                .Include(r => r.User)
                .Include(r => r.Category)
                .Include(r => r.TypeRessource)
                .Include(r => r.TypeRelation)
                .FirstAsync(r => r.Id == model.Id);
        }

        public async Task<IEnumerable<ResourceModel>> GetForUser(string? userId = null)
        {
            return await context.Resources
                .Include(r => r.User)
                .Include(r => r.Category)
                .Include(r => r.TypeRessource)
                .Include(r => r.TypeRelation)
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }

        public async Task<ResourceModel?> GetOne(string id)
        {
            return await context.Resources
                .Include(r => r.User)
                .Include(r => r.Category)
                .Include(r => r.TypeRessource)
                .Include(r => r.TypeRelation)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}