using RessourceRelationnelle.DATA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RessourceRelationnelle.DATA.Repositories
{
    public interface ITypeResourceRepository
    {
        Task<TypeResourceModel> Create(TypeResourceModel model);
        Task<TypeResourceModel?> GetOne(string id);
        Task<TypeResourceModel?> GetOneByName(string name);
        Task<IEnumerable<TypeResourceModel>> GetAll();
        Task Delete(string id);
        Task<TypeResourceModel> Update(TypeResourceModel model);
    }
}
