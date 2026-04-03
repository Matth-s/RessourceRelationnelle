using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using RessourceRelationnelle.API.Controllers;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;
using Xunit;

namespace RessourceRelationnelle.Tests.Controllers
{
    public class CategoryControllerTests
    {
        private readonly Mock<ICategoryRepository> mockRepo;
        private readonly CategoryController controller;

        public CategoryControllerTests()
        {
            mockRepo = new Mock<ICategoryRepository>();
            var mockUserManager = new Mock<UserManager<UserModel>>(
                Mock.Of<IUserStore<UserModel>>(), null, null, null, null, null, null, null, null);
            controller = new CategoryController(mockRepo.Object, mockUserManager.Object);
        }

        // --- GetAll ---

        [Fact]
        public async Task GetAll_ReturnsOk_WithCategories()
        {
            var categories = new List<CategoryModel>
            {
                new() { Id = "1", CategoryName = "COMMUNICATION" },
                new() { Id = "2", CategoryName = "CULTURES" }
            };
            mockRepo.Setup(r => r.GetAll()).ReturnsAsync(categories);

            var result = await controller.GetAll();

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetAll_ReturnsBadRequest_WhenException()
        {
            mockRepo.Setup(r => r.GetAll()).ThrowsAsync(new Exception("DB error"));

            var result = await controller.GetAll();

            Assert.IsType<BadRequestObjectResult>(result);
        }

        // --- Delete ---

        [Fact]
        public async Task Delete_ReturnsOk_WhenCategoryExists()
        {
            var category = new CategoryModel { Id = "1", CategoryName = "TEST" };
            mockRepo.Setup(r => r.GetOne("1")).ReturnsAsync(category);
            mockRepo.Setup(r => r.Delete("1")).Returns(Task.CompletedTask);

            var result = await controller.Delete("1");

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task Delete_ReturnsNotFound_WhenCategoryMissing()
        {
            mockRepo.Setup(r => r.GetOne("999")).ReturnsAsync((CategoryModel?)null);

            var result = await controller.Delete("999");

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task Delete_ReturnsBadRequest_WhenException()
        {
            mockRepo.Setup(r => r.GetOne("1")).ThrowsAsync(new Exception("DB error"));

            var result = await controller.Delete("1");

            Assert.IsType<BadRequestObjectResult>(result);
        }

        // --- Create ---

        [Fact]
        public async Task Create_ReturnsOk_WhenNewCategory()
        {
            mockRepo.Setup(r => r.GetOneByName("TEST")).ReturnsAsync((CategoryModel?)null);
            mockRepo.Setup(r => r.Create(It.IsAny<CategoryModel>())).ReturnsAsync(new CategoryModel { Id = "new", CategoryName = "TEST" });

            var model = new CategoryController.CreateNewCategoryModel { CategoryName = "Test" };
            var result = await controller.Create(model);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task Create_ReturnsConflict_WhenCategoryExists()
        {
            var existing = new CategoryModel { Id = "1", CategoryName = "TEST" };
            mockRepo.Setup(r => r.GetOneByName("TEST")).ReturnsAsync(existing);

            var model = new CategoryController.CreateNewCategoryModel { CategoryName = "Test" };
            var result = await controller.Create(model);

            Assert.IsType<ConflictObjectResult>(result);
        }

        [Fact]
        public async Task Create_ReturnsBadRequest_WhenException()
        {
            mockRepo.Setup(r => r.GetOneByName(It.IsAny<string>())).ThrowsAsync(new Exception("DB error"));

            var model = new CategoryController.CreateNewCategoryModel { CategoryName = "Test" };
            var result = await controller.Create(model);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        // --- Update ---

        [Fact]
        public async Task Update_ReturnsOk_WhenSuccess()
        {
            var existing = new CategoryModel { Id = "1", CategoryName = "OLD" };
            mockRepo.Setup(r => r.GetOne("1")).ReturnsAsync(existing);
            mockRepo.Setup(r => r.GetByName("New")).ReturnsAsync((CategoryModel?)null);
            mockRepo.Setup(r => r.Update(It.IsAny<CategoryModel>())).ReturnsAsync(new CategoryModel { Id = "1", CategoryName = "NEW" });

            var model = new CategoryController.CreateNewCategoryModel { CategoryName = "New" };
            var result = await controller.Update("1", model);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task Update_ReturnsNotFound_WhenCategoryMissing()
        {
            mockRepo.Setup(r => r.GetOne("999")).ReturnsAsync((CategoryModel?)null);

            var model = new CategoryController.CreateNewCategoryModel { CategoryName = "New" };
            var result = await controller.Update("999", model);

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task Update_ReturnsConflict_WhenNameAlreadyExists()
        {
            var existing = new CategoryModel { Id = "1", CategoryName = "OLD" };
            var duplicate = new CategoryModel { Id = "2", CategoryName = "NEW" };
            mockRepo.Setup(r => r.GetOne("1")).ReturnsAsync(existing);
            mockRepo.Setup(r => r.GetByName("New")).ReturnsAsync(duplicate);

            var model = new CategoryController.CreateNewCategoryModel { CategoryName = "New" };
            var result = await controller.Update("1", model);

            Assert.IsType<ConflictObjectResult>(result);
        }

        [Fact]
        public async Task Update_ReturnsBadRequest_WhenException()
        {
            mockRepo.Setup(r => r.GetOne("1")).ThrowsAsync(new Exception("DB error"));

            var model = new CategoryController.CreateNewCategoryModel { CategoryName = "New" };
            var result = await controller.Update("1", model);

            Assert.IsType<BadRequestObjectResult>(result);
        }
    }
}