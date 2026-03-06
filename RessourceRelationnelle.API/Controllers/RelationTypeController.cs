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
    public class RelationTypeController : ControllerBase
    {
        private readonly IRelationTypeRepository repository;
        private readonly UserManager<UserModel> userManager;

        public RelationTypeController(IRelationTypeRepository configuration, UserManager<UserModel> userManager)
        {
            this.repository = configuration;
            this.userManager = userManager;
        }

        /****************************** RECUPERER TOUTES LES TYPES DE RELATION ******************************/
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult> GetAll()
        {
            try
            {
                IEnumerable<TypeRelationModel> categories = await repository.GetAll();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /****************************** RECUPERER UNE TYPE DE RELATION AVEC SON ID ******************************/
        [HttpGet("id")]
        [AllowAnonymous]
        public async Task<ActionResult> GetOne(string id)
        {
            try
            {
                TypeRelationModel? category = await repository.GetOne(id);
                if (category == null) return NotFound(new { message = "Type de relation not found" });
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
                TypeRelationModel? category = await repository.GetOne(id);
                if (category == null) return NotFound(new { message = "Type de relation not found" });
                await repository.Delete(category.Id);
                return Ok(new { message = "Type de relation deleted" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Update([FromBody] TypeRelationModel model)
        {
            try
            {
                TypeRelationModel? existingCategory = await repository.GetOne(model.Id);
                if (existingCategory == null) return NotFound(new { message = "Type de relation not found" });
                TypeRelationModel updatedCategory = await repository.Update(model);
                return Ok(updatedCategory);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Create([FromBody] CreateNewTypeRelationModel model)
        {
            try
            {
                TypeRelationModel? existingCategory = await repository.GetOneByName(model.TypeRelation.ToUpper());
                if (existingCategory != null) return BadRequest(new { message = "Type de relation already exists" });
                TypeRelationModel createdCategory = await repository.Create(new TypeRelationModel { TypeRelation = model.TypeRelation.ToUpper() });
                return Ok(createdCategory);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        public class CreateNewTypeRelationModel
        {
            public string TypeRelation { get; set; }
        }
    }
}
