using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using RessourceRelationnelle.API.Controllers;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;
using static SqlUserRepository;
using System.Security.Claims;
using Xunit;

namespace RessourceRelationnelle.Tests.Controllers
{
    public class UserControllerTests
    {
        private readonly Mock<IUserRepository> mockUserRepo;
        private readonly Mock<UserManager<UserModel>> mockUserManager;
        private readonly UserController controller;

        public UserControllerTests()
        {
            mockUserRepo = new Mock<IUserRepository>();
            mockUserManager = new Mock<UserManager<UserModel>>(
                Mock.Of<IUserStore<UserModel>>(), null, null, null, null, null, null, null, null);

            controller = new UserController(mockUserRepo.Object, mockUserManager.Object);
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
                HttpContext = new DefaultHttpContext
                {
                    User = principal
                }
            };

            controller.ControllerContext.HttpContext.Request.Headers["Authorization"] = "Bearer fake-token-123";
        }

        [Fact]
        public async Task GetUserByToken_ReturnsUnauthorized_WhenNoUserId()
        {
            SetupUser(null);

            var result = await controller.GetUserByToken();

            Assert.IsType<UnauthorizedResult>(result);
        }

        [Fact]
        public async Task GetUserByToken_ReturnsOk_WhenUserExists()
        {
            SetupUser("user1");
            var user = new UserReturnAdmin
            {
                Id = "user1",
                Username = "alice",
                Email = "alice@test.com",
                IsActive = true,
                Role = new List<string> { "User" }
            };
            mockUserRepo.Setup(r => r.GetById("user1")).ReturnsAsync(user);

            var result = await controller.GetUserByToken();

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetUserByToken_ThrowsNullReference_WhenUserNotInDb()
        {
            SetupUser("inexistant");
            mockUserRepo.Setup(r => r.GetById("inexistant")).ReturnsAsync((UserReturnAdmin?)null);

            await Assert.ThrowsAsync<NullReferenceException>(
                () => controller.GetUserByToken());
        }

        [Fact]
        public async Task GetUserByToken_ReturnsCorrectData()
        {
            SetupUser("user1");
            var user = new UserReturnAdmin
            {
                Id = "user1",
                Username = "admin",
                Email = "admin@test.com",
                IsActive = true,
                Role = new List<string> { "Admin" }
            };
            mockUserRepo.Setup(r => r.GetById("user1")).ReturnsAsync(user);

            var result = await controller.GetUserByToken();

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }
    }
}