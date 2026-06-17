using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories.Sql;
using RessourceRelationnelle.Tests.Helpers;
using Xunit;

namespace RessourceRelationnelle.Tests.Repositories
{
    public class SqlCategoryRepositoryTests : IDisposable
    {
        private readonly DATA.DataContext context;
        private readonly SQLCategoryRepository repository;

        public SqlCategoryRepositoryTests()
        {
            context = TestDbContextFactory.Create();
            repository = new SQLCategoryRepository(context);
            SeedData();
        }

        private void SeedData()
        {
            context.Categories.AddRange(
                new CategoryModel { Id = "cat1", CategoryName = "COMMUNICATION" },
                new CategoryModel { Id = "cat2", CategoryName = "CULTURES" },
                new CategoryModel { Id = "cat3", CategoryName = "LOISIRS" }
            );
            context.SaveChanges();
        }

        [Fact]
        public async Task GetAll_ReturnsAllCategories()
        {
            var result = await repository.GetAll();
            Assert.Equal(3, result.Count());
        }

        [Fact]
        public async Task GetOne_ReturnsCategory_WhenExists()
        {
            var result = await repository.GetOne("cat1");
            Assert.NotNull(result);
            Assert.Equal("COMMUNICATION", result.CategoryName);
        }

        [Fact]
        public async Task GetOne_ReturnsNull_WhenNotExists()
        {
            var result = await repository.GetOne("inexistant");
            Assert.Null(result);
        }

        [Fact]
        public async Task GetOneByName_ReturnsCategory_WhenExists()
        {
            var result = await repository.GetOneByName("CULTURES");
            Assert.NotNull(result);
            Assert.Equal("cat2", result.Id);
        }

        [Fact]
        public async Task GetOneByName_ReturnsNull_WhenNotExists()
        {
            var result = await repository.GetOneByName("INEXISTANT");
            Assert.Null(result);
        }

        [Fact]
        public async Task GetByName_ReturnsCategory_WhenExists()
        {
            var result = await repository.GetByName("LOISIRS");
            Assert.NotNull(result);
        }

        [Fact]
        public async Task GetByName_ReturnsNull_WhenNotExists()
        {
            var result = await repository.GetByName("INEXISTANT");
            Assert.Null(result);
        }

        [Fact]
        public async Task Create_AddsCategory()
        {
            var newCategory = new CategoryModel { CategoryName = "NOUVEAU" };
            var result = await repository.Create(newCategory);

            Assert.NotNull(result.Id);
            Assert.Equal("NOUVEAU", result.CategoryName);
            Assert.Equal(4, context.Categories.Count());
        }

        [Fact]
        public async Task Delete_RemovesCategory_WhenExists()
        {
            await repository.Delete("cat1");
            Assert.Equal(2, context.Categories.Count());
        }

        [Fact]
        public async Task Delete_DoesNothing_WhenNotExists()
        {
            await repository.Delete("inexistant");
            Assert.Equal(3, context.Categories.Count());
        }

        [Fact]
        public async Task Update_ModifiesCategory()
        {
            var model = new CategoryModel { Id = "cat1", CategoryName = "UPDATED" };
            var result = await repository.Update(model);

            Assert.Equal("UPDATED", result.CategoryName);
        }

        [Fact]
        public async Task Update_ThrowsException_WhenNotExists()
        {
            var model = new CategoryModel { Id = "inexistant", CategoryName = "TEST" };
            await Assert.ThrowsAsync<Exception>(() => repository.Update(model));
        }

        public void Dispose()
        {
            context.Database.CloseConnection();
            context.Dispose();
        }
    }
}