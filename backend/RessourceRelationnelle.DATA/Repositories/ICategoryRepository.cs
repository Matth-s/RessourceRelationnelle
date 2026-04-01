using RessourceRelationnelle.DATA.Models; 

namespace RessourceRelationnelle.DATA.Repositories
{

    public interface ICategoryRepository
    {
        Task<CategoryModel> Create(CategoryModel model);
        Task<CategoryModel?> GetOne(string id);
        Task<CategoryModel?> GetOneByName(string id);
        Task<IEnumerable<CategoryModel>> GetAll();
        Task Delete(string id);
        Task<CategoryModel> Update(CategoryModel model);
        Task<CategoryModel?> GetByName(string name);
    }
}