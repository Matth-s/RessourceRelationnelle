using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA.Models;

namespace RessourceRelationnelle.DATA.Repositories.Sql
{
    public class SqlCommentaryRepository : ICommentaryRepository
    {
        private readonly DataContext context;

        public SqlCommentaryRepository(DataContext context)
        {
            this.context = context;
        }

        public async Task<List<CommentaryModel>> GetAll()
        {
            return await context.Comments
                .Include(c => c.User)
                .Include(c => c.Resource)
                .ToListAsync();
        }

        public async Task<CommentaryModel?> GetById(string id)
        {
            return await context.Comments.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<bool> Delete(string id)
        {
            var comment = await context.Comments.FirstOrDefaultAsync(c => c.Id == id);
            if (comment == null) return false;

            context.Comments.Remove(comment);
            await context.SaveChangesAsync();
            return true;
        }
    }
}