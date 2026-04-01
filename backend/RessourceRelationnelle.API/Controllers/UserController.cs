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
                return Unauthorized();

            var user = await repository.GetById(userId);

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            UserReturn returnUser = new()
            {
                Username = user.Username,
                Role = user.Role.ToList(),
                Token = token
            };

            if (user == null)
                return NotFound();

            return Ok(returnUser);
        }
    }
    public class UserReturn
    {
        public string Username { get; set; } = "";
        public List<string> Role { get; set; } = [];
        public string Token { get; set; } = "";
    }
}
