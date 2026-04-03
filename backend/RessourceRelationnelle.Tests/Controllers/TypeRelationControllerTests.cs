using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using RessourceRelationnelle.API.Controllers;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;
using Xunit;

namespace RessourceRelationnelle.Tests.Controllers
{
    public class TypeRelationControllerTests
    {
        private readonly Mock<IRelationTypeRepository> mockRepo;
        private readonly TypeRelationController controller;

        public TypeRelationControllerTests()
        {
            mockRepo = new Mock<IRelationTypeRepository>();
            var mockUserManager = new Mock<UserManager<UserModel>>(
                Mock.Of<IUserStore<UserModel>>(), null, null, null, null, null, null, null, null);
            controller = new TypeRelationController(mockRepo.Object, mockUserManager.Object);
        }

        // --- GetAll ---

        [Fact]
        public async Task GetAll_ReturnsOk()
        {
            var types = new List<TypeRelationModel>
            {
                new() { Id = "1", TypeRelation = "SOI" }
            };
            mockRepo.Setup(r => r.GetAll()).ReturnsAsync(types);

            var result = await controller.GetAll();

            var actionResult = Assert.IsType<ActionResult<IEnumerable<TypeRelationModel>>>(result);
            Assert.IsType<OkObjectResult>(actionResult.Result);
        }

        [Fact]
        public async Task GetAll_Returns500_WhenException()
        {
            mockRepo.Setup(r => r.GetAll()).ThrowsAsync(new Exception("DB error"));

            var result = await controller.GetAll();

            var actionResult = Assert.IsType<ActionResult<IEnumerable<TypeRelationModel>>>(result);
            var objectResult = Assert.IsType<ObjectResult>(actionResult.Result);
            Assert.Equal(500, objectResult.StatusCode);
        }

        // --- Create ---

        [Fact]
        public async Task Create_ReturnsOk_WhenNew()
        {
            mockRepo.Setup(r => r.GetOneByName("TEST")).ReturnsAsync((TypeRelationModel?)null);
            mockRepo.Setup(r => r.Create(It.IsAny<TypeRelationModel>())).ReturnsAsync(new TypeRelationModel { Id = "new", TypeRelation = "TEST" });

            var model = new TypeRelationController.CreateTypeRelationRequest { TypeRelation = "Test" };
            var result = await controller.Create(model);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task Create_ReturnsBadRequest_WhenExists()
        {
            var existing = new TypeRelationModel { Id = "1", TypeRelation = "SOI" };
            mockRepo.Setup(r => r.GetOneByName("Test")).ReturnsAsync(existing);

            var model = new TypeRelationController.CreateTypeRelationRequest { TypeRelation = "Test" };
            var result = await controller.Create(model);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Create_Returns500_WhenException()
        {
            mockRepo.Setup(r => r.GetOneByName(It.IsAny<string>())).ThrowsAsync(new Exception("DB error"));

            var model = new TypeRelationController.CreateTypeRelationRequest { TypeRelation = "Test" };
            var result = await controller.Create(model);

            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, objectResult.StatusCode);
        }

        // --- Delete (which is actually Update in the code) ---

        [Fact]
        public async Task PutUpdate_ReturnsOk_WhenExists()
        {
            var existing = new TypeRelationModel { Id = "1", TypeRelation = "SOI" };
            mockRepo.Setup(r => r.GetOne("1")).ReturnsAsync(existing);
            mockRepo.Setup(r => r.Update(It.IsAny<TypeRelationModel>())).ReturnsAsync(new TypeRelationModel { Id = "1", TypeRelation = "UPDATED" });

            var model = new TypeRelationController.CreateTypeRelationRequest { TypeRelation = "UPDATED" };
            var result = await controller.Delete("1", model);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task PutUpdate_ReturnsNotFound_WhenMissing()
        {
            mockRepo.Setup(r => r.GetOne("999")).ReturnsAsync((TypeRelationModel?)null);

            var model = new TypeRelationController.CreateTypeRelationRequest { TypeRelation = "TEST" };
            var result = await controller.Delete("999", model);

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task PutUpdate_Returns500_WhenException()
        {
            mockRepo.Setup(r => r.GetOne("1")).ThrowsAsync(new Exception("DB error"));

            var model = new TypeRelationController.CreateTypeRelationRequest { TypeRelation = "TEST" };
            var result = await controller.Delete("1", model);

            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, objectResult.StatusCode);
        }

        // --- Update (which is actually Delete in the code) ---

        [Fact]
        public async Task DeleteAction_ReturnsOk_WhenExists()
        {
            var existing = new TypeRelationModel { Id = "1", TypeRelation = "SOI" };
            mockRepo.Setup(r => r.GetOne("1")).ReturnsAsync(existing);
            mockRepo.Setup(r => r.Delete("1")).Returns(Task.CompletedTask);

            var result = await controller.Update("1");

            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task DeleteAction_ReturnsNotFound_WhenMissing()
        {
            mockRepo.Setup(r => r.GetOne("999")).ReturnsAsync((TypeRelationModel?)null);

            var result = await controller.Update("999");

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task DeleteAction_Returns500_WhenException()
        {
            mockRepo.Setup(r => r.GetOne("1")).ThrowsAsync(new Exception("DB error"));

            var result = await controller.Update("1");

            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, objectResult.StatusCode);
        }
    }
}