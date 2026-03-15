using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using RessourceRelationnelle.DATA.Models;
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

        public AuthenticationController(IConfiguration configuration, UserManager<UserModel> userManager, RoleManager<IdentityRole> roleManager)
        {
            this.configuration = configuration;
            this.userManager = userManager;
            this.roleManager = roleManager;
        }

        [HttpPost]
        [Route("login")]  
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginModel model) 
        {
            var user = await userManager.FindByEmailAsync(model.Email);

            if (user == null || !await userManager.CheckPasswordAsync(user, model.Password))
                return Unauthorized();
             
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
                expiration = token.ValidTo
            });
        }

        [HttpPost]
        [Route("signup")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
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

                await userManager.AddToRoleAsync(user, "User");

                return Ok();
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
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
