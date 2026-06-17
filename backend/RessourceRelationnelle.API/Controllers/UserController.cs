using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;
using System.Globalization;
using System.Linq;
using System.Security.Claims;

namespace RessourceRelationnelle.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly IUserRepository repository;
        private readonly UserManager<UserModel> userManager;

        public UserController(IUserRepository configuration, UserManager<UserModel> userManager)
        {
            this.repository = configuration;
            this.userManager = userManager;
        }

        [HttpGet]
        [Route("current")]
        [Authorize]
        public async Task<ActionResult> GetUserByToken()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized(new { message = "Erreur lors de la récupération de l'utilisateur" });

            var user = await repository.GetUserById(userId);

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (user == null)
                return NotFound(new { message = "Utilisateur non trouvé" });

            List<string> roles = await repository.GetRolesByUserId(userId);

            UserInforReturn returnUser = new()
            {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email,
                Role = roles,
                SocialStatus = user.SocialStatus,
                DemographicZone = user.DemographicZone?.Zone,
                Token = token,
            };


            return Ok(returnUser);
        }
    }

    public class UserInforReturn
    {
        public string Id { get; set; } = "";
        public string Username { get; set; } = "";
        public string Email { get; set; } = "";
        public List<string> Role { get; set; } = [];
        public string SocialStatus { get; set; } = "";
        public string DemographicZone { get; set; } = "";
        public string Token { get; set; } = "";
    }
}
