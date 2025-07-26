using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // DbSet'ler
        public DbSet<Point> Points { get; set; }
        public DbSet<LineEntity> Lines { get; set; }
        public DbSet<PolygonEntity> Polygons { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.HasPostgresExtension("postgis");

            modelBuilder.Entity<Point>()
                .ToTable("points")
                .Property(p => p.Geom)
                .HasColumnType("geometry(Point,4326)");

            modelBuilder.Entity<LineEntity>()
                .ToTable("Lines")
                .Property(l => l.Geom)
                .HasColumnType("geometry(LineString,4326)");

            modelBuilder.Entity<PolygonEntity>()
                .ToTable("Polygons")
                .Property(p => p.Geom)
                .HasColumnType("geometry(Polygon,4326)");
        }
    }
}
