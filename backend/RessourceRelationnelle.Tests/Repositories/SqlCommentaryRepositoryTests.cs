using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories.Sql;
using RessourceRelationnelle.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace RessourceRelationnelle.Tests.Repositories
{
    public class SqlCommentaryRepositoryTests : IDisposable
    {
        private readonly DATA.DataContext context;
        private readonly SqlCommentaryRepository repository;

        public SqlCommentaryRepositoryTests()
        {
            context = TestDbContextFactory.Create();
            repository = new SqlCommentaryRepository(context);
            SeedData();
        }

        private void SeedData()
        {
            // Créer les entités requises par les clés étrangères
            var category = new CategoryModel { Id = "cat1", CategoryName = "TEST" };
            context.Categories.Add(category);

            var typeRelation = new TypeRelationModel { Id = "rel1", TypeRelation = "SOI" };
            context.TypeRelations.Add(typeRelation);

            var typeResource = new TypeResourceModel { Id = "type1", TypeRessource = "ARTICLE" };
            context.TypeResources.Add(typeResource);

            var user = new UserModel
            {
                Id = "user1",
                UserName = "testuser",
                Email = "test@test.com",
                SecurityStamp = Guid.NewGuid().ToString()
            };
            context.Users.Add(user);

            context.SaveChanges();

            var resource = new ResourceModel
            {
                Id = "res1",
                Title = "Ressource test",
                Resume = "Résumé",
                Content = "Contenu",
                Url = "https://test.local/res1",
                PublicationStatus = "Approved",
                CategoryId = "cat1",
                TypeRelationId = "rel1",
                TypeRessourceId = "type1",
                UserId = "user1"
            };
            context.Resources.Add(resource);

            context.SaveChanges();

            context.Comments.AddRange(
                new CommentaryModel
                {
                    Id = "comment1",
                    Content = "Premier commentaire",
                    ModerationStatus = "Approved",
                    UserId = "user1",
                    ResourceId = "res1"
                },
                new CommentaryModel
                {
                    Id = "comment2",
                    Content = "Deuxième commentaire",
                    ModerationStatus = "Pending",
                    UserId = "user1",
                    ResourceId = "res1"
                },
                new CommentaryModel
                {
                    Id = "comment3",
                    Content = "Troisième commentaire",
                    ModerationStatus = "Approved",
                    UserId = "user1",
                    ResourceId = "res1"
                }
            );

            context.SaveChanges();
        }

        [Fact]
        public async Task GetAll_ReturnsAllComments()
        {
            var result = await repository.GetAll();
            Assert.Equal(3, result.Count);
        }

        [Fact]
        public async Task GetAll_IncludesUserData()
        {
            var result = await repository.GetAll();
            Assert.All(result, c => Assert.NotNull(c.User));
            Assert.All(result, c => Assert.NotNull(c.User.UserName));
        }

        [Fact]
        public async Task GetAll_IncludesResourceData()
        {
            var result = await repository.GetAll();
            Assert.All(result, c => Assert.NotNull(c.Resource));
            Assert.All(result, c => Assert.NotNull(c.Resource.Title));
        }

        [Fact]
        public async Task GetById_ReturnsComment_WhenExists()
        {
            var result = await repository.GetById("comment1");
            Assert.NotNull(result);
            Assert.Equal("Premier commentaire", result.Content);
        }

        [Fact]
        public async Task GetById_ReturnsNull_WhenNotExists()
        {
            var result = await repository.GetById("inexistant");
            Assert.Null(result);
        }

        [Fact]
        public async Task Delete_ReturnsTrue_WhenCommentExists()
        {
            var result = await repository.Delete("comment1");
            Assert.True(result);
            Assert.Equal(2, context.Comments.Count());
        }

        [Fact]
        public async Task Delete_ReturnsFalse_WhenCommentNotExists()
        {
            var result = await repository.Delete("inexistant");
            Assert.False(result);
            Assert.Equal(3, context.Comments.Count());
        }

        [Fact]
        public async Task Delete_RemovesCorrectComment()
        {
            await repository.Delete("comment2");
            var deleted = await repository.GetById("comment2");
            var remaining = await repository.GetById("comment1");
            Assert.Null(deleted);
            Assert.NotNull(remaining);
        }

        public void Dispose()
        {
            context.Database.CloseConnection();
            context.Dispose();
        }
    }
}