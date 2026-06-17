using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using RessourceRelationnelle.API.Controllers;
using RessourceRelationnelle.DATA.Models;
using Xunit;

namespace RessourceRelationnelle.Tests.Controllers
{
    public class AuthenticationControllerTests
    {
        private readonly Mock<UserManager<UserModel>> mockUserManager;
        private readonly Mock<RoleManager<IdentityRole>> mockRoleManager;
        private readonly IConfiguration configuration;
        private readonly AuthenticationController controller;

        public AuthenticationControllerTests()
        {
            mockUserManager = new Mock<UserManager<UserModel>>(
                Mock.Of<IUserStore<UserModel>>(), null, null, null, null, null, null, null, null);
            mockRoleManager = new Mock<RoleManager<IdentityRole>>(
                Mock.Of<IRoleStore<IdentityRole>>(), null, null, null, null);

            var configData = new Dictionary<string, string?>
            {
                { "JWT:Secret", "CleSecreteDuTestUnitaireTresLongue123456!" }
            };
            configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(configData)
                .Build();

            controller = new AuthenticationController(
                configuration, mockUserManager.Object, mockRoleManager.Object);
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
            var user = new UserModel { Id = "1", Email = "admin@test.com", UserName = "admin" };
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
            var model = new RegisterModel
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
        public async Task Register_Returns500_WhenEmailAlreadyExists()
        {
            var existingUser = new UserModel { Id = "1", Email = "existing@test.com" };
            mockUserManager.Setup(m => m.FindByEmailAsync("existing@test.com"))
                .ReturnsAsync(existingUser);

            var model = new RegisterModel
            {
                Email = "existing@test.com",
                Username = "test",
                Password = "Test123!",
                ConfirmPassword = "Test123!"
            };

            var result = await controller.Register(model);

            var statusResult = Assert.IsType<StatusCodeResult>(result);
            Assert.Equal(500, statusResult.StatusCode);
        }


        [Fact]
        public async Task Register_ReturnsOk_WhenRegistrationSucceeds()
        {
            mockUserManager.Setup(m => m.FindByEmailAsync("new@test.com"))
                .ReturnsAsync((UserModel?)null);
            mockUserManager.Setup(m => m.CreateAsync(It.IsAny<UserModel>(), "Test123!"))
                .ReturnsAsync(IdentityResult.Success);
            mockUserManager.Setup(m => m.AddToRoleAsync(It.IsAny<UserModel>(), "User"))
                .ReturnsAsync(IdentityResult.Success);

            var model = new RegisterModel
            {
                Email = "new@test.com",
                Username = "newuser",
                Password = "Test123!",
                ConfirmPassword = "Test123!"
            };

            var result = await controller.Register(model);

            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task Register_Returns500_WhenCreateFails()
        {
            mockUserManager.Setup(m => m.FindByEmailAsync("new@test.com"))
                .ReturnsAsync((UserModel?)null);
            mockUserManager.Setup(m => m.CreateAsync(It.IsAny<UserModel>(), "Test123!"))
                .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Erreur" }));

            var model = new RegisterModel
            {
                Email = "new@test.com",
                Username = "newuser",
                Password = "Test123!",
                ConfirmPassword = "Test123!"
            };

            var result = await controller.Register(model);

            var statusResult = Assert.IsType<StatusCodeResult>(result);
            Assert.Equal(500, statusResult.StatusCode);
        }
    }
}