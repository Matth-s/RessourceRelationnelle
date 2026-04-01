using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;
using static SqlUserRepository;

public class SqlUserRepository : IUserRepository
{
    private readonly DataContext context;
    private readonly UserManager<UserModel> userManager;

    public SqlUserRepository(DataContext context, UserManager<UserModel> userManager)
    {
        this.context = context;
        this.userManager = userManager;
    }

    public async Task<string> Create(UserBody model)
    {
        UserModel? user = await context.Users.FirstOrDefaultAsync(x => x.Email ==  model.Email);

        if (user != null)
            return "email";

        user = await context.Users.FirstOrDefaultAsync(x => x.UserName == model.Username);

        if (user != null)
            return "username";

        user = new()
        {
            Email = model.Email,
            UserName = model.Username,
            IsActive = false
        };

        IdentityResult result = await userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
            return "creation";

        foreach (var role in model.Role)
            await userManager.AddToRoleAsync(user, role.ToUpper());

        return "ok";
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
                Role = roles.ToList()
            });
        }

        return returnUsers.ToArray();
    }

    public async Task<UserReturnAdmin?> GetById(string id)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user == null) return null;

        var roles = await userManager.GetRolesAsync(user);
        UserReturnAdmin userReturn = new()
        {
            Id = user.Id,
            CreatedAt = user.CreatedAt,
            IsActive = user.IsActive,
            Email = user.Email,
            Username = user.UserName,
            EmailVerified = user.EmailConfirmed,
            Role = roles.ToList()
        };

        return userReturn;
    }

    public async Task<UserModel> Update(UserUpdateIdDto model)
    {
        var user = await userManager.FindByIdAsync(model.Id);

        if (user == null)
            return null;

        user.Email = model.Email;
        user.UserName = model.UserName;
        user.IsActive = model.IsActive;

        await userManager.UpdateAsync(user);

        var currentRoles = await userManager.GetRolesAsync(user);

        var rolesToAdd = model.Role.Except(currentRoles);
        var rolesToRemove = currentRoles.Except(model.Role);

        await userManager.AddToRolesAsync(user, rolesToAdd);
        await userManager.RemoveFromRolesAsync(user, rolesToRemove);

        return user;
    }

    public class UserUpdateIdDto
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public bool IsActive { get; set; }
        public List<string> Role { get; set; }
    }

    public class UserReturnAdmin
    {
        public string Id { get; set; } = "";
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Email { get; set; } = "";

        public string Username { get; set; } = "";
        public bool EmailVerified { get; set; }

        public List<string> Role { get; set; } = [];
    }
}
