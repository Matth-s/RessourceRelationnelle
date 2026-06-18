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

            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async Task GetUserByToken_ReturnsOk_WhenUserExists()
        {
            SetupUser("user1");
            var user = new UserModel
            {
                Id = "user1",
                UserName = "alice",
                Email = "alice@test.com",
            };
            mockUserRepo.Setup(r => r.GetUserById("user1")).ReturnsAsync(user);
            mockUserRepo.Setup(r => r.GetRolesByUserId("user1")).ReturnsAsync(new List<string> { "User" });

            var result = await controller.GetUserByToken();

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetUserByToken_ReturnsNotFound_WhenUserNotInDb()
        {
            SetupUser("inexistant");
            mockUserRepo.Setup(r => r.GetUserById("inexistant")).ReturnsAsync((UserModel?)null);

            var result = await controller.GetUserByToken();

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task GetUserByToken_ReturnsCorrectData()
        {
            SetupUser("user1");
            var user = new UserModel
            {
                Id = "user1",
                UserName = "admin",
                Email = "admin@test.com",
            };
            mockUserRepo.Setup(r => r.GetUserById("user1")).ReturnsAsync(user);
            mockUserRepo.Setup(r => r.GetRolesByUserId("user1")).ReturnsAsync(new List<string> { "Admin" });

            var result = await controller.GetUserByToken();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var value = Assert.IsType<UserInforReturn>(okResult.Value);
            Assert.Equal("user1", value.Id);
            Assert.Equal("admin", value.Username);
            Assert.Equal("admin@test.com", value.Email);
            Assert.Equal("fake-token-123", value.Token);
            Assert.Contains("Admin", value.Role);
        }
    }
}
