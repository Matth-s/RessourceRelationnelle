using Microsoft.AspNetCore.Identity;
using RessourceRelationnelle.DATA;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;

public class SqlUserRepository : IUserRepository
{
    private readonly DataContext context;
    private readonly UserManager<UserModel> userManager;

    public SqlUserRepository(DataContext context, UserManager<UserModel> userManager)
    {
        this.context = context;
        this.userManager = userManager;
    }

    public async Task<UserModel?> GetById(string id)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user == null) return null;

        var roles = await userManager.GetRolesAsync(user);
        user.Roles = roles.ToList();

        return user;
    }
}