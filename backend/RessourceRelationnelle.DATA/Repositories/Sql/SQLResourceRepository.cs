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
                //.Include(r => r.User)
                .Include(r => r.Category)
                .Include(r => r.TypeRessource)
                .Include(r => r.TypeRelation)
                .FirstAsync(r => r.Id == model.Id);
        }

        public async Task<IEnumerable<ResourceModel>> GetForUser(string? userId = null)
        {
            return await context.Resources
                //.Include(r => r.User)
                .Include(r => r.Category)
                .Include(r => r.TypeRessource)
                .Include(r => r.TypeRelation)
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }

        public async Task<ResourceModel?> GetOne(string id)
        {
            return await context.Resources
                //.Include(r => r.User)
                .Include(r => r.Category)
                .Include(r => r.TypeRessource)
                .Include(r => r.TypeRelation)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<ResourceModel>> GetAll()
        {
            return await context.Resources
                //.Include(r => r.User)
                .Include(r => r.Category)
                .Include(r => r.TypeRessource)
                .Include(r => r.TypeRelation)
                .ToListAsync();
        }

        public async Task Delete(string id)
        {
            ResourceModel? model = await context.Resources.FirstOrDefaultAsync(x => x.Id == id);
            if (model != null)
            {
                context.Resources.Remove(model);
                await context.SaveChangesAsync();
            }
        }

        public async Task<ResourceModel> Update(UpdateResourceModel model)
        {
            ResourceModel? existingResource = context.Resources.FirstOrDefault(x => x.Id == model.Id);

            if (existingResource == null)
            {
                throw new Exception("Resource not found");
            }
            existingResource.Title = model.Title;
            existingResource.Resume = model.Resume;
            existingResource.Content = model.Content;
            existingResource.Url = model.Url;
            existingResource.UpdatedAt = DateTime.UtcNow;
            existingResource.TypeRessourceId = model.ResourceTypeId;
            existingResource.TypeRelationId = model.RelationTypeId;

            context.Resources.Update(existingResource);

            await context.SaveChangesAsync();
            return existingResource;
        }
    }
}