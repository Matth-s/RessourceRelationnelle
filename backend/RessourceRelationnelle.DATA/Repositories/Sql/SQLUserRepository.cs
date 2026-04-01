using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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

    public async Task<string> Delete(string id)
    {
        UserModel? user = await context.Users.FirstOrDefaultAsync(x => x.Id == id);
        if (user == null)
            return null;

        context.Users.Remove(user);
        await context.SaveChangesAsync();
        return "ok";
    }

    public async Task<UserReturnAdmin[]?> GetAll()
    {
        var users = await userManager.Users.ToListAsync();
        if (users.Count == 0)
            return null;

        var returnUsers = new List<UserReturnAdmin>();
        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);
            returnUsers.Add(new UserReturnAdmin
            {
                Id = user.Id,
                CreatedAt = user.CreatedAt,
                IsActive = user.IsActive,
                Email = user.Email,
                Username = user.UserName,
                EmailVerified = user.EmailConfirmed,
                Role = roles.ToArray()
            });
        }

        return returnUsers.ToArray();
    }

    public async Task<UserModel?> GetById(string id)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user == null) return null;

        var roles = await userManager.GetRolesAsync(user);
        user.Roles = roles.ToList();

        return user;
    }

    public class UserReturnAdmin
    {
        public string Id { get; set; } = "";
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Email { get; set; } = "";

        public string Username { get; set; } = "";
        public bool EmailVerified { get; set; }

        public string[] Role { get; set; } = [];
    }
}