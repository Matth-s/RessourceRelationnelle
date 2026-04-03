using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using RessourceRelationnelle.API.Controllers;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;
using static SqlUserRepository;
using Xunit;

namespace RessourceRelationnelle.Tests.Controllers
{
    public class SuperAdminControllerTests
    {
        private readonly Mock<ICommentaryRepository> mockCommentaryRepo;
        private readonly Mock<IUserRepository> mockUserRepo;
        private readonly Mock<UserManager<UserModel>> mockUserManager;
        private readonly Mock<RoleManager<IdentityRole>> mockRoleManager;
        private readonly SuperAdminController controller;

        public SuperAdminControllerTests()
        {
            mockCommentaryRepo = new Mock<ICommentaryRepository>();
            mockUserRepo = new Mock<IUserRepository>();
            mockUserManager = new Mock<UserManager<UserModel>>(
                Mock.Of<IUserStore<UserModel>>(), null, null, null, null, null, null, null, null);
            mockRoleManager = new Mock<RoleManager<IdentityRole>>(
                Mock.Of<IRoleStore<IdentityRole>>(), null, null, null, null);

            controller = new SuperAdminController(
                mockUserManager.Object,
                mockRoleManager.Object,
                mockUserRepo.Object,
                mockCommentaryRepo.Object);
        }

        // --- Tests GetAllComments ---

        [Fact]
        public async Task GetAllComments_ReturnsOk_WithComments()
        {
            var comments = new List<CommentaryModel>
            {
                new()
                {
                    Id = "1", Content = "Test", ModerationStatus = "Approved",
                    UserId = "u1", ResourceId = "r1",
                    User = new UserModel { UserName = "alice", Email = "alice@test.com" },
                    Resource = new ResourceModel { Id = "r1", Title = "Article" }
                }
            };
            mockCommentaryRepo.Setup(r => r.GetAll()).ReturnsAsync(comments);

            var result = await controller.GetAllComments();

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetAllComments_ReturnsOk_WhenEmpty()
        {
            mockCommentaryRepo.Setup(r => r.GetAll()).ReturnsAsync(new List<CommentaryModel>());

            var result = await controller.GetAllComments();

            Assert.IsType<OkObjectResult>(result);
        }

        // --- Tests DeleteComment ---

        [Fact]
        public async Task DeleteComment_ReturnsNoContent_WhenSuccess()
        {
            mockCommentaryRepo.Setup(r => r.Delete("1")).ReturnsAsync(true);

            var result = await controller.DeleteComment("1");

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteComment_ReturnsNotFound_WhenCommentMissing()
        {
            mockCommentaryRepo.Setup(r => r.Delete("999")).ReturnsAsync(false);

            var result = await controller.DeleteComment("999");

            Assert.IsType<NotFoundResult>(result);
        }

        // --- Tests GetAllUsers ---

        [Fact]
        public async Task GetAllUsers_ReturnsOk_WhenUsersExist()
        {
            var users = new UserReturnAdmin[]
            {
                new() { Id = "1", Username = "alice", Email = "alice@test.com", IsActive = true, Role = new List<string> { "User" } },
                new() { Id = "2", Username = "bob", Email = "bob@test.com", IsActive = true, Role = new List<string> { "Admin" } }
            };
            mockUserRepo.Setup(r => r.GetAll()).ReturnsAsync(users);

            var result = await controller.GetAllUsers();

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetAllUsers_ReturnsNotFound_WhenNoUsers()
        {
            mockUserRepo.Setup(r => r.GetAll()).ReturnsAsync(new UserReturnAdmin[0]);

            var result = await controller.GetAllUsers();

            Assert.IsType<NotFoundObjectResult>(result);
        }

        // --- Tests DeleteUser ---

        [Fact]
        public async Task DeleteUser_ReturnsOk_WhenUserExists()
        {
            mockUserRepo.Setup(r => r.Delete("user1")).ReturnsAsync("ok");

            var result = await controller.DeleteUser("user1");

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task DeleteUser_ReturnsNotFound_WhenUserMissing()
        {
            mockUserRepo.Setup(r => r.Delete("999")).ReturnsAsync((string?)null);

            var result = await controller.DeleteUser("999");

            Assert.IsType<NotFoundObjectResult>(result);
        }

        // --- Tests CreateAccount ---

        [Fact]
        public async Task CreateAccount_ReturnsBadRequest_WhenPasswordsDontMatch()
        {
            var model = new UserBody
            {
                Email = "test@test.com",
                Password = "Test123!",
                ConfirmPassword = "Different!"
            };

            var result = await controller.CreateAccount(model);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task CreateAccount_ReturnsConflict_WhenEmailExists()
        {
            var model = new UserBody
            {
                Email = "existing@test.com",
                Password = "Test123!",
                ConfirmPassword = "Test123!"
            };
            mockUserRepo.Setup(r => r.Create(model)).ReturnsAsync("email");

            var result = await controller.CreateAccount(model);

            Assert.IsType<ConflictObjectResult>(result);
        }

        [Fact]
        public async Task CreateAccount_ReturnsConflict_WhenUsernameExists()
        {
            var model = new UserBody
            {
                Email = "new@test.com",
                Password = "Test123!",
                ConfirmPassword = "Test123!"
            };
            mockUserRepo.Setup(r => r.Create(model)).ReturnsAsync("username");

            var result = await controller.CreateAccount(model);

            Assert.IsType<ConflictObjectResult>(result);
        }

        [Fact]
        public async Task CreateAccount_ReturnsBadRequest_WhenCreationFails()
        {
            var model = new UserBody
            {
                Email = "new@test.com",
                Password = "Test123!",
                ConfirmPassword = "Test123!"
            };
            mockUserRepo.Setup(r => r.Create(model)).ReturnsAsync("creation");

            var result = await controller.CreateAccount(model);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task CreateAccount_ReturnsOk_WhenSuccess()
        {
            var model = new UserBody
            {
                Email = "new@test.com",
                Password = "Test123!",
                ConfirmPassword = "Test123!"
            };
            mockUserRepo.Setup(r => r.Create(model)).ReturnsAsync("ok");

            var result = await controller.CreateAccount(model);

            Assert.IsType<OkObjectResult>(result);
        }

        // --- Tests UpdateUser ---

        [Fact]
        public async Task UpdateUser_ReturnsBadRequest_WhenIdNull()
        {
            var dto = new SuperAdminController.UserUpdateDto
            {
                Email = "test@test.com",
                Username = "test",
                IsActive = true,
                Role = new List<string> { "User" }
            };

            var result = await controller.UpdateUser(null, dto);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task UpdateUser_ReturnsNotFound_WhenUserNotExists()
        {
            mockUserRepo.Setup(r => r.Update(It.IsAny<UserUpdateIdDto>()))
                .ReturnsAsync((UserModel?)null);

            var dto = new SuperAdminController.UserUpdateDto
            {
                Email = "test@test.com",
                Username = "test",
                IsActive = true,
                Role = new List<string> { "User" }
            };

            var result = await controller.UpdateUser("999", dto);

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task UpdateUser_ReturnsOk_WhenSuccess()
        {
            var updatedUser = new UserModel { Id = "1", Email = "updated@test.com", UserName = "updated" };
            mockUserRepo.Setup(r => r.Update(It.IsAny<UserUpdateIdDto>()))
                .ReturnsAsync(updatedUser);

            var dto = new SuperAdminController.UserUpdateDto
            {
                Email = "updated@test.com",
                Username = "updated",
                IsActive = true,
                Role = new List<string> { "Admin" }
            };

            var result = await controller.UpdateUser("1", dto);

            Assert.IsType<OkObjectResult>(result);
        }
    }
}