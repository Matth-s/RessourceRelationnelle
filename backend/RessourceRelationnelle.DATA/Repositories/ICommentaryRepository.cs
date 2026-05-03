using RessourceRelationnelle.DATA.Models;

namespace RessourceRelationnelle.DATA.Repositories
{
    public interface ICommentaryRepository
    {
        Task<List<CommentaryModel>> GetAll();
        Task<CommentaryModel?> GetById(string id);
        Task Update(CommentaryModel model);
        Task<bool> UpdateStatus(string id, string status);
        Task<bool> Delete(string id);
    }
}