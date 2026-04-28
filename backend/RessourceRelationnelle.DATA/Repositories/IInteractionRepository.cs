using RessourceRelationnelle.DATA.Models;

namespace RessourceRelationnelle.DATA.Repositories
{
    public interface IInteractionRepository
    {
        Task<InteractionModel?> GetByUserAndResource(string userId, string resourceId);
        Task<InteractionModel> ToggleFavorite(string userId, string resourceId);
        Task<InteractionModel> ToggleBookmark(string userId, string resourceId);
        Task<InteractionModel> ToggleExploitation(string userId, string resourceId);
        Task<List<InteractionModel>> GetFavorites(string userId);
        Task<List<InteractionModel>> GetBookmarks(string userId);
        Task<List<InteractionModel>> GetExploited(string userId);
    
    }
}