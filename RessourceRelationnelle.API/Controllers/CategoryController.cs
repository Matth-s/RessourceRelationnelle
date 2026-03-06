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
        private readonly ICategoryRepository repository;
        private readonly UserManager<UserModel> userManager;

        public CategoryController(ICategoryRepository configuration, UserManager<UserModel> userManager)
        {
            this.repository = configuration;
            this.userManager = userManager;
        }

        /****************************** RECUPERER TOUTES LES CATEGORIES ******************************/
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult> GetAll()
        {
            try
            {
                IEnumerable<CategoryModel> categories = await repository.GetAll();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /****************************** DELETE ******************************/
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task <ActionResult> Delete(string id)
        {
            try
            {
                CategoryModel? category = await repository.GetOne(id);
                if (category == null) return NotFound(new { message = "Category not found" });
                await repository.Delete(category.Id);
                return Ok(new { message = "Category deleted" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /****************************** CREER ******************************/
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult> Create([FromBody] CreateNewCategoryModel model)
        {
            try
            {
                CategoryModel? existingCategory = await repository.GetOneByName(model.CategoryName.ToUpper());

                if (existingCategory != null) return Conflict(new { message = "Category already exists" });

                CategoryModel category = new()
                {
                    CategoryName = model.CategoryName.ToUpper(),
                };

                await repository.Create(category);
                return Ok(category);
            } 
            catch(Exception ex)
            {
                return BadRequest(ex.Message); 
            }
        }

        /****************************** UPDATE ******************************/
        public async Task<ActionResult> Update(string id, [FromBody] CreateNewCategoryModel model)
        {
            try
            {
                CategoryModel? existingCategory = repository.GetOne(id).Result;
                if (existingCategory == null) return NotFound(new { message = "Category not found" });
                existingCategory.CategoryName = model.CategoryName.ToUpper();
                repository.Update(existingCategory).Wait();
                return Ok(existingCategory);

            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        public class CreateNewCategoryModel
        {
            public string CategoryName { get; set; } = string.Empty;
        }
    }
}
