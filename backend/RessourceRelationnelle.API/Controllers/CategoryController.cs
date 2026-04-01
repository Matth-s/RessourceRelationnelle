using Microsoft.AspNetCore.Authorization; 
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA;
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
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Create([FromBody] CreateNewCategoryModel model)
        {
            try
            {
                CategoryModel? existingCategory = await repository.GetOneByName(model.CategoryName.ToUpper());

                if (existingCategory != null) return Conflict(new { message = "La caétgorie existe déjà" });

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
        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Update(string id, [FromBody] CreateNewCategoryModel model)
        {
            try
            {
                CategoryModel? existingCategory = await repository.GetOne(id);
                if (existingCategory == null) return NotFound(new { message = "Category not found" });

                CategoryModel? alreadyExistingCategory = await repository.GetByName(model.CategoryName);
                if(alreadyExistingCategory != null)
                    return Conflict(new { message = "Category already exists" });
                existingCategory.CategoryName = model.CategoryName.ToUpper();
                await repository.Update(existingCategory);
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
