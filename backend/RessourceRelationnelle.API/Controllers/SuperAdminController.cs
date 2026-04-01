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

            if (model.Password != model.ConfirmPassword)
                return BadRequest("Passwords do not match.");

            string result = await userRepository.Create(model);

            switch(result)
            {
                case "email":
                    return Conflict(new { message = "Email déjà existant" });
                case "username":
                    return Conflict(new { message = "Nom d'utilisateur déjà utilisé" });
                case "creation":
                    return BadRequest(new { message = "Erreur lors de la création de l'utilisareur" });
                default:
                    return Ok("Utilisateur créé");
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
            return Ok(new {message = "Utilisateur supprimé" });

            //TODO : vérifier qu'un admin peut pas supp un superadmin
        }

        [HttpPut("users/{id}")]
        [Authorize]
        public async Task<ActionResult> UpdateUser(string id, [FromBody] UserUpdateDto dto)
        {
            //TODO : verif roles non null
            if(id == null)
                return BadRequest(new {message = "L'id ne peut pas être vide"});

            UserUpdateIdDto userModel = new()
            {
                Id = id,
                Email = dto.Email,
                UserName = dto.Username,
                IsActive = dto.IsActive,
                Role = dto.Role
            };

            var userUpdated = await userRepository.Update(userModel);

            if (userUpdated == null)
                return NotFound(new { message = "Utilisateur non trouvé" });

            return Ok(new {message = "Utilisateur modifié"});
        }

        public class UserUpdateDto
        {
            public string Email { get; set; } = "";
            public string Username { get; set; } = "";
            public bool IsActive { get; set; }
            public List<string> Role { get; set; } = [];
        }
    }
}