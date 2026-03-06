
using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA.Models;

namespace RessourceRelationnelle.DATA.Repositories.Sql
{
    public class SQLCategoryRepository
    {
        private readonly DataContext context;

        public SQLCategoryRepository(DataContext context)
        {
            this.context = context;
        }

        public async Task<CategoryModel> Create(CategoryModel model)
        {
            context.Categories.Add(model);
            await context.SaveChangesAsync();
            return model;
        }

        public async Task<CategoryModel?> GetOne(string id)
        {
            return await context.Categories.FirstOrDefaultAsync(c => c.Id == id);
        }
    }
}
