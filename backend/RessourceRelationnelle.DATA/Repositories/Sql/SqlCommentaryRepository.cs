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

        public async Task<List<CommentaryModel>> GetByResourceId(string resourceId)
        {
            return await context.Comments
                .Where(c => c.ResourceId == resourceId && c.ModerationStatus == "Approved")
                .Include(c => c.User)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<CommentaryModel?> GetById(string id)
        {
            return await context.Comments.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<List<CommentaryModel>> GetByUserId(string userId)
        {
            return await context.Comments
                .Where(c => c.UserId == userId)
                .Include(c => c.User)
                .Include(c => c.Resource)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<CommentaryModel> Update(CommentaryModel model)
        {
            context.Comments.Update(model);
            await context.SaveChangesAsync();
            return model;
        }

        public async Task<CommentaryModel> Create(CommentaryModel model)
        {
            model.Id = Guid.NewGuid().ToString();
            model.CreatedAt = DateTime.UtcNow;
            model.ModerationStatus = "Pending";
            context.Comments.Add(model);
            await context.SaveChangesAsync();
            return model;
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