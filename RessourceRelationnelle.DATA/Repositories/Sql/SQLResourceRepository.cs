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
            context.Resources.Add(model);
            await context.SaveChangesAsync();
            return model;
        }

        public async Task<IEnumerable<ResourceModel>> GetForUser(string? userId = null)
        {
            return await context.Resources.Where(x => x.UserId == userId).ToListAsync();
        }

        public async Task<ResourceModel?> GetOne(string id)
        {
            return await context.Resources
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}