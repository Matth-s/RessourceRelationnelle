using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories.Sql;
using RessourceRelationnelle.Tests.Helpers;
using Xunit;

namespace RessourceRelationnelle.Tests.Repositories
{
    public class SqlTypeResourceRepositoryTests : IDisposable
    {
        private readonly DATA.DataContext context;
        private readonly SQLTypeResourceRepository repository;

        public SqlTypeResourceRepositoryTests()
        {
            context = TestDbContextFactory.Create();
            repository = new SQLTypeResourceRepository(context);
            SeedData();
        }

        private void SeedData()
        {
            context.TypeResources.AddRange(
                new TypeResourceModel { Id = "type1", TypeRessource = "ARTICLE" },
                new TypeResourceModel { Id = "type2", TypeRessource = "VIDÉO" },
                new TypeResourceModel { Id = "type3", TypeRessource = "CARTE DÉFI" }
            );
            context.SaveChanges();
        }

        [Fact]
        public async Task GetOneByName_ReturnsItem_WhenExists()
        {
            var result = await repository.GetOneByName("ARTICLE");
            Assert.NotNull(result);
            Assert.Equal("type1", result.Id);
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
            var newItem = new TypeResourceModel { TypeRessource = "NOUVEAU" };
            var result = await repository.Create(newItem);

            Assert.NotNull(result.Id);
            Assert.Equal(4, context.TypeResources.Count());
        }

        [Fact]
        public async Task Delete_RemovesItem_WhenExists()
        {
            await repository.Delete("type1");
            Assert.Equal(2, context.TypeResources.Count());
        }

        [Fact]
        public async Task Delete_DoesNothing_WhenNotExists()
        {
            await repository.Delete("inexistant");
            Assert.Equal(3, context.TypeResources.Count());
        }

        [Fact]
        public async Task GetAll_ThrowsNotImplementedException()
        {
            await Assert.ThrowsAsync<NotImplementedException>(() => repository.GetAll());
        }

        [Fact]
        public async Task GetOne_ThrowsNotImplementedException()
        {
            await Assert.ThrowsAsync<NotImplementedException>(() => repository.GetOne("type1"));
        }

        [Fact]
        public async Task Update_ThrowsNotImplementedException()
        {
            var model = new TypeResourceModel { Id = "type1", TypeRessource = "TEST" };
            await Assert.ThrowsAsync<NotImplementedException>(() => repository.Update(model));
        }

        public void Dispose()
        {
            context.Database.CloseConnection();
            context.Dispose();
        }
    }
}