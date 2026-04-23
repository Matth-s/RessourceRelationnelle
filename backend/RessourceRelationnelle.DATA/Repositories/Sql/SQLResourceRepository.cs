using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;
using System.Globalization;
using static SqlUserRepository;

namespace RessourceRelationnelle.Data.Repositories.Sql
{
    public class SqlResourceRepository : IResourceRepository
    {
        private readonly DataContext context;

        public SqlResourceRepository(DataContext context)
        {
            this.context = context;
        }

        public async Task<ResourceModel> Create(ResourceModel model)
        {
            model.Id = Guid.NewGuid().ToString();
            context.Resources.Add(model);
            await context.SaveChangesAsync();

            return await context.Resources
                //.Include(r => r.User)
                .Include(r => r.Category)
                .Include(r => r.TypeRessource)
                .Include(r => r.TypeRelation)
                .FirstAsync(r => r.Id == model.Id);
        }

        public async Task<IEnumerable<ResourceModel>> GetForUser(string? userId = null)
        {
            return await context.Resources
                //.Include(r => r.User)
                .Include(r => r.Category)
                .Include(r => r.TypeRessource)
                .Include(r => r.TypeRelation)
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }

        public async Task<ResourcesReturn?> GetOne(string id)
        {
            var r = await context.Resources
                .Include(r => r.User)
                .Include(r => r.Category)
                .Include(r => r.TypeRessource)
                .Include(r => r.TypeRelation)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (r == null)
                return null;

            return new ResourcesReturn
            {
                Id = r.Id,
                Title = r.Title,
                Resume = r.Resume,
                Content = r.Content,
                MediaType = r.MediaTtype,
                MediaUrl = r.MediaUrl,
                IsVisible = r.IsVisible,
                PublicationStatus = r.PublicationStatus,
                UpdatedAt = r.UpdatedAt,
                PublishedAt = r.PublishedAt,
                CreatedAt = r.CreatedAt,
                User = new UserDto { Id = r.User.Id, Username = r.User.UserName },
                Category = r.Category,
                TypeResource = r.TypeRessource,
                TypeRelation = new TypeRelationDto { Id = r.TypeRelation.Id, TypeRelation = r.TypeRelation.TypeRelation }
            };
        }

        public async Task<IEnumerable<ResourcesReturn>> GetAll()
        {
            var resources = await context.Resources
                .Include(r => r.User)
                .Include(r => r.Category)
                .Include(r => r.TypeRessource)
                .Include(r => r.TypeRelation)
                .ToListAsync();

            if (resources.Count() == 0)
                return null;

            var returnResources = new List<ResourcesReturn>();

            foreach (var r in resources)
            {
                returnResources.Add(new ResourcesReturn
                {
                    Id = r.Id,
                    Title = r.Title,
                    Resume = r.Resume,
                    Content = r.Content,
                    MediaType = r.MediaTtype,
                    MediaUrl = r.MediaUrl,
                    IsVisible = r.IsVisible,
                    PublicationStatus = r.PublicationStatus,
                    UpdatedAt = r.UpdatedAt,
                    PublishedAt = r.PublishedAt,
                    CreatedAt = r.CreatedAt,
                    User = new UserDto { Id = r.User.Id, Username = r.User.UserName},
                    Category = r.Category,
                    TypeResource = r.TypeRessource,
                    TypeRelation = new TypeRelationDto { Id = r.TypeRelation.Id, TypeRelation = r.TypeRelation.TypeRelation }
                });
            }

            return returnResources.ToArray();
        }

        public async Task Delete(string id)
        {
            ResourceModel? model = await context.Resources.FirstOrDefaultAsync(x => x.Id == id);
            if (model != null)
            {
                context.Resources.Remove(model);
                await context.SaveChangesAsync();
            }
        }

        public async Task<ResourceModel> Update(UpdateResourceModel model)
        {
            ResourceModel? existingResource = context.Resources.FirstOrDefault(x => x.Id == model.Id);

            if (existingResource == null)
            {
                throw new Exception("Resource not found");
            }
            existingResource.Title = model.Title;
            existingResource.Resume = model.Resume;
            existingResource.Content = model.Content;
            existingResource.UpdatedAt = DateTime.UtcNow;
            existingResource.TypeRessourceId = model.ResourceTypeId;
            existingResource.TypeRelationId = model.RelationTypeId;

            context.Resources.Update(existingResource);

            await context.SaveChangesAsync();
            return existingResource;
        }

        public async Task<ResourceModel?> GetResource(string id)
        {
            return await context.Resources
                .Include(r => r.User)
                .Include(r => r.Category)
                .Include(r => r.TypeRessource)
                .Include(r => r.TypeRelation)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);
        }
    }

    public class ResourcesReturn
    {
        public string Id { get; set; } = "";
        public string Title { get; set; } = "";
        public string Resume { get; set; } = "";
        public string Content { get; set; } = "";
        public string MediaUrl { get; set; } = "";
        public string MediaType { get; set; } = "";
        public bool IsVisible { get; set; }
        public string PublicationStatus { get; set; } = "";
        public DateTime? UpdatedAt { get; set; }
        public DateTime PublishedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public UserDto User { get; set; } = new UserDto();
        public CategoryModel Category { get; set; } = new CategoryModel();
        public TypeResourceModel TypeResource { get; set; } = new TypeResourceModel();
        public TypeRelationDto TypeRelation { get; set; } = new TypeRelationDto();
    }

    public class UserDto
    {
        public string Id { get; set; } = "";
        public string Username { get; set; } = "";
    }

    public class TypeRelationDto
    {
        public string Id { get; set; } = "";
        public string TypeRelation{ get; set; } = "";
    }
}