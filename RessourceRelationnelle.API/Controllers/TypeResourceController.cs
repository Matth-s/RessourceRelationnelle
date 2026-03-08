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
    public class TypeResourceController : ControllerBase
    {
        private readonly ITypeResourceRepository repository;
        private readonly UserManager<UserModel> userManager;

        public TypeResourceController(ITypeResourceRepository configuration, UserManager<UserModel> userManager)
        {
            this.repository = configuration;
            this.userManager = userManager;
        }

        /****************************** RECUPERER TOUTES LES TYPES DE RESOURCE ******************************/
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult> GetAll()
        {
            try
            {
                IEnumerable<TypeResourceModel> categories = await repository.GetAll();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /****************************** RECUPERER UNE TYPE DE RESOURCE AVEC SON ID ******************************/
        [HttpGet("id")]
        [AllowAnonymous]
        public async Task<ActionResult> GetOne(string id)
        {
            try
            {
                TypeResourceModel? category = await repository.GetOne(id);
                if (category == null) return NotFound(new { message = "Type de resource not found" });
                return Ok(category);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /****************************** SUPPRIMER ******************************/
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Delete(string id)
        {
            try
            {
                TypeResourceModel? category = await repository.GetOne(id);
                if (category == null) return NotFound(new { message = "Type de resource not found" });
                await repository.Delete(category.Id);
                return Ok(new { message = "Type de resource deleted" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Update([FromBody] TypeResourceModel model)
        {
            try
            {
                TypeResourceModel? existingCategory = await repository.GetOne(model.Id);
                if (existingCategory == null) return NotFound(new { message = "Type de resource not found" });
                TypeResourceModel updatedCategory = await repository.Update(model);
                return Ok(updatedCategory);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Create([FromBody] CreateNewTypeResourceModel model)
        {
            try
            {
                TypeResourceModel? existingCategory = await repository.GetOneByName(model.TypeResource.ToUpper());
                if (existingCategory != null) return BadRequest(new { message = "Type de resource already exists" });
                TypeResourceModel createdCategory = await repository.Create(new TypeResourceModel { TypeRessource = model.TypeResource.ToUpper() });
                return Ok(createdCategory);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        public class CreateNewTypeResourceModel
        {
            public string TypeResource { get; set; }
        }
    }
}
