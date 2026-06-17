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

        public async Task<ResourcesReturn> Create(ResourceModel model)
        {
            model.Id = Guid.NewGuid().ToString();
            context.Resources.Add(model);
            await context.SaveChangesAsync();

            ResourceModel resourceModel = await context.Resources
                .Include(r => r.User)
                .Include(r => r.Category)
                .Include(r => r.TypeRessource)
                .Include(r => r.TypeRelation)
                .FirstAsync(r => r.Id == model.Id);

            if (resourceModel == null)
                return null;

            return new ResourcesReturn
            {
                Id = resourceModel.Id,
                Title = resourceModel.Title,
                Resume = resourceModel.Resume,
                Content = resourceModel.Content,
                MediaType = resourceModel.MediaTtype,
                MediaUrl = resourceModel.MediaUrl,
                IsVisible = resourceModel.IsVisible,
                PublicationStatus = resourceModel.PublicationStatus,
                UpdatedAt = resourceModel.UpdatedAt,
                PublishedAt = resourceModel.PublishedAt,
                CreatedAt = resourceModel.CreatedAt,
                ViewCount = resourceModel.ViewCount,
                LikeCount = resourceModel.Likes.Count,
                User = new UserDto { Id = resourceModel.User.Id, Username = resourceModel.User.UserName },
                Category = resourceModel.Category,
                TypeResource = resourceModel.TypeRessource,
                TypeRelation = new TypeRelationDto { Id = resourceModel.TypeRelation.Id, TypeRelation = resourceModel.TypeRelation.TypeRelation }
            };
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

        public async Task<ResourcesReturn?> GetOne(string userId, string resourceId)
        {
            var r = await context.Resources
                .Include(r => r.User)
                .Include(r => r.Category)
                .Include(r => r.TypeRessource)
                .Include(r => r.TypeRelation)
                .Include(r => r.Likes)
                .Include(r => r.Comments)
                    .ThenInclude(c => c.User)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == resourceId);

            if (r == null)
                return null;

            LikeModel? liked = null;

            if (userId != null)
                liked = await context.Like.FindAsync(userId, resourceId);

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
                ViewCount = r.ViewCount,
                LikeCount = r.Likes.Count,
                Liked = liked != null,
                Comments = r.Comments.Where(c => c.ModerationStatus == "Approved").OrderByDescending(c => c.CreatedAt).Select(c => new CommentDto { Id = c.Id, Content = c.Content, CreatedAt = c.CreatedAt, ModerationStatus = c.ModerationStatus, User = new UserDto { Id = c.User.Id, Username = c.User.UserName } }).ToList(),
                User = new UserDto { Id = r.User.Id, Username = r.User.UserName },
                Category = r.Category,
                TypeResource = r.TypeRessource,
                TypeRelation = new TypeRelationDto { Id = r.TypeRelation.Id, TypeRelation = r.TypeRelation.TypeRelation }
            };
        }

        public async Task<IEnumerable<ResourcesReturn>> GetAll(bool includeAll = false)
        {
            var query = context.Resources
                .Include(r => r.User)
                .Include(r => r.Category)
                .Include(r => r.TypeRessource)
                .Include(r => r.TypeRelation)
                .Include(r => r.Likes)
                .AsQueryable();

            if (!includeAll)
            {
                query = query.Where(r => r.PublicationStatus == "Approved");
            }

            var resources = await query.ToListAsync();

            if (resources.Count == 0)
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
                    ViewCount = r.ViewCount,
                    LikeCount = r.Likes.Count,
                    User = new UserDto { Id = r.User.Id, Username = r.User.UserName },
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
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<ResourceModel> UpdateFull(ResourceModel resource)
        {
            await context.SaveChangesAsync();
            return resource;
        }

        public async Task<ResourceModel> UpdateStatus(string resourceId, UpdateStatusResourceDto model)
        {
            ResourceModel? existingResource = context.Resources.FirstOrDefault(x => x.Id == resourceId);

            if (existingResource == null)
            {
                return null;
            }

            existingResource.IsVisible = model.IsVisible;
            existingResource.PublicationStatus = model.PublicationStatus;

            context.Resources.Update(existingResource);

            await context.SaveChangesAsync();
            return existingResource;
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
        public int ViewCount { get; set; }
        public int LikeCount { get; set; }
        public bool Liked { get; set; } = false;
        public UserDto User { get; set; } = new UserDto();
        public CategoryModel Category { get; set; } = new CategoryModel();
        public TypeResourceModel TypeResource { get; set; } = new TypeResourceModel();
        public TypeRelationDto TypeRelation { get; set; } = new TypeRelationDto();
        public List<CommentDto> Comments { get; set; } = new List<CommentDto>();
    }

    public class CommentDto
    {
        public string Id { get; set; } = "";
        public string Content { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public string ModerationStatus { get; set; } = "";
        public UserDto User { get; set; } = new UserDto();
    }

    public class UserDto
    {
        public string Id { get; set; } = "";
        public string Username { get; set; } = "";
    }

    public class TypeRelationDto
    {
        public string Id { get; set; } = "";
        public string TypeRelation { get; set; } = "";
    }
}