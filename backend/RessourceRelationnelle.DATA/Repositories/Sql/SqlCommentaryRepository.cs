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
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<CommentaryModel?> GetById(string id)
        {
            return await context.Comments.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task Update(CommentaryModel model)
        {
            context.Comments.Update(model);
            await context.SaveChangesAsync();
        }

        public async Task<bool> UpdateStatus(string id, string status)
        {
            var rows = await context.Comments
                .Where(c => c.Id == id)
                .ExecuteUpdateAsync(s => s.SetProperty(c => c.ModerationStatus, status));

            return rows > 0;
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