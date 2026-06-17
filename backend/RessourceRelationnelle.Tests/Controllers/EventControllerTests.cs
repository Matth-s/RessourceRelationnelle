using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using RessourceRelationnelle.API.Controllers;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;
using System.Security.Claims;
using Xunit;

namespace RessourceRelationnelle.Tests.Controllers
{
    public class EventControllerTests
    {
        private readonly Mock<IEventRepository> mockRepo;
        private readonly Mock<UserManager<UserModel>> mockUserManager;
        private readonly EventController controller;

        public EventControllerTests()
        {
            mockRepo = new Mock<IEventRepository>();
            mockUserManager = new Mock<UserManager<UserModel>>(
                Mock.Of<IUserStore<UserModel>>(), null, null, null, null, null, null, null, null);
            controller = new EventController(mockRepo.Object, mockUserManager.Object);
        }

        private void SetupUser(string? userId)
        {
            var claims = new List<Claim>();
            if (userId != null)
                claims.Add(new Claim(ClaimTypes.NameIdentifier, userId));

            var identity = new ClaimsIdentity(claims, "TestAuth");
            var principal = new ClaimsPrincipal(identity);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principal }
            };

            mockUserManager.Setup(m => m.GetUserId(principal)).Returns(userId);
        }

        // --- Create ---

        [Fact]
        public async Task Create_ReturnsOk_WhenSuccess()
        {
            SetupUser("user1");
            mockRepo.Setup(r => r.Create(It.IsAny<EventModel>())).ReturnsAsync(new EventModel { Id = "new1" });

            var model = new EventController.CreateEventModel
            {
                Type = "ATELIER",
                ResourceId = "res1",
                StartAt = DateTime.UtcNow.AddDays(1)
            };

            var result = await controller.Create(model);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task Create_ReturnsUnauthorized_WhenNoUser()
        {
            SetupUser(null);

            var model = new EventController.CreateEventModel { Type = "ATELIER" };
            var result = await controller.Create(model);

            Assert.IsType<UnauthorizedResult>(result);
        }

        [Fact]
        public async Task Create_Returns500_WhenException()
        {
            SetupUser("user1");
            mockRepo.Setup(r => r.Create(It.IsAny<EventModel>())).ThrowsAsync(new Exception("DB error"));

            var model = new EventController.CreateEventModel { Type = "ATELIER" };
            var result = await controller.Create(model);

            Assert.IsType<StatusCodeResult>(result);
        }

        // --- Delete ---

        [Fact]
        public async Task Delete_ReturnsOk_WhenEventExists()
        {
            var eventModel = new EventModel { Id = "1" };
            mockRepo.Setup(r => r.GetEvent("1")).ReturnsAsync(eventModel);
            mockRepo.Setup(r => r.Delete("1")).ReturnsAsync(true);

            var result = await controller.Delete("1");

            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task Delete_ReturnsNotFound_WhenEventMissing()
        {
            mockRepo.Setup(r => r.GetEvent("999")).ReturnsAsync((EventModel?)null);

            var result = await controller.Delete("999");

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Delete_Returns500_WhenException()
        {
            var eventModel = new EventModel { Id = "1" };
            mockRepo.Setup(r => r.GetEvent("1")).ReturnsAsync(eventModel);
            mockRepo.Setup(r => r.Delete("1")).ThrowsAsync(new Exception("DB error"));

            var result = await controller.Delete("1");

            Assert.IsType<StatusCodeResult>(result);
        }

        // --- Update ---

        [Fact]
        public async Task Update_ReturnsOk_WhenSuccess()
        {
            var eventModel = new EventModel { Id = "1" };
            mockRepo.Setup(r => r.GetEvent("1")).ReturnsAsync(eventModel);
            mockRepo.Setup(r => r.Update("1", It.IsAny<EventModel>())).ReturnsAsync(new EventModel { Id = "1", Type = "ATELIER" });

            var model = new EventController.UpdateEventModel
            {
                Type = "ATELIER",
                ResourceId = "res1",
                StartAt = DateTime.UtcNow,
                UserId = "user1",
                DemographicZoneId = "zone1"
            };

            var result = await controller.Update("1", model);

            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task Update_ReturnsNotFound_WhenEventMissing()
        {
            mockRepo.Setup(r => r.GetEvent("999")).ReturnsAsync((EventModel?)null);

            var model = new EventController.UpdateEventModel { Type = "ATELIER" };
            var result = await controller.Update("999", model);

            Assert.IsType<NotFoundResult>(result);
        }

        // --- GetId ---

        [Fact]
        public async Task GetId_ReturnsOk_WhenEventExists()
        {
            var eventModel = new EventModel { Id = "1", Type = "ATELIER" };
            mockRepo.Setup(r => r.GetEvent("1")).ReturnsAsync(eventModel);

            var result = await controller.GetId("1");

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetId_ReturnsNotFound_WhenEventMissing()
        {
            mockRepo.Setup(r => r.GetEvent("999")).ReturnsAsync((EventModel?)null);

            var result = await controller.GetId("999");

            Assert.IsType<NotFoundResult>(result);
        }

        // --- GetAll ---

        [Fact]
        public async Task GetAll_ReturnsOk()
        {
            var events = new List<EventModel>
            {
                new() { Id = "1", Type = "ATELIER" },
                new() { Id = "2", Type = "FORMATION" }
            };
            mockRepo.Setup(r => r.GetAll()).ReturnsAsync(events);

            var result = await controller.GetAll();

            Assert.IsType<OkObjectResult>(result);
        }

        // --- GetForResource ---

        [Fact]
        public async Task GetForResource_ReturnsOk()
        {
            var events = new List<EventModel> { new() { Id = "1" } };
            mockRepo.Setup(r => r.GetForResource("res1")).ReturnsAsync(events);

            var result = await controller.GetForResource("res1");

            Assert.IsType<OkObjectResult>(result);
        }
    }
}