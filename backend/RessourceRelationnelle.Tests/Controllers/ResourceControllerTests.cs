using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using RessourceRelationnelle.API.Controllers;
using RessourceRelationnelle.API.Services;
using RessourceRelationnelle.Data.Repositories.Sql;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;
using RessourceRelationnelle.Tests.Helpers;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Claims;
using Xunit;

namespace RessourceRelationnelle.Tests.Controllers
{
    public class ResourceControllerTests
    {
        private readonly Mock<IResourceRepository> mockRepo;
        private readonly Mock<UserManager<UserModel>> mockUserManager;
        private readonly Mock<IStorageService> mockStorageService;
        private readonly ResourceController controller;

        public ResourceControllerTests()
        {
            mockRepo = new Mock<IResourceRepository>();
            mockUserManager = new Mock<UserManager<UserModel>>(
                Mock.Of<IUserStore<UserModel>>(), null, null, null, null, null, null, null, null);
            mockStorageService = new Mock<IStorageService>();
            controller = new ResourceController(mockRepo.Object, mockUserManager.Object, mockStorageService.Object);
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

        private ResourceViewService CreateViewService()
        {
            var context = TestDbContextFactory.Create();
            var cache = new MemoryCache(new MemoryCacheOptions());
            var accessor = new HttpContextAccessor { HttpContext = controller.HttpContext };
            return new ResourceViewService(context, cache, accessor);
        }

        [Fact]
        public async Task GetOne_ReturnsOk_WhenResourceExists()
        {
            SetupUser(null);
            var resource = new ResourcesReturn { Id = "1", Title = "Test" };
            mockRepo.Setup(r => r.GetOne(null, "1")).ReturnsAsync(resource);

            var result = await controller.GetOne("1", CreateViewService());

            var actionResult = Assert.IsType<ActionResult<ResourcesReturn>>(result);
            Assert.IsType<OkObjectResult>(actionResult.Result);
        }

        [Fact]
        public async Task GetOne_ReturnsNotFound_WhenResourceMissing()
        {
            SetupUser(null);
            mockRepo.Setup(r => r.GetOne(null, "999")).ReturnsAsync((ResourcesReturn?)null);

            var result = await controller.GetOne("999", CreateViewService());

            var actionResult = Assert.IsType<ActionResult<ResourcesReturn>>(result);
            Assert.IsType<NotFoundResult>(actionResult.Result);
        }

        [Fact]
        public async Task GetOne_Returns500_WhenException()
        {
            SetupUser(null);
            mockRepo.Setup(r => r.GetOne(null, "1")).ThrowsAsync(new Exception("DB error"));

            var result = await controller.GetOne("1", CreateViewService());

            var actionResult = Assert.IsType<ActionResult<ResourcesReturn>>(result);
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
            mockRepo.Setup(r => r.Create(It.IsAny<ResourceModel>())).ReturnsAsync(new ResourcesReturn { Id = "new1" });

            var model = new ResourceController.CreateResourceWithFileModel
            {
                Title = "Test",
                Resume = "Resume",
                Content = "Content",
                Url = "https://test.com",
                CategoryId = "cat1",
                ResourceTypeId = "type1",
                RelationTypeId = "rel1"
            };

            var result = await controller.CreateWithFile(model);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task Create_ReturnsUnauthorized_WhenNoUserId()
        {
            SetupUser(null);

            var model = new ResourceController.CreateResourceWithFileModel { Title = "Test" };
            var result = await controller.CreateWithFile(model);

            Assert.IsType<UnauthorizedResult>(result);
        }

        [Fact]
        public async Task Create_ReturnsUnauthorized_WhenUserNotFound()
        {
            SetupUser("user1");
            mockUserManager.Setup(m => m.FindByIdAsync("user1")).ReturnsAsync((UserModel?)null);

            var model = new ResourceController.CreateResourceWithFileModel { Title = "Test" };
            var result = await controller.CreateWithFile(model);

            Assert.IsType<UnauthorizedResult>(result);
        }
    }
}
