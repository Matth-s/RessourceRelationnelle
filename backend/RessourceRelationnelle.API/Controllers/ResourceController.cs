using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RessourceRelationnelle.API.Services;
using RessourceRelationnelle.Data.Repositories.Sql;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;

namespace RessourceRelationnelle.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResourceController : ControllerBase
    {
        private readonly IResourceRepository repository;
        private readonly UserManager<UserModel> userManager;
        private readonly IStorageService storageService;

        public ResourceController(
            IResourceRepository configuration,
            UserManager<UserModel> userManager,
            IStorageService storageService)
        {
            this.repository = configuration;
            this.userManager = userManager;
            this.storageService = storageService;
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ResourceModel>> GetOne(string id)
        {
            try
            {
                ResourceModel? resource = await repository.GetOne(id);
                if (resource == null)
                    return NotFound();

                return Ok(resource);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("UserResources/{userId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ResourceModel>>> GetForUser(string? userId = null)
        {
            try
            {
                IEnumerable<ResourceModel> resources = await repository.GetForUser(userId);
                return Ok(resources);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ResourcesReturn>>> GetAll()
        {
            try
            {
                IEnumerable<ResourcesReturn> resources = await repository.GetAll();
                return Ok(resources);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> Create([FromBody] CreateResourceModel model)
        {
            string? userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            UserModel? user = await userManager.FindByIdAsync(userId);

            if (user == null)
                return Unauthorized();
            try
            {
                ResourceModel resource = new()
                {
                    Title = model.Title,
                    Resume = model.Resume,
                    Content = model.Content,
                    Url = model.Url,
                    PublicationStatus = "Pending",
                    IsVisible = false,
                    CreatedAt = DateTime.UtcNow,
                    UserId = userId,
                    CategoryId = model.CategoryId,
                    TypeRessourceId = model.ResourceTypeId,
                    TypeRelationId = model.RelationTypeId
                };

                var created = await repository.Create(resource);

                return Ok(created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("upload")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> CreateWithFile([FromForm] CreateResourceWithFileModel model)
        {
            string? userId = userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            UserModel? user = await userManager.FindByIdAsync(userId);
            if (user == null) return Unauthorized();

            try
            {
                string fileUrl = string.Empty;

                if (model.File != null && model.File.Length > 0)
                {
                    var folder = model.File.ContentType.StartsWith("video/")
                        ? "videos"
                        : "pdfs";

                    fileUrl = await storageService.UploadFileAsync(model.File, folder);
                }
                else if (!string.IsNullOrEmpty(model.Url))
                {
                    fileUrl = model.Url;
                }

                ResourceModel resource = new()
                {
                    Title = model.Title,
                    Resume = model.Resume,
                    Content = model.Content ?? string.Empty,
                    Url = fileUrl,
                    PublicationStatus = "Pending",
                    IsVisible = false,
                    CreatedAt = DateTime.UtcNow,
                    UserId = userId,
                    CategoryId = model.CategoryId,
                    TypeRessourceId = model.ResourceTypeId,
                    TypeRelationId = model.RelationTypeId
                };

                var created = await repository.Create(resource);
                return Ok(created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Delete(string id)
        {
            try
            {
                ResourceModel? resource = await repository.GetOne(id);
                if (resource == null) return NotFound(new { message = "Ressource not found" });
                await repository.Delete(resource.Id);
                return Ok(new { message = "Resource deleted" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Update([FromBody] UpdateResourceModel model)
        {
            try
            {
                ResourceModel? existingResource = await repository.GetOne(model.Id);
                if (existingResource == null) return NotFound(new { message = "Ressource not found" });
                ResourceModel updateResource = await repository.Update(model);
                UpdateResourceModel updatedModel = new()
                {
                    Title = updateResource.Title,
                    Resume = updateResource.Resume,
                    Content = updateResource.Content,
                    Url = updateResource.Url,
                    UpdatedAt = updateResource.UpdatedAt,
                    CategoryId = updateResource.CategoryId,
                    ResourceTypeId = updateResource.TypeRessourceId,
                    RelationTypeId = updateResource.TypeRelationId
                };
                return Ok(updatedModel);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        public class CreateResourceModel
        {
            public string Title { get; set; } = string.Empty;
            public string Resume { get; set; } = string.Empty;
            public string Content { get; set; } = string.Empty;
            public string Url { get; set; } = string.Empty;
            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
            public string CategoryId { get; set; } = string.Empty;
            public string ResourceTypeId { get; set; } = string.Empty;
            public string RelationTypeId { get; set; } = string.Empty;
        }

        public class CreateResourceWithFileModel
        {
            public string Title { get; set; } = string.Empty;
            public string Resume { get; set; } = string.Empty;
            public string? Content { get; set; }
            public string? Url { get; set; }
            public IFormFile? File { get; set; }
            public string CategoryId { get; set; } = string.Empty;
            public string ResourceTypeId { get; set; } = string.Empty;
            public string RelationTypeId { get; set; } = string.Empty;
        }
    }
}