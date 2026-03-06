using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;

namespace RessourceRelationnelle.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategotyRepository repository;
        private readonly UserManager<UserModel> userManager;

        public CategoryController(ICategotyRepository configuration, UserManager<UserModel> userManager)
        {
            this.repository = configuration;
            this.userManager = userManager;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public Task<ActionResult> Create([FromBody] CreateNewCategoryModel model)
        {

            return Task.FromResult<ActionResult>(Ok());
        }


        public class CreateNewCategoryModel
        {
            public string CategoryName { get; set; } = string.Empty;
        }
    }
}
