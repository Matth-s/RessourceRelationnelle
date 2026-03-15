
using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA.Models;

namespace RessourceRelationnelle.DATA.Repositories.Sql
{
    public class SQLCategoryRepository : ICategoryRepository
    {
        private readonly DataContext context;

        public SQLCategoryRepository(DataContext context)
        {
            this.context = context;
        }

        public async Task<CategoryModel> Create(CategoryModel model)
        {
            model.Id = Guid.NewGuid().ToString();
            context.Categories.Add(model);
            await context.SaveChangesAsync();
            return model;
        }

        public async Task<IEnumerable<CategoryModel>> GetAll()
        {
            return await context.Categories
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<CategoryModel?> GetOne(string id)
        {
            return await context.Categories
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<CategoryModel?> GetOneByName(string name)
        {
            return await context.Categories
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.CategoryName == name);
        }

        public async Task Delete(string id)
        {
            CategoryModel? category = await context.Categories.FirstOrDefaultAsync(x => x.Id == id);
            if (category != null)
            {
                context.Categories.Remove(category);
                await context.SaveChangesAsync();
            }
        }

        public async Task<CategoryModel> Update(CategoryModel model)
        {
            CategoryModel? existingCategory = await context.Categories.FirstOrDefaultAsync(x => x.Id == model.Id);
            if (existingCategory == null)
            {
                throw new Exception("Category not found");
            }
            existingCategory.CategoryName = model.CategoryName;
            context.Categories.Update(existingCategory);

            await context.SaveChangesAsync();
            return existingCategory;
        }
    }
}
