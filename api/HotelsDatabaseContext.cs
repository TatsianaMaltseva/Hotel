using iTechArt.Hotels.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace iTechArt.Hotels.Api
{
    public class HotelsDatabaseContext : DbContext
    {
        public HotelsDatabaseContext(DbContextOptions<HotelsDatabaseContext> options)
            : base(options)
        {
        }

        public DbSet<AccountEntity> Accounts { get; set; }
        public DbSet<HotelEntity> Hotels { get; set; }
        public DbSet<ImageEntity> Images { get; set; }
        public DbSet<RoomEntity> Rooms { get; set; }
        public DbSet<FacilityEntity> Facilities { get; set; }
        public DbSet<FacilityHotel> FacilityHotel { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AccountEntity>(entity =>
            {
                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(125);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(44)
                    .IsUnicode(false)
                    .IsFixedLength(true);

                entity.Property(e => e.Role)
                    .HasMaxLength(25);

                entity.Property(e => e.Salt)
                    .IsRequired()
                    .HasMaxLength(24)
                    .IsUnicode(false)
                    .IsFixedLength(true);
            });

            modelBuilder.Entity<HotelEntity>(entity =>
            {
                entity.Property(e => e.Address)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.Country)
                    .HasMaxLength(150);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.City)
                    .HasMaxLength(200);

                entity.Property(e => e.Description)
                    .HasMaxLength(3000);
            });

            modelBuilder.Entity<FacilityHotel>()
                .HasOne(fh => fh.Facility)
                .WithMany(f => f.FacilityHotels)
                .HasForeignKey(fh => fh.FacilityId);

            modelBuilder.Entity<FacilityHotel>()
                .HasOne(fh => fh.Hotel)
                .WithMany(h => h.FacilityHotels)
                .HasForeignKey(fh => fh.HotelId);
        }
    }
}