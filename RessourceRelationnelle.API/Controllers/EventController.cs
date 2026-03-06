using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;
using System.Resources;

namespace RessourceRelationnelle.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly IEventRepository repository;
        private readonly UserManager<UserModel> userManager;

        public EventController(IEventRepository configuration, UserManager<UserModel> userManager)
        {
            this.repository = configuration;
            this.userManager = userManager;
        }

        /****************************** CREATE ******************************/
        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> Create([FromBody] CreateEventModel model)
        {
            string? userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            try
            {
                EventModel eventModel = new()
                {
                    Type = model.Type,
                    StartAt = model.StartAt,
                    UserId = userId,
                    ResourceId = model.ResourceId,
                };

                await repository.Create(eventModel);

                return Ok(eventModel);
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        /****************************** DELETE ******************************/
        [HttpDelete]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> Delete(string id)
        {
            EventModel? eventModel = await repository.GetEvent(id);

            if (eventModel == null)
                return NotFound();

            try
            {
                await repository.Delete(id);
                return Ok();
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        /****************************** UPDATE ******************************/
        [HttpPut("{id}")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> Update(string id, UpdateEventModel model)
        {
            EventModel eventModel = await repository.GetEvent(id);

            if(eventModel == null)
                return NotFound();

            eventModel.Type = model.Type;
            eventModel.StartAt = model.StartAt;
            eventModel.UserId = model.UserId;
            eventModel.ResourceId = model.ResourceId;
            eventModel.DemographicZoneId = model.DemographicZoneId;

            await repository.Update(id, eventModel);
            return Ok();
        }

        /****************************** GET BY ID ******************************/
        [HttpGet("{id}")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> GetId(string id)
        {
            EventModel eventModel = await repository.GetEvent(id);

            if(eventModel == null)
                return NotFound();

            return Ok(eventModel);
        }

        /****************************** GET ALL ******************************/
        [HttpGet]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> GetAll()
        {
            List<EventModel> eventModels = await repository.GetAll();
            return Ok(eventModels);
        }

        /****************************** GET EVENT FROM RESOURCE ******************************/
        [HttpGet]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> GetForResource(string id)
        {
            IEnumerable<EventModel> resourceFromModel = await repository.GetForResource(id);
            return Ok(resourceFromModel);
        }

        public class CreateEventModel
        {
            public string Type { get; set; } = string.Empty;
            public string ResourceId { get; set; } = string.Empty;
            public DateTime StartAt { get; set; } = DateTime.UtcNow;
        }

        public class UpdateEventModel
        {
            public string Type { get; set; } = string.Empty;
            public string ResourceId { get; set; } = string.Empty;
            public DateTime StartAt { get; set; }
            public string UserId {  get; set; } = string.Empty;
            public string DemographicZoneId {  get; set; } = string.Empty;
        }
    }
}
