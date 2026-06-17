using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.Data.Repositories.Sql;
using RessourceRelationnelle.Tests.Helpers;
using Xunit;

namespace RessourceRelationnelle.Tests.Repositories
{
    public class SqlResourceRepositoryTests : IDisposable
    {
        private readonly DATA.DataContext context;
        private readonly SqlResourceRepository repository;

        public SqlResourceRepositoryTests()
        {
            context = TestDbContextFactory.Create();
            repository = new SqlResourceRepository(context);
            SeedData();
        }

        private void SeedData()
        {
            var user = new UserModel
            {
                Id = "user1",
                UserName = "testuser",
                Email = "test@test.com",
                SecurityStamp = Guid.NewGuid().ToString()
            };
            context.Users.Add(user);

            var category = new CategoryModel { Id = "cat1", CategoryName = "TEST" };
            context.Categories.Add(category);

            var typeRelation = new TypeRelationModel { Id = "rel1", TypeRelation = "SOI" };
            context.TypeRelations.Add(typeRelation);

            var typeResource = new TypeResourceModel { Id = "type1", TypeRessource = "ARTICLE" };
            context.TypeResources.Add(typeResource);

            context.SaveChanges();

            context.Resources.AddRange(
                new ResourceModel
                {
                    Id = "res1",
                    Title = "Ressource 1",
                    Resume = "Resume 1",
                    Content = "Contenu 1",
                    Url = "https://test.local/1",
                    PublicationStatus = "Approved",
                    CategoryId = "cat1",
                    TypeRelationId = "rel1",
                    TypeRessourceId = "type1",
                    UserId = "user1"
                },
                new ResourceModel
                {
                    Id = "res2",
                    Title = "Ressource 2",
                    Resume = "Resume 2",
                    Content = "Contenu 2",
                    Url = "https://test.local/2",
                    PublicationStatus = "Pending",
                    CategoryId = "cat1",
                    TypeRelationId = "rel1",
                    TypeRessourceId = "type1",
                    UserId = "user1"
                }
            );
            context.SaveChanges();
        }

        [Fact]
        public async Task GetOne_ReturnsResource_WhenExists()
        {
            var result = await repository.GetOne("res1");
            Assert.NotNull(result);
            Assert.Equal("Ressource 1", result.Title);
        }

        [Fact]
        public async Task GetOne_ReturnsNull_WhenNotExists()
        {
            var result = await repository.GetOne("inexistant");
            Assert.Null(result);
        }

        [Fact]
        public async Task GetOne_IncludesRelatedData()
        {
            var result = await repository.GetOne("res1");
            Assert.NotNull(result);
            Assert.NotNull(result.User);
            Assert.NotNull(result.Category);
            Assert.NotNull(result.TypeRessource);
            Assert.NotNull(result.TypeRelation);
        }

        [Fact]
        public async Task GetForUser_ReturnsUserResources()
        {
            var result = await repository.GetForUser("user1");
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetForUser_ReturnsEmpty_WhenNoMatch()
        {
            var result = await repository.GetForUser("inexistant");
            Assert.Empty(result);
        }

        [Fact]
        public async Task Create_AddsResource()
        {
            var newResource = new ResourceModel
            {
                Title = "Nouvelle",
                Resume = "Resume",
                Content = "Contenu",
                Url = "https://test.local/new",
                PublicationStatus = "Pending",
                CategoryId = "cat1",
                TypeRelationId = "rel1",
                TypeRessourceId = "type1",
                UserId = "user1"
            };

            var result = await repository.Create(newResource);

            Assert.NotNull(result.Id);
            Assert.Equal("Nouvelle", result.Title);
            Assert.NotNull(result.User);
            Assert.Equal(3, context.Resources.Count());
        }

        public void Dispose()
        {
            context.Database.CloseConnection();
            context.Dispose();
        }
    }
}