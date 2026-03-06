using RessourceRelationnelle.DATA.Models; 

namespace RessourceRelationnelle.DATA.Repositories
{    public interface IResourceRepository
    {
        Task<ResourceModel> Create(ResourceModel model);
        Task<ResourceModel?> GetOne(string id);
        Task<IEnumerable<ResourceModel>> GetForUser(string? userId = null);
        Task Delete(string id); 
        Task<ResourceModel> Update(ResourceModel model);
    }
}
