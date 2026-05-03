using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RessourceRelationnelle.API.Services;
using RessourceRelationnelle.Data.Repositories.Sql;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;
using System.Globalization;
using System.Security.Claims;

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
        public async Task<ActionResult<ResourcesReturn>> GetOne(string id, [FromServices] ResourceViewService viewService)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                ResourcesReturn? resource = await repository.GetOne(userId, id);

                if (resource == null)
                    return NotFound();

                await viewService.RecordViewAsync(id);

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
        public async Task<ActionResult<IEnumerable<ResourcesReturn>>> GetAll([FromQuery] bool includeAll = false)
        {
            try
            {
                bool isAdmin = false;
                if (includeAll)
                {
                    var roles = User.FindAll(System.Security.Claims.ClaimTypes.Role).Select(r => r.Value);
                    isAdmin = roles.Contains("Admin") || roles.Contains("SuperAdmin") || roles.Contains("Moderator");
                }

                IEnumerable<ResourcesReturn> resources = await repository.GetAll(isAdmin);
                if (resources == null)
                    return NotFound();
                return Ok(resources);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> CreateWithFile([FromForm] CreateResourceWithFileModel model)
        {
            string? userId = userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            UserModel? user = await userManager.FindByIdAsync(userId);
            if (user == null) return Unauthorized();

            try
            {
                string fileUrl = null;
                string folder = null;

                if (model.File != null && model.File.Length > 0)
                {

                    var extension = Path.GetExtension(model.File.FileName)?.ToLowerInvariant();
                    var contentType = model.File.ContentType?.ToLowerInvariant();


                    if (contentType.StartsWith("image/") ||
                        extension is ".jpg" or ".jpeg" or ".png" or ".gif" or ".webp" or ".bmp" or ".svg")
                    {
                        folder = "images";
                    }
                    else if (contentType.StartsWith("video/") ||
                             extension is ".mp4" or ".webm" or ".avi" or ".mov" or ".mkv")
                    {
                        folder = "videos";
                    }
                    else if (contentType == "application/pdf" || extension == ".pdf")
                    {
                        folder = "pdfs";
                    }
                    else
                    {
                        folder = "others";
                    }

                    fileUrl = await storageService.UploadFileAsync(model.File, folder);
                }

                if (fileUrl == null && !string.IsNullOrWhiteSpace(model.Url))
                {
                    if (model.Url.Contains("youtube.com") || model.Url.Contains("youtu.be"))
                    {
                        folder = "video";
                    }
                }

                ResourceModel resource = new()
                {
                    Title = model.Title,
                    Resume = model.Resume,
                    Content = model.Content,
                    PublicationStatus = model.PublicationStatus,
                    IsVisible = model.IsVisible ?? false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    PublishedAt = DateTime.UtcNow,
                    UserId = userId,
                    CategoryId = model.CategoryId,
                    TypeRessourceId = model.ResourceTypeId,
                    TypeRelationId = model.RelationTypeId,
                    MediaTtype = folder?.EndsWith("s") == true ? folder[..^1] : folder,
                    MediaUrl = fileUrl ?? model.Url ?? null,
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
                ResourceModel? resource = await repository.GetResource(id);
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
        [Authorize]
        public async Task<ActionResult> Update([FromBody] UpdateResourceModel model)
        {
            try
            {
                string? userId = userManager.GetUserId(User);
                if (userId == null) return Unauthorized();

                ResourceModel? existingResource = await repository.GetResource(model.Id);
                if (existingResource == null) return NotFound(new { message = "Ressource not found" });

                // Vérifier que l'utilisateur est le créateur ou un admin
                var roles = User.FindAll(System.Security.Claims.ClaimTypes.Role).Select(r => r.Value);
                bool isAdmin = roles.Contains("Admin") || roles.Contains("SuperAdmin");

                if (existingResource.UserId != userId && !isAdmin)
                    return Forbid();

                ResourceModel updateResource = await repository.Update(model);
                UpdateResourceModel updatedModel = new()
                {
                    Id = updateResource.Id,
                    Title = updateResource.Title,
                    Resume = updateResource.Resume,
                    Content = updateResource.Content,
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

        [HttpPut("{resourceId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Update(string resourceId, [FromBody] UpdateStatusResourceDto model)
        {
            try
            {
                ResourceModel updateResource = await repository.UpdateStatus(resourceId, model);

                if (updateResource == null)
                    return NotFound(new { message = "Resource not found" });

                return Ok(new { message = "Resource edited" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        public class CreateResourceWithFileModel
        {
            public string Title { get; set; } = string.Empty;
            public string Resume { get; set; } = string.Empty;
            public string Content { get; set; } = string.Empty;
            public string? Url { get; set; }
            public IFormFile? File { get; set; }
            public string CategoryId { get; set; } = string.Empty;
            public string ResourceTypeId { get; set; } = string.Empty;
            public string RelationTypeId { get; set; } = string.Empty;
            public bool? IsVisible { get; set; } = false;
            public string? PublicationStatus { get; set; } = "Pending";
        }
    }
}