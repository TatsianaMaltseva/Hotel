using Microsoft.EntityFrameworkCore;

namespace iTechArt.Hotels.Api
{
    public partial class HotelsDatabaseContext : DbContext
    {
        public HotelsDatabaseContext(DbContextOptions<HotelsDatabaseContext> options)
            : base(options)
        {
        }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<Hotel> Hotels { get; set; }
        public DbSet<Image> Images { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>(entity =>
            {
                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(125)
                    .IsUnicode(true);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(44)
                    .IsUnicode(false)
                    .IsFixedLength(true);

                entity.Property(e => e.Role)
                    .HasMaxLength(25)
                    .IsUnicode(true);

                entity.Property(e => e.Salt)
                    .IsRequired()
                    .HasMaxLength(24)
                    .IsUnicode(false)
                    .IsFixedLength(true);
            });

            modelBuilder.Entity<Hotel>(entity =>
            {
                entity.Property(e => e.Address)
                    .IsRequired()
                    .HasMaxLength(155)
                    .IsUnicode(true);
                entity.Property(e => e.Country)
                    .IsRequired()
                    .HasMaxLength(56)
                    .IsUnicode(true);
                entity.Property(e => e.City)
                    .IsRequired()
                    .HasMaxLength(85)
                    .IsUnicode(true);
                entity.Property(e => e.Name)
                   .IsRequired()
                   .HasMaxLength(60)
                   .IsUnicode(true);
                entity.Property(e => e.Description)
                    .HasMaxLength(3000)
                    .IsUnicode(true);
            });

            modelBuilder.Entity<Image>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.ImageData).HasColumnName("Image");

                entity.Property(e => e.ImageId).ValueGeneratedOnAdd();

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("name");
            });
        }
    }
}
