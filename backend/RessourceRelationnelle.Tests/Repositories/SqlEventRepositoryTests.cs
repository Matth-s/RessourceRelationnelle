using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories.Sql;
using RessourceRelationnelle.Tests.Helpers;
using Xunit;

namespace RessourceRelationnelle.Tests.Repositories
{
    public class SqlEventRepositoryTests : IDisposable
    {
        private readonly DATA.DataContext context;
        private readonly SQLEventRepository repository;

        public SqlEventRepositoryTests()
        {
            context = TestDbContextFactory.Create();
            repository = new SQLEventRepository(context);
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

            var zone = new DemographicZoneModel { Id = "zone1", Zone = "CENTRE-VILLE" };
            context.DemographicsZone.Add(zone);

            context.SaveChanges();

            var resource = new ResourceModel
            {
                Id = "res1",
                Title = "Test",
                Resume = "Resume",
                Content = "Content",
                Url = "https://test.local/1",
                PublicationStatus = "Approved",
                CategoryId = "cat1",
                TypeRelationId = "rel1",
                TypeRessourceId = "type1",
                UserId = "user1"
            };
            context.Resources.Add(resource);
            context.SaveChanges();

            context.Event.AddRange(
                new EventModel
                {
                    Id = "evt1",
                    Type = "ATELIER",
                    StartAt = DateTime.UtcNow.AddDays(1),
                    UserId = "user1",
                    ResourceId = "res1",
                    DemographicZoneId = "zone1"
                },
                new EventModel
                {
                    Id = "evt2",
                    Type = "FORMATION",
                    StartAt = DateTime.UtcNow.AddDays(2),
                    UserId = "user1",
                    ResourceId = "res1",
                    DemographicZoneId = "zone1"
                }
            );
            context.SaveChanges();
        }

        [Fact]
        public async Task GetAll_ReturnsAllEvents()
        {
            var result = await repository.GetAll();
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetEvent_ReturnsEvent_WhenExists()
        {
            var result = await repository.GetEvent("evt1");
            Assert.NotNull(result);
            Assert.Equal("ATELIER", result.Type);
        }

        [Fact]
        public async Task GetEvent_ReturnsNull_WhenNotExists()
        {
            var result = await repository.GetEvent("inexistant");
            Assert.Null(result);
        }

        [Fact]
        public async Task Create_AddsEvent()
        {
            var newEvent = new EventModel
            {
                Type = "NOUVEAU",
                StartAt = DateTime.UtcNow,
                UserId = "user1",
                ResourceId = "res1",
                DemographicZoneId = "zone1"
            };
            var result = await repository.Create(newEvent);

            Assert.NotNull(result.Id);
            Assert.Equal(3, context.Event.Count());
        }

        [Fact]
        public async Task Delete_ReturnsTrue_WhenExists()
        {
            foreach (var entry in context.ChangeTracker.Entries().ToList())
            {
                entry.State = EntityState.Detached;
            }

            var result = await repository.Delete("evt1");
            Assert.True(result);
            Assert.Equal(1, context.Event.Count());
        }

        [Fact]
        public async Task Delete_ReturnsFalse_WhenNotExists()
        {
            var result = await repository.Delete("inexistant");
            Assert.False(result);
            Assert.Equal(2, context.Event.Count());
        }

        [Fact]
        public async Task GetForResource_ReturnsEvents()
        {
            var result = await repository.GetForResource("res1");
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetForResource_ReturnsEmpty_WhenNoMatch()
        {
            var result = await repository.GetForResource("inexistant");
            Assert.Empty(result);
        }

        [Fact]
        public async Task Update_ModifiesEvent()
        {
            var updated = new EventModel
            {
                Id = "evt1",
                Type = "UPDATED",
                StartAt = DateTime.UtcNow,
                UserId = "user1",
                ResourceId = "res1",
                DemographicZoneId = "zone1"
            };
            var result = await repository.Update("evt1", updated);

            Assert.NotNull(result);
            Assert.Equal("UPDATED", result.Type);
        }

        [Fact]
        public async Task Update_ReturnsNull_WhenNotExists()
        {
            var updated = new EventModel { Id = "inexistant", Type = "TEST" };
            var result = await repository.Update("inexistant", updated);

            Assert.Null(result);
        }

        public void Dispose()
        {
            context.Database.CloseConnection();
            context.Dispose();
        }
    }
}