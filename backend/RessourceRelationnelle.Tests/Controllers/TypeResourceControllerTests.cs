using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using RessourceRelationnelle.API.Controllers;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;
using Xunit;

namespace RessourceRelationnelle.Tests.Controllers
{
    public class TypeResourceControllerTests
    {
        private readonly Mock<ITypeResourceRepository> mockRepo;
        private readonly TypeResourceController controller;

        public TypeResourceControllerTests()
        {
            mockRepo = new Mock<ITypeResourceRepository>();
            var mockUserManager = new Mock<UserManager<UserModel>>(
                Mock.Of<IUserStore<UserModel>>(), null, null, null, null, null, null, null, null);
            controller = new TypeResourceController(mockRepo.Object, mockUserManager.Object);
        }

        // --- GetAll ---

        [Fact]
        public async Task GetAll_ReturnsOk()
        {
            var types = new List<TypeResourceModel>
            {
                new() { Id = "1", TypeRessource = "ARTICLE" }
            };
            mockRepo.Setup(r => r.GetAll()).ReturnsAsync(types);

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

        // --- GetOne ---

        [Fact]
        public async Task GetOne_ReturnsOk_WhenExists()
        {
            var type = new TypeResourceModel { Id = "1", TypeRessource = "ARTICLE" };
            mockRepo.Setup(r => r.GetOne("1")).ReturnsAsync(type);

            var result = await controller.GetOne("1");

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetOne_ReturnsNotFound_WhenMissing()
        {
            mockRepo.Setup(r => r.GetOne("999")).ReturnsAsync((TypeResourceModel?)null);

            var result = await controller.GetOne("999");

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task GetOne_ReturnsBadRequest_WhenException()
        {
            mockRepo.Setup(r => r.GetOne("1")).ThrowsAsync(new Exception("DB error"));

            var result = await controller.GetOne("1");

            Assert.IsType<BadRequestObjectResult>(result);
        }

        // --- Delete ---

        [Fact]
        public async Task Delete_ReturnsOk_WhenExists()
        {
            var type = new TypeResourceModel { Id = "1", TypeRessource = "ARTICLE" };
            mockRepo.Setup(r => r.GetOne("1")).ReturnsAsync(type);
            mockRepo.Setup(r => r.Delete("1")).Returns(Task.CompletedTask);

            var result = await controller.Delete("1");

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task Delete_ReturnsNotFound_WhenMissing()
        {
            mockRepo.Setup(r => r.GetOne("999")).ReturnsAsync((TypeResourceModel?)null);

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

        // --- Update ---

        [Fact]
        public async Task Update_ReturnsOk_WhenSuccess()
        {
            var existing = new TypeResourceModel { Id = "1", TypeRessource = "ARTICLE" };
            mockRepo.Setup(r => r.GetOne("1")).ReturnsAsync(existing);
            mockRepo.Setup(r => r.Update(It.IsAny<TypeResourceModel>())).ReturnsAsync(existing);

            var result = await controller.Update(existing);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task Update_ReturnsNotFound_WhenMissing()
        {
            var model = new TypeResourceModel { Id = "999", TypeRessource = "TEST" };
            mockRepo.Setup(r => r.GetOne("999")).ReturnsAsync((TypeResourceModel?)null);

            var result = await controller.Update(model);

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task Update_ReturnsBadRequest_WhenException()
        {
            var model = new TypeResourceModel { Id = "1", TypeRessource = "TEST" };
            mockRepo.Setup(r => r.GetOne("1")).ThrowsAsync(new Exception("DB error"));

            var result = await controller.Update(model);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        // --- Create ---

        [Fact]
        public async Task Create_ReturnsOk_WhenNew()
        {
            mockRepo.Setup(r => r.GetOneByName("TEST")).ReturnsAsync((TypeResourceModel?)null);
            mockRepo.Setup(r => r.Create(It.IsAny<TypeResourceModel>()))
                .ReturnsAsync(new TypeResourceModel { Id = "new", TypeRessource = "TEST" });

            var model = new TypeResourceController.CreateNewTypeResourceModel { TypeResource = "Test" };
            var result = await controller.Create(model);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task Create_ReturnsBadRequest_WhenExists()
        {
            var existing = new TypeResourceModel { Id = "1", TypeRessource = "TEST" };
            mockRepo.Setup(r => r.GetOneByName("TEST")).ReturnsAsync(existing);

            var model = new TypeResourceController.CreateNewTypeResourceModel { TypeResource = "Test" };
            var result = await controller.Create(model);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Create_ReturnsBadRequest_WhenException()
        {
            mockRepo.Setup(r => r.GetOneByName(It.IsAny<string>())).ThrowsAsync(new Exception("DB error"));

            var model = new TypeResourceController.CreateNewTypeResourceModel { TypeResource = "Test" };
            var result = await controller.Create(model);

            Assert.IsType<BadRequestObjectResult>(result);
        }
    }
}