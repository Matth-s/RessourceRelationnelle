using RessourceRelationnelle.Data.Repositories.Sql;
using RessourceRelationnelle.DATA.Models; 

namespace RessourceRelationnelle.DATA.Repositories
{    public interface IResourceRepository
    {
        Task<ResourceModel> Create(ResourceModel model);
        Task<ResourcesReturn?> GetOne(string userId, string resourceId);
        Task<ResourceModel?> GetResource(string id);

        Task<IEnumerable<ResourceModel>> GetForUser(string? userId = null);
        Task<IEnumerable<ResourcesReturn>> GetAll();
        Task Delete(string id);
        Task<ResourceModel> Update(UpdateResourceModel model);
    }
    public class UpdateResourceModel
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Resume { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime? UpdatedAt { get; set; }
        public string CategoryId { get; set; } = string.Empty;
        public string ResourceTypeId { get; set; } = string.Empty;
        public string RelationTypeId { get; set; } = string.Empty;
    }
}
