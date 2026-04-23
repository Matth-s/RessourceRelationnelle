using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA.Models;

namespace RessourceRelationnelle.DATA.Repositories.Sql
{
    public class SQLTypeResourceRepository : ITypeResourceRepository
    {
        private readonly DataContext context;

        public SQLTypeResourceRepository(DataContext context)
        {
            this.context = context;
        }

        public async Task<TypeResourceModel> Create(TypeResourceModel model)
        {
            model.Id = Guid.NewGuid().ToString();
            context.TypeResources.Add(model);
            await context.SaveChangesAsync();
            return model;
        }

        public async Task Delete(string id)
        {
            TypeResourceModel? existingTypeResource = await context.TypeResources
                .FirstOrDefaultAsync(x => x.Id == id);
            if (existingTypeResource != null)
            {
                context.TypeResources.Remove(existingTypeResource);
                await context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<TypeResourceModel>> GetAll()
        {
            return await context.TypeResources
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<TypeResourceModel?> GetOne(string id)
        {
            return await context.TypeResources
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<TypeResourceModel?> GetOneByName(string name)
        {
            return await context.TypeResources
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.TypeRessource == name);
        }

        public async Task<TypeResourceModel> Update(TypeResourceModel model)
        {
            TypeResourceModel? existing = await context.TypeResources
                .FirstOrDefaultAsync(x => x.Id == model.Id);

            if (existing == null)
                throw new Exception("Type de resource not found");

            existing.TypeRessource = model.TypeRessource;

            await context.SaveChangesAsync();
            return existing;
        }
    }
}
