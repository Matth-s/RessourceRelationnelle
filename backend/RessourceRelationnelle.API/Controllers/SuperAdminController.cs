using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;
using static SqlUserRepository;

namespace RessourceRelationnelle.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuperAdminController : ControllerBase
    { 
        private readonly UserManager<UserModel> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IUserRepository userRepository;

        public SuperAdminController( UserManager<UserModel> userManager, RoleManager<IdentityRole> roleManager, IUserRepository userRepository)
        { 
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.userRepository = userRepository;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult> CreateAccount([FromBody] UserBody model)
        {
            {
                try
                {
                    if (model.Password != model.ConfirmPassword)
                        return BadRequest("Passwords do not match.");

                    UserModel? user = await userManager.FindByEmailAsync(model.Email);
                    if (user != null)
                        return StatusCode(StatusCodes.Status500InternalServerError);

                    user = new()
                    {
                        Email = model.Email,
                        UserName = model.Username,
                        SecurityStamp = Guid.NewGuid().ToString(),
                    };

                    IdentityResult result = await userManager.CreateAsync(user, model.Password);

                    if (!result.Succeeded)
                        return StatusCode(StatusCodes.Status500InternalServerError);

                    await userManager.AddToRoleAsync(user, model.Role.ToUpper());

                    return Ok();
                }
                catch (Exception ex)
                {
                    return StatusCode(500, ex.Message);
                }

            }
        }

        [HttpGet("users")]
        [Authorize]
        public async Task<ActionResult> GetAllUsers()
        {
            UserReturnAdmin[] users = await userRepository.GetAll();

            if (users.Length == 0)
                return NotFound(new { message = "Aucun utilisateur trouvé" });
            
            return Ok(users);
        }

        [HttpDelete("users/{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteUser(string id)
        {
            string deleted = await userRepository.Delete(id);

            if(deleted == null)
                return NotFound(new {message = "Utilisateur non trouvé"});
            return Ok("Utilisateur supprimé");
        }

        public class UserBody
        {
            public string Email { get; set; } = "";
            public string Username { get; set; } = "";
            public string Password { get; set; } = "";
            public string ConfirmPassword { get; set; } = "";
            public string Role { get; set; } = "";
        }
    }
}
