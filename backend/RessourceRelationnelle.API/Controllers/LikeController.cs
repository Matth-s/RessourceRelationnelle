using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;
using RessourceRelationnelle.DATA.Repositories.Sql;
using System.Security.Claims;
using static RessourceRelationnelle.API.Controllers.CategoryController;

namespace RessourceRelationnelle.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LikeController : ControllerBase
    {
        private readonly ILikeRepository repository;
        private readonly UserManager<UserModel> userManager;

        public LikeController(ILikeRepository configuration, UserManager<UserModel> userManager)
        {
            this.repository = configuration;
            this.userManager = userManager;
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Create([FromBody] LikeDto model)
        {
            try
            {
                LikeModel? createLike = await repository.Create(model);

                if (createLike == null) return Conflict(new { message = "Ressource déjà likée" });

                return Ok(createLike);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> Delete(string id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userId == null)
                    return Unauthorized(new { message = "Erreur lors de la récupération de l'utilisateur" });

                string deleted = await repository.Delete(userId, id);
                if(deleted == null)
                    return NotFound(new { message = "Like non trouvé" });
                return Ok(new { message = "Like supprimé" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GetAll()
        {
            List<LikesWResourcesDto>? likes = await repository.GetAll();

            if (likes == null)
                return NotFound(new { message = "Aucun likes trouvé" });

            return Ok(likes);
        }

        [HttpGet("{resourceId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GetByResource(string resourceId)
        {
            List<LikesWResourcesDto>? likes = await repository.GetLikesForResource(resourceId);

            if (likes == null)
                return NotFound(new { message = "Aucun likes trouvé" });

            return Ok(likes);
        }
    }
}
