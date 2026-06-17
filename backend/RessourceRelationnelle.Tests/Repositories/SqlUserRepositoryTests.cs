using Microsoft.AspNetCore.Identity;
using Moq;
using RessourceRelationnelle.DATA.Models;
using static SqlUserRepository;
using Xunit;

namespace RessourceRelationnelle.Tests.Repositories
{
    public class SqlUserRepositoryTests
    {
        private readonly Mock<UserManager<UserModel>> mockUserManager;
        private readonly SqlUserRepository repository;

        public SqlUserRepositoryTests()
        {
            var store = Mock.Of<IUserStore<UserModel>>();
            mockUserManager = new Mock<UserManager<UserModel>>(
                store, null, null, null, null, null, null, null, null);

            var context = Helpers.TestDbContextFactory.Create();
            repository = new SqlUserRepository(context, mockUserManager.Object);
        }

        [Fact]
        public async Task GetById_ReturnsUserReturnAdmin_WithRoles()
        {
            var user = new UserModel
            {
                Id = "user1",
                UserName = "alice",
                Email = "alice@test.com",
                IsActive = true,
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow
            };

            mockUserManager.Setup(m => m.FindByIdAsync("user1")).ReturnsAsync(user);
            mockUserManager.Setup(m => m.GetRolesAsync(user)).ReturnsAsync(new List<string> { "User" });

            var result = await repository.GetById("user1");

            Assert.NotNull(result);
            Assert.Equal("alice", result.Username);
            Assert.Equal("alice@test.com", result.Email);
            Assert.True(result.IsActive);
            Assert.True(result.EmailVerified);
            Assert.Contains("User", result.Role);
        }

        [Fact]
        public async Task GetById_ReturnsNull_WhenUserNotExists()
        {
            mockUserManager.Setup(m => m.FindByIdAsync("inexistant")).ReturnsAsync((UserModel?)null);

            var result = await repository.GetById("inexistant");

            Assert.Null(result);
        }

        [Fact]
        public async Task GetById_ReturnsMultipleRoles()
        {
            var user = new UserModel
            {
                Id = "admin1",
                UserName = "admin",
                Email = "admin@test.com",
                IsActive = true
            };

            mockUserManager.Setup(m => m.FindByIdAsync("admin1")).ReturnsAsync(user);
            mockUserManager.Setup(m => m.GetRolesAsync(user))
                .ReturnsAsync(new List<string> { "Admin", "SuperAdmin" });

            var result = await repository.GetById("admin1");

            Assert.NotNull(result);
            Assert.Equal(2, result.Role.Count);
            Assert.Contains("Admin", result.Role);
            Assert.Contains("SuperAdmin", result.Role);
        }
    }
}