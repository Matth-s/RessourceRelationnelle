using RessourceRelationnelle.DATA.Models;

namespace RessourceRelationnelle.DATA.Repositories
{
    public interface IRelationTypeRepository
    {
        Task<TypeRelationModel> Create(TypeRelationModel model);
        Task<TypeRelationModel?> GetOne(string id);
        Task<TypeRelationModel?> GetOneByName(string id);
        Task<IEnumerable<TypeRelationModel>> GetAll();
        Task Delete(string id);
        Task<TypeRelationModel> Update(TypeRelationModel model);
    }
}
