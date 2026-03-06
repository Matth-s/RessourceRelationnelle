using RessourceRelationnelle.DATA.Models; 

namespace RessourceRelationnelle.DATA.Repositories
{
    public interface ICategotyRepository
    {
        Task<CategoryModel> Create(CategoryModel model);
        Task<CategoryModel?> GetOne(int id);
    }
}
