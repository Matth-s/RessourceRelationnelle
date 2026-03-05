using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using RessourceRelationnelle.DATA; 

namespace RessourceRelationnelle.API.Services
{
    public static class DataServices
    {
        // provider: récupérer un service
        public static async Task Initialize(IServiceProvider provider)
        {
            var configuration = provider.GetRequiredService<IConfiguration>();
            var context = provider.GetRequiredService<DataContext>();

            // Ajout des rôles
            string[] roles = configuration.GetSection("Roles").Get<string[]>();
            foreach (var item in roles)
            {
                if (!context.Roles.Any(r => r.Name == item))
                {
                    var identityRole = new IdentityRole(item)
                    {
                        NormalizedName = item.ToUpper()
                    };
                    var roleStore = new RoleStore<IdentityRole>(context);
                    await roleStore.CreateAsync(identityRole);
                }
            }
            await context.SaveChangesAsync();
        }
    }
}
