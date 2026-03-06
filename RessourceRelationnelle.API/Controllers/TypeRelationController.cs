using Microsoft.AspNetCore.Authorization; 
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;

namespace RessourceRelationnelle.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypeRelationController : ControllerBase
    {
        private readonly IRelationTypeRepository repository;
        private readonly UserManager<UserModel> userManager;

        public TypeRelationController(IRelationTypeRepository configuration, UserManager<UserModel> userManager)
        {
            this.repository = configuration;
            this.userManager = userManager;
        }

        /*************** get All une relation type ***************/
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<TypeRelationModel>>> GetAll()
        {
            try
            {
                IEnumerable<TypeRelationModel> typeRelations = await repository.GetAll();
                return Ok(typeRelations);
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving relation types.");
            }
        }

        /*************** Créer une relation type ***************/
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Create(CreateTypeRelationRequest model)
        {
            try
            {
                TypeRelationModel? existingTypeRelation = await repository.GetOneByName(model.TypeRelation);
                if(existingTypeRelation != null)
                {
                    return BadRequest("A relation type with the same name already exists.");
                }

                TypeRelationModel typeRelationModel = new()
                {
                    TypeRelation = model.TypeRelation.ToUpper(),
                };

                await repository.Create(typeRelationModel);

                return Ok(typeRelationModel);
            } catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the relation type.");
            }
        }

        /*************** Modifier une relation type ***************/
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Delete(string id, CreateTypeRelationRequest model)
        {
            try
            {
                TypeRelationModel? existingTypeRelation = await repository.GetOne(id);
                if (existingTypeRelation == null)
                {
                    return NotFound("Relation type not found.");
                }
                existingTypeRelation.TypeRelation = model.TypeRelation;
                await repository.Update(existingTypeRelation);
                return Ok("Relation type deleted successfully.");
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the relation type.");
            }
        }

        [HttpDelete("{id}")]
        [Authorize (Roles = "Admin")]
        public async Task<ActionResult> Update(string id)
        {
            try
            {
                TypeRelationModel? existingTypeRelation = await repository.GetOne(id);
                if (existingTypeRelation == null)
                {
                    return NotFound("Relation type not found.");
                }                  

                await repository.Delete(id);

                return Ok();
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the relation type.");
            }
        }
        public class CreateTypeRelationRequest
        {
            public string TypeRelation { get; set; } = string.Empty;
        }
    }
}
