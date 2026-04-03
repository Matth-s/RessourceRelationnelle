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
    public class ResourceControllerTests
    {
        private readonly Mock<IResourceRepository> mockRepo;
        private readonly Mock<UserManager<UserModel>> mockUserManager;
        private readonly ResourceController controller;

        public ResourceControllerTests()
        {
            mockRepo = new Mock<IResourceRepository>();
            mockUserManager = new Mock<UserManager<UserModel>>(
                Mock.Of<IUserStore<UserModel>>(), null, null, null, null, null, null, null, null);
            controller = new ResourceController(mockRepo.Object, mockUserManager.Object);
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

            if (userId != null)
                mockUserManager.Setup(m => m.GetUserId(principal)).Returns(userId);
            else
                mockUserManager.Setup(m => m.GetUserId(principal)).Returns((string?)null);
        }

        // --- GetOne ---

        [Fact]
        public async Task GetOne_ReturnsOk_WhenResourceExists()
        {
            var resource = new ResourceModel { Id = "1", Title = "Test" };
            mockRepo.Setup(r => r.GetOne("1")).ReturnsAsync(resource);

            var result = await controller.GetOne("1");

            var actionResult = Assert.IsType<ActionResult<ResourceModel>>(result);
            Assert.IsType<OkObjectResult>(actionResult.Result);
        }

        [Fact]
        public async Task GetOne_ReturnsNotFound_WhenResourceMissing()
        {
            mockRepo.Setup(r => r.GetOne("999")).ReturnsAsync((ResourceModel?)null);

            var result = await controller.GetOne("999");

            var actionResult = Assert.IsType<ActionResult<ResourceModel>>(result);
            Assert.IsType<NotFoundResult>(actionResult.Result);
        }

        [Fact]
        public async Task GetOne_Returns500_WhenException()
        {
            mockRepo.Setup(r => r.GetOne("1")).ThrowsAsync(new Exception("DB error"));

            var result = await controller.GetOne("1");

            var actionResult = Assert.IsType<ActionResult<ResourceModel>>(result);
            var objectResult = Assert.IsType<ObjectResult>(actionResult.Result);
            Assert.Equal(500, objectResult.StatusCode);
        }

        // --- Create ---

        [Fact]
        public async Task Create_ReturnsOk_WhenSuccess()
        {
            SetupUser("user1");
            var user = new UserModel { Id = "user1", UserName = "test" };
            mockUserManager.Setup(m => m.FindByIdAsync("user1")).ReturnsAsync(user);
            mockRepo.Setup(r => r.Create(It.IsAny<ResourceModel>())).ReturnsAsync(new ResourceModel { Id = "new1" });

            var model = new ResourceController.CreateResourceModel
            {
                Title = "Test",
                Resume = "Resume",
                Content = "Content",
                Url = "https://test.com",
                CategoryId = "cat1",
                ResourceTypeId = "type1",
                RelationTypeId = "rel1"
            };

            var result = await controller.Create(model);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task Create_ReturnsUnauthorized_WhenNoUserId()
        {
            SetupUser(null);

            var model = new ResourceController.CreateResourceModel { Title = "Test" };
            var result = await controller.Create(model);

            Assert.IsType<UnauthorizedResult>(result);
        }

        [Fact]
        public async Task Create_ReturnsUnauthorized_WhenUserNotFound()
        {
            SetupUser("user1");
            mockUserManager.Setup(m => m.FindByIdAsync("user1")).ReturnsAsync((UserModel?)null);

            var model = new ResourceController.CreateResourceModel { Title = "Test" };
            var result = await controller.Create(model);

            Assert.IsType<UnauthorizedResult>(result);
        }
    }
}