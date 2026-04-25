using RessourceRelationnelle.DATA.Models;

namespace RessourceRelationnelle.DATA.Repositories
{
    public interface ICommentaryRepository
    {
        Task<List<CommentaryModel>> GetAll();
        Task<List<CommentaryModel>> GetByResourceId(string resourceId);
        Task<CommentaryModel?> GetById(string id);
        Task<List<CommentaryModel>> GetByUserId(string userId);
        Task<CommentaryModel> Update(CommentaryModel model);
        Task<CommentaryModel> Create(CommentaryModel model);
        Task<bool> Delete(string id);
    }
}