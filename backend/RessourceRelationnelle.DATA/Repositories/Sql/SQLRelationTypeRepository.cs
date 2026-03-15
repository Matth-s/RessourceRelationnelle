using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA.Models;

namespace RessourceRelationnelle.DATA.Repositories.Sql
{
    public class SQLRelationTypeRepository : IRelationTypeRepository
    {
        private readonly DataContext context;

        public SQLRelationTypeRepository(DataContext context)
        {
            this.context = context;
        }

        public async Task<TypeRelationModel> Create(TypeRelationModel model)
        {
            model.Id = Guid.NewGuid().ToString();
            context.TypeRelations.Add(model);
            await context.SaveChangesAsync();
            return model;
        }

        public async Task Delete(string id)
        {
            TypeRelationModel? category = await context.TypeRelations.FirstOrDefaultAsync(x => x.Id == id);
            if (category != null)
            {
                context.TypeRelations.Remove(category);
                await context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<TypeRelationModel>> GetAll()
        {
            return await context.TypeRelations
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<TypeRelationModel?> GetOne(string id)
        {
            return await context.TypeRelations
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<TypeRelationModel?> GetOneByName(string name)
        {
            return await context.TypeRelations
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.TypeRelation == name);
        }
        public async Task<TypeRelationModel> Update(TypeRelationModel model)
        {
            TypeRelationModel? existingCategory = await context.TypeRelations.FirstOrDefaultAsync(x => x.Id == model.Id);
            
            if (existingCategory == null)
            {
                throw new Exception("Category not found");
            }
            existingCategory.TypeRelation = model.TypeRelation;
            context.TypeRelations.Update(existingCategory);

            await context.SaveChangesAsync();
            return existingCategory;

        }
    }
}
