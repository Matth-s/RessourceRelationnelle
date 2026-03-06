using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;

namespace RessourceRelationnelle.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminResourceController : ControllerBase
    {
        private readonly IResourceRepository repository;
        private readonly UserManager<UserModel> userManager;
        public AdminResourceController(IResourceRepository configuration, UserManager<UserModel> userManager, RoleManager<IdentityRole> roleManager)
        {
            this.repository = configuration;
            this.userManager = userManager;
        }

        /******************************* Create Ressource *********************************/
      
        /******************************* Update Status *********************************/
        // "PENDING", "APPROVED", "REJECTED"
        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult> UpdatePublicationStatus(string id, [FromBody] ResourceModel model)
        {
            try
            {
                ResourceModel? existingResource = await repository.GetOne(id);
                if (existingResource == null) return NotFound(new { message = "Resource not found" });
                ResourceModel modelUpdatedDatabse = await repository.Update(model);
                return Ok(modelUpdatedDatabse);
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }        

        /**************** DELETE RESSOURCE ******************/
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult> DeleteResource(string id)
        {
            try
            {
                ResourceModel? existingResource = await repository.GetOne(id);
                if (existingResource == null) return NotFound(new { message = "Resource not found" });
                await repository.Delete(id);
                return Ok(new { message = "Resource deleted successfully" });
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
