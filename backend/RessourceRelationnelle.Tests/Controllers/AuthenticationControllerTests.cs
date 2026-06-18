using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using RessourceRelationnelle.API.Controllers;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;
using Xunit;

namespace RessourceRelationnelle.Tests.Controllers
{
    public class AuthenticationControllerTests
    {
        private readonly Mock<UserManager<UserModel>> mockUserManager;
        private readonly Mock<RoleManager<IdentityRole>> mockRoleManager;
        private readonly Mock<IUserRepository> mockUserRepository;
        private readonly IConfiguration configuration;
        private readonly AuthenticationController controller;

        public AuthenticationControllerTests()
        {
            mockUserManager = new Mock<UserManager<UserModel>>(
                Mock.Of<IUserStore<UserModel>>(), null, null, null, null, null, null, null, null);
            mockRoleManager = new Mock<RoleManager<IdentityRole>>(
                Mock.Of<IRoleStore<IdentityRole>>(), null, null, null, null);
            mockUserRepository = new Mock<IUserRepository>();

            var configData = new Dictionary<string, string?>
            {
                { "JWT:Secret", "CleSecreteDuTestUnitaireTresLongue123456!" }
            };
            configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(configData)
                .Build();

            controller = new AuthenticationController(
                configuration, mockUserManager.Object, mockRoleManager.Object, mockUserRepository.Object);
        }

        [Fact]
        public async Task Login_ReturnsUnauthorized_WhenUserNotFound()
        {
            mockUserManager.Setup(m => m.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync((UserModel?)null);

            var model = new LoginModel { Email = "inconnu@test.com", Password = "Test123!" };
            var result = await controller.Login(model);

            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async Task Login_ReturnsUnauthorized_WhenPasswordWrong()
        {
            var user = new UserModel { Id = "1", Email = "test@test.com", UserName = "test" };
            mockUserManager.Setup(m => m.FindByEmailAsync("test@test.com")).ReturnsAsync(user);
            mockUserManager.Setup(m => m.CheckPasswordAsync(user, "mauvais")).ReturnsAsync(false);

            var model = new LoginModel { Email = "test@test.com", Password = "mauvais" };
            var result = await controller.Login(model);

            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async Task Login_ReturnsOk_WithToken_WhenCredentialsValid()
        {
            var user = new UserModel { Id = "1", Email = "admin@test.com", UserName = "admin", IsActive = true };
            mockUserManager.Setup(m => m.FindByEmailAsync("admin@test.com")).ReturnsAsync(user);
            mockUserManager.Setup(m => m.CheckPasswordAsync(user, "Demo123!")).ReturnsAsync(true);
            mockUserManager.Setup(m => m.GetRolesAsync(user)).ReturnsAsync(new List<string> { "Admin" });

            var model = new LoginModel { Email = "admin@test.com", Password = "Demo123!" };
            var result = await controller.Login(model);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task Register_ReturnsBadRequest_WhenPasswordsDontMatch()
        {
            var model = new UserBody
            {
                Email = "new@test.com",
                Username = "newuser",
                Password = "Test123!",
                ConfirmPassword = "Different123!"
            };

            var result = await controller.Register(model);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Register_ReturnsConflict_WhenEmailAlreadyExists()
        {
            mockUserRepository.Setup(r => r.Create(It.IsAny<UserBody>()))
                .ReturnsAsync("email");

            var model = new UserBody
            {
                Email = "existing@test.com",
                Username = "test",
                Password = "Test123!",
                ConfirmPassword = "Test123!"
            };

            var result = await controller.Register(model);

            Assert.IsType<ConflictObjectResult>(result);
        }

        [Fact]
        public async Task Register_ReturnsConflict_WhenUsernameAlreadyExists()
        {
            mockUserRepository.Setup(r => r.Create(It.IsAny<UserBody>()))
                .ReturnsAsync("username");

            var model = new UserBody
            {
                Email = "new@test.com",
                Username = "existing",
                Password = "Test123!",
                ConfirmPassword = "Test123!"
            };

            var result = await controller.Register(model);

            Assert.IsType<ConflictObjectResult>(result);
        }

        [Fact]
        public async Task Register_ReturnsOk_WhenRegistrationSucceeds()
        {
            mockUserRepository.Setup(r => r.Create(It.IsAny<UserBody>()))
                .ReturnsAsync("ok");

            var model = new UserBody
            {
                Email = "new@test.com",
                Username = "newuser",
                Password = "Test123!",
                ConfirmPassword = "Test123!"
            };

            var result = await controller.Register(model);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task Register_ReturnsBadRequest_WhenCreateFails()
        {
            mockUserRepository.Setup(r => r.Create(It.IsAny<UserBody>()))
                .ReturnsAsync("creation");

            var model = new UserBody
            {
                Email = "new@test.com",
                Username = "newuser",
                Password = "Test123!",
                ConfirmPassword = "Test123!"
            };

            var result = await controller.Register(model);

            Assert.IsType<BadRequestObjectResult>(result);
        }
    }
}
