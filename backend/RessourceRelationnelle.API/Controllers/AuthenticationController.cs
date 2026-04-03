using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RessourceRelationnelle.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly UserManager<UserModel> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private IUserRepository repository;

        public AuthenticationController(IConfiguration configuration, UserManager<UserModel> userManager, RoleManager<IdentityRole> roleManager, IUserRepository repository)
        {
            this.configuration = configuration;
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.repository = repository;
        }

        [HttpPost]
        [Route("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                var user = await userManager.FindByEmailAsync(model.Email);

                if (user == null || !await userManager.CheckPasswordAsync(user, model.Password))
                    return Unauthorized(new { message = "Email ou mot de passe incorrect" });

                if (!user.IsActive)
                    return Unauthorized(new { message = "Compte désactivé" });

                var authClaims = new List<Claim>()
                {
                    new (ClaimTypes.NameIdentifier, user.Id),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                var roles = await userManager.GetRolesAsync(user);
                foreach (var item in roles)
                    authClaims.Add(new Claim(ClaimTypes.Role, item));

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));

                var token = new JwtSecurityToken(
                    expires: DateTime.UtcNow.AddHours(1),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256));

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    email = user.Email,
                    expiration = token.ValidTo,
                    username = user.UserName,
                    role = roles,
                    demographicZone = user.DemographicZone?.Zone,
                    socialStatus = user.SocialStatus
                });
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

        }

        [HttpPost]
        [Route("signup")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] UserBody model)
        {
            if (model.Password != model.ConfirmPassword)
                return BadRequest("Passwords do not match.");

            string result = await repository.Create(model);

            switch (result)
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
    }

    public class LoginModel
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public class RegisterModel
    {
        public string Email { get; set; } = "";
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
        public string ConfirmPassword { get; set; } = "";
    }

}
