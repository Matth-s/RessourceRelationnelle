using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA.Models;

namespace RessourceRelationnelle.DATA
{
    public class DataContext : IdentityDbContext<UserModel>
    {
        public DbSet <ResourceModel> Resources { get; set; }
        public DbSet<ActiveSessionModel> ActiveSessions { get; set; }
        public DbSet<CategoryModel> Categories { get; set; }
        public DbSet<CommentaryModel> Comments { get; set; }
        public DbSet<DemographicZoneModel> DemographicsZone { get; set; }
        public DbSet<EventModel> Event { get; set; }
        public DbSet<ParticipationModel> Participations { get; set; }
        public DbSet<ProgressionModel> Progression { get; set; }
        public DbSet<SharedModel> Shared { get; set; }
        public DbSet<TypeResourceModel> TypeResources { get; set; }
        public DbSet<TypeRelationModel> TypeRelations { get; set; }


        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<ProgressionModel>()
                .HasKey(p => new { p.UserId, p.ResourceId });

            modelBuilder.Entity<ParticipationModel>()
                .HasKey(p => new { p.UserId, p.SessionId });

            modelBuilder.Entity<SharedModel>()
                .HasKey(p => new { p.UserId, p.ResourceId });
        }
    }
}


