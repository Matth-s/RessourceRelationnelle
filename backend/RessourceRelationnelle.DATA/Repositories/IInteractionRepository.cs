using RessourceRelationnelle.DATA.Models;

namespace RessourceRelationnelle.DATA.Repositories
{
    public interface IInteractionRepository
    {
        Task<InteractionModel?> GetByUserAndResource(string userId, string resourceId);
        Task<InteractionModel> ToggleFavorite(string userId, string resourceId);
        Task<InteractionModel> ToggleBookmark(string userId, string resourceId);
    }
}