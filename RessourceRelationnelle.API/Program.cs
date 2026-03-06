using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using RessourceRelationnelle.API.Services;
using RessourceRelationnelle.Data.Repositories.Sql;
using RessourceRelationnelle.DATA;
using RessourceRelationnelle.DATA.Models;
using RessourceRelationnelle.DATA.Repositories;
using RessourceRelationnelle.DATA.Repositories.Sql;
using System.Text;

namespace RessourceRelationnelle.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args); 

            builder.Services.AddControllers();

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "Security", Version = "v1" });
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter token",
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                 {
                     {
                         new OpenApiSecurityScheme
                         {
                             Reference = new OpenApiReference
                             {
                                 Type = ReferenceType.SecurityScheme,
                                 Id = "Bearer",
                             }
                         },
                         new string[]{ }
                     }
                 });
            });

            builder.Services.AddDbContext<DataContext>(options =>
            options.UseSqlite(builder.Configuration.GetConnectionString("Default"),
                    b => b.MigrationsAssembly("RessourceRelationnelle.API")));

            builder.Services.AddScoped<IResourceRepository, SqlResourceRepository>();
            builder.Services.AddScoped<ICategoryRepository, SQLCategoryRepository>();

            builder.Services.AddIdentity<UserModel, IdentityRole>()
                .AddEntityFrameworkStores<DataContext>()
                .AddDefaultTokenProviders();


            builder.Services.AddOpenApi();

            builder.Services.AddAuthentication(options =>
            {
                // Authentification + autorisation en JWT
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                // Configuration de la validation du token
                options.SaveToken = true; // permet d'automatiser la vérification de l'expiration
                options.RequireHttpsMetadata = false; // token pas dans url
                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
                {
                    // Ce qu'on vérifie quand on reçoit un token
                    ValidateIssuer = false, // Vérif emetteur du token
                    ValidateLifetime = true, // Vérif exipration token
                    ValidateAudience = false, // Vérif client
                    ValidateIssuerSigningKey = true, // Vérif signature
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]))
                };
            });

            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                DataServices.Initialize(scope.ServiceProvider);
            }



            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
