using Microsoft.AspNetCore.Authorization; 
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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

        public ResourceController(IResourceRepository configuration, UserManager<UserModel> userManager)
        {
            this.repository = configuration;
            this.userManager = userManager;
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
                };

                await repository.Create(resource);

                return Ok(resource);
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }


        public class CreateResourceModel { 
            public string Title { get; set; } = string.Empty;
            public string Resume { get; set; } = string.Empty;
            public string Content { get; set; } = string.Empty;
            public string Url { get; set; } = string.Empty;  
            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        }

    } 
}
