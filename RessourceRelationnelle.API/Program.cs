using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA;

namespace RessourceRelationnelle.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();

            builder.Services.AddDbContext<DataContext>(options =>
            options.UseSqlite(builder.Configuration.GetConnectionString("Default"),
                    b => b.MigrationsAssembly("RessourceRelationnelle.API")));

            builder.Services.AddOpenApi();

            var app = builder.Build();
             
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
