using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using RessourceRelationnelle.DATA;
using RessourceRelationnelle.DATA.Models;

namespace RessourceRelationnelle.API.Services
{
    public static class DataServices
    {
        public static async Task Initialize(IServiceProvider provider)
        {
            var configuration = provider.GetRequiredService<IConfiguration>();
            var context = provider.GetRequiredService<DataContext>();
            var userManager = provider.GetRequiredService<UserManager<UserModel>>();

            // Ajout des rôles
            string[] roles = configuration.GetSection("Roles").Get<string[]>();
            foreach (var item in roles)
            {
                if (!context.Roles.Any(r => r.Name == item))
                {
                    var identityRole = new IdentityRole(item) { NormalizedName = item.ToUpper() };
                    var roleStore = new RoleStore<IdentityRole>(context);
                    await roleStore.CreateAsync(identityRole);
                }
            }
            await context.SaveChangesAsync();

            // Ajout des utilisateurs par défaut
            var defaultUsers = configuration.GetSection("DefaultUsers").Get<List<DefaultUser>>();
            foreach (var defaultUser in defaultUsers)
            {
                if (await userManager.FindByEmailAsync(defaultUser.Email) == null)
                {
                    var user = new UserModel
                    {
                        UserName = defaultUser.Email,
                        NormalizedEmail = defaultUser.Email.ToUpper(),
                        Email = defaultUser.Email,
                        EmailConfirmed = true,
                        IsActive = true
                    };
                    var result = await userManager.CreateAsync(user, defaultUser.Password);
                    if (result.Succeeded)
                        await userManager.AddToRoleAsync(user, defaultUser.Role);
                }
            }

            // Ajout des catégories par défaut
            var defaultCategories = configuration.GetSection("DefaultCategories").Get<List<DefaultCategory>>();
            foreach (var item in defaultCategories)
            {
                if (!context.Categories.Any(c => c.Id == item.Id))
                {
                    context.Categories.Add(new CategoryModel
                    {
                        Id = item.Id,
                        CategoryName = item.CategoryName
                    });
                }
            }
            await context.SaveChangesAsync();

            // Ajout des types de ressources par défaut
            var defaultTypeResources = configuration.GetSection("DefaultTypeResources").Get<List<DefaultTypeResource>>();
            foreach (var item in defaultTypeResources)
            {
                if (!context.TypeResources.Any(t => t.Id == item.Id))
                {
                    context.TypeResources.Add(new TypeResourceModel
                    {
                        Id = item.Id,
                        TypeRessource = item.TypeRessource
                    });
                }
            }
            await context.SaveChangesAsync();

            // Ajout des types de relations par défaut
            var defaultTypeRelations = configuration.GetSection("DefaultTypeRelations").Get<List<DefaultTypeRelation>>();
            foreach (var item in defaultTypeRelations)
            {
                if (!context.TypeRelations.Any(t => t.Id == item.Id))
                {
                    context.TypeRelations.Add(new TypeRelationModel
                    {
                        Id = item.Id,
                        TypeRelation = item.TypeRelation
                    });
                }
            }
            await context.SaveChangesAsync();

            var defaultResources = configuration.GetSection("DefaultResources").Get<List<DefaultResource>>();

            foreach (var item in defaultResources)
            {
                if (!context.Resources.Any(r => r.Id == item.Id))
                {
                    var user = await userManager.FindByEmailAsync(item.UserEmail);

                    context.Resources.Add(new ResourceModel
                    {
                        Id = item.Id,
                        Title = item.Title,
                        Resume = item.Resume,
                        Content = item.Content,
                        IsVisible = item.IsVisible,
                        PublicationStatus = item.PublicationStatus,
                        UpdatedAt = null,
                        PublishedAt = DateTime.UtcNow,
                        CreatedAt = DateTime.UtcNow,
                        UserId = user.Id,
                        CategoryId = item.CategoryId,
                        TypeRessourceId = item.TypeResourceId,
                        TypeRelationId = item.TypeRelationId
                    });
                }
            }
            await context.SaveChangesAsync();
        }

        public class DefaultUser
        {
            public string Email { get; set; }
            public string Password { get; set; }
            public string Role { get; set; }
        }

        public class DefaultCategory
        {
            public string Id { get; set; }
            public string CategoryName { get; set; }
        }

        public class DefaultTypeResource
        {
            public string Id { get; set; }
            public string TypeRessource { get; set; }
        }

        public class DefaultTypeRelation
        {
            public string Id { get; set; }
            public string TypeRelation { get; set; }
        }

        public class DefaultResource
        {
            public string Id { get; set; }
            public string Title { get; set; }
            public string Resume { get; set; }
            public string Content { get; set; }
            public bool IsVisible { get; set; }
            public string PublicationStatus { get; set; }
            public string CategoryId { get; set; }
            public string TypeResourceId { get; set; }
            public string TypeRelationId { get; set; }
            public string UserEmail { get; set; }
        }
    }
}