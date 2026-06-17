using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories.Sql;
using RessourceRelationnelle.Tests.Helpers;
using Xunit;

namespace RessourceRelationnelle.Tests.Repositories
{
    public class SqlRelationTypeRepositoryTests : IDisposable
    {
        private readonly DATA.DataContext context;
        private readonly SQLRelationTypeRepository repository;

        public SqlRelationTypeRepositoryTests()
        {
            context = TestDbContextFactory.Create();
            repository = new SQLRelationTypeRepository(context);
            SeedData();
        }

        private void SeedData()
        {
            context.TypeRelations.AddRange(
                new TypeRelationModel { Id = "rel1", TypeRelation = "SOI" },
                new TypeRelationModel { Id = "rel2", TypeRelation = "CONJOINTS" },
                new TypeRelationModel { Id = "rel3", TypeRelation = "INCONNUS" }
            );
            context.SaveChanges();
        }

        [Fact]
        public async Task GetAll_ReturnsAll()
        {
            var result = await repository.GetAll();
            Assert.Equal(3, result.Count());
        }

        [Fact]
        public async Task GetOne_ReturnsItem_WhenExists()
        {
            var result = await repository.GetOne("rel1");
            Assert.NotNull(result);
            Assert.Equal("SOI", result.TypeRelation);
        }

        [Fact]
        public async Task GetOne_ReturnsNull_WhenNotExists()
        {
            var result = await repository.GetOne("inexistant");
            Assert.Null(result);
        }

        [Fact]
        public async Task GetOneByName_ReturnsItem_WhenExists()
        {
            var result = await repository.GetOneByName("CONJOINTS");
            Assert.NotNull(result);
            Assert.Equal("rel2", result.Id);
        }

        [Fact]
        public async Task GetOneByName_ReturnsNull_WhenNotExists()
        {
            var result = await repository.GetOneByName("INEXISTANT");
            Assert.Null(result);
        }

        [Fact]
        public async Task Create_AddsItem()
        {
            var newItem = new TypeRelationModel { TypeRelation = "NOUVEAU" };
            var result = await repository.Create(newItem);

            Assert.NotNull(result.Id);
            Assert.Equal(4, context.TypeRelations.Count());
        }

        [Fact]
        public async Task Delete_RemovesItem_WhenExists()
        {
            await repository.Delete("rel1");
            Assert.Equal(2, context.TypeRelations.Count());
        }

        [Fact]
        public async Task Delete_DoesNothing_WhenNotExists()
        {
            await repository.Delete("inexistant");
            Assert.Equal(3, context.TypeRelations.Count());
        }

        [Fact]
        public async Task Update_ModifiesItem()
        {
            var model = new TypeRelationModel { Id = "rel1", TypeRelation = "UPDATED" };
            var result = await repository.Update(model);

            Assert.Equal("UPDATED", result.TypeRelation);
        }

        [Fact]
        public async Task Update_ThrowsException_WhenNotExists()
        {
            var model = new TypeRelationModel { Id = "inexistant", TypeRelation = "TEST" };
            await Assert.ThrowsAsync<Exception>(() => repository.Update(model));
        }

        public void Dispose()
        {
            context.Database.CloseConnection();
            context.Dispose();
        }
    }
}