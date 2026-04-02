using RessourceRelationnelle.DATA.Models;

namespace RessourceRelationnelle.DATA.Repositories
{
    public interface ICommentaryRepository
    {
        Task<List<CommentaryModel>> GetAll();
        Task<CommentaryModel?> GetById(string id);
        Task<bool> Delete(string id);
    }
}