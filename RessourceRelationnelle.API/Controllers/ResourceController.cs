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
        private readonly RoleManager<UserModel> roleManager;

        public ResourceController(IResourceRepository configuration, UserManager<UserModel> userManager)
        {
            this.repository = configuration;
            this.userManager = userManager;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult> Create([FromBody] string model)
        {
            string? userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            UserModel? user = await userManager.FindByIdAsync(userId);

            if (user == null)
                return Unauthorized();

            var roles = await userManager.GetRolesAsync(user);

            try
            {
                return Ok(new
                {
                    UserId = userId,
                    Roles = roles
                });
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    } 
}
