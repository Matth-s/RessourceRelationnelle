using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RessourceRelationnelle.DATA.Repositories.Sql
{
    public class SQLLikeRepository : ILikeRepository
    {
        private readonly DataContext context;

        public SQLLikeRepository(DataContext context)
        {
            this.context = context;
        }

        public async Task<LikeModel> Create(LikeDto model)
        {

            var existingLike = await context.Like.FindAsync(model.UserId, model.ResourceId);

            if (existingLike != null)
            {
                return null;
            }

            LikeModel like = new()
            {
                UserId = model.UserId,
                ResourceId = model.ResourceId
            };

            context.Like.Add(like);
            await context.SaveChangesAsync();

            return like;
        }

        public async Task<string> Delete(string userId, string resourceId)
        {
            var existingLike = await context.Like.FindAsync(userId, resourceId);

            if (existingLike != null)
            {
                context.Like.Remove(existingLike);
                await context.SaveChangesAsync();
                return "ok";
            }
            else
                return null;
        }

        public async Task<List<LikesWResourcesDto>> GetAll()
        {
            List<LikeModel> likes = await context.Like.AsNoTracking().Include(r => r.Resource).Include(r => r.User).ToListAsync();

            if (likes.Count == 0)
                return null;

            List<LikesWResourcesDto> returnLikes = new List<LikesWResourcesDto>();
            foreach (var like in likes)
            {
                returnLikes.Add(new LikesWResourcesDto
                {
                    UserId = like.UserId,
                    ResourceId = like.ResourceId,
                    UserName = like.User.UserName,
                    Title = like.Resource.Title,
                    Resume = like.Resource.Resume,
                    Content = like.Resource.Content,
                });
            }

            return returnLikes;
        }

        public async Task<List<LikesWResourcesDto>> GetLikesForResource(string resourceId)
        {
            List<LikeModel> likes = await context.Like.Where(l => l.ResourceId == resourceId).Include(r => r.Resource).Include(r => r.User).ToListAsync();

            if (likes.Count == 0)
                return null;


            List<LikesWResourcesDto> returnLikes = new List<LikesWResourcesDto>();
            foreach (var like in likes)
            {
                returnLikes.Add(new LikesWResourcesDto
                {
                    UserId = like.UserId,
                    ResourceId = like.ResourceId,
                    UserName = like.User.UserName,
                    Title = like.Resource.Title,
                    Resume = like.Resource.Resume,
                    Content = like.Resource.Content,
                });
            }

            return returnLikes;

        }

        public Task<List<LikesWResourcesDto>> GetLikesForUser(string userId)
        {
            throw new NotImplementedException();
        }
    }

    public class LikeDto
    {
        public string UserId { get; set; } = "";
        public string ResourceId { get; set; } = "";
    }

    public class LikesWResourcesDto
    {
        public string UserId { get; set; } = "";
        public string ResourceId { get; set; } = "";
        public string UserName { get; set; } = "";
        public string Title { get; set; } = "";
        public string Resume { get; set; } = "";
        public string Content { get; set; } = "";
    }
}
