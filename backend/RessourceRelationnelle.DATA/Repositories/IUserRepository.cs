using RessourceRelationnelle.DATA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RessourceRelationnelle.DATA.Repositories
{
    public interface IUserRepository
    {
        Task<UserModel?> GetById(string id);

    }
}
