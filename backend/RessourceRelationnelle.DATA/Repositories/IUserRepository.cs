using RessourceRelationnelle.DATA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static SqlUserRepository;

namespace RessourceRelationnelle.DATA.Repositories
{
    public interface IUserRepository
    {
        Task<UserReturnAdmin?> GetById(string id);
        Task<UserReturnAdmin[]?> GetAll();
        Task<string> Delete(string id);
        Task<UserModel> Update(UserUpdateIdDto model);
        Task<string> Create(UserBody model);
    }

    public class UserBody
    {
        public string Email { get; set; } = "";
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
        public string ConfirmPassword { get; set; } = "";
        public List<string> Role { get; set; } = [];
    }
}
