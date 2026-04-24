using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories.Sql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RessourceRelationnelle.DATA.Repositories
{
    public interface ILikeRepository
    {
        Task<LikeModel> Create(LikeDto model);
        Task<string> Delete(string userId, string resourceId);
        Task<List<LikesWResourcesDto>> GetAll();
        Task<List<LikesWResourcesDto>> GetLikesForUser(string userId);
        Task<List<LikesWResourcesDto>> GetLikesForResource(string resourceId);
    }
}
