using RessourceRelationnelle.DATA.Models; 

namespace RessourceRelationnelle.DATA.Repositories
{
    public interface ICategotyRepository
    {
        Task<CategoryModel> Create(CategoryModel model);
        Task<CategoryModel?> GetOne(int id);
        Task<IEnumerable<CategoryModel>> GetAll();
        Task<CategoryModel> GetById(string id);
        Task<CategoryModel> GetByName(string name); 
    }
}
