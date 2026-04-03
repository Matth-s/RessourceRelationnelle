using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA;

namespace RessourceRelationnelle.Tests.Helpers
{
    public static class TestDbContextFactory
    {
        public static DataContext Create()
        {
            var options = new DbContextOptionsBuilder<DataContext>()
                .UseSqlite("DataSource=:memory:")
                .Options;

            var context = new DataContext(options);
            context.Database.OpenConnection();
            context.Database.EnsureCreated();

            return context;
        }
    }
}