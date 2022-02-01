using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.JoinEntities;
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
        public DbSet<FacilityHotelEntity> FacilityHotel { get; set; }
        public DbSet<FacilityRoomEntity> FacilityRoom { get; set; }
        public DbSet<OrderEntity> Orders { get; set; }

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

            modelBuilder.Entity<ImageEntity>()
                .HasOne(i => i.Hotel)
                .WithMany()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FacilityEntity>()
                .Property(e => e.Realm)
                .HasConversion<string>();

            modelBuilder.Entity<HotelEntity>()
                .HasMany(hotel => hotel.Rooms)
                .WithOne()
                .HasForeignKey(room => room.HotelId);

            modelBuilder.Entity<RoomEntity>()
                .HasMany(room => room.Orders)
                .WithOne(order => order.Room)
                .HasForeignKey(order => order.RoomId);

            modelBuilder.Entity<OrderEntity>()
                .HasOne(order => order.Hotel)
                .WithMany()
                .HasForeignKey(order => order.HotelId);

            modelBuilder.Entity<HotelEntity>()
                .HasMany(hotel => hotel.Facilities)
                .WithMany(facility => facility.Hotels)
                .UsingEntity<FacilityHotelEntity>(
                    j => j
                        .HasOne(fh => fh.Facility)
                        .WithMany(f => f.FacilityHotels)
                        .HasForeignKey(fh => fh.FacilityId),
                    j => j
                        .HasOne(fh => fh.Hotel)
                        .WithMany(h => h.FacilityHotels)
                        .HasForeignKey(fh => fh.HotelId),
                    j => j.HasKey(j => j.Id)
                );

            modelBuilder.Entity<RoomEntity>()
                .HasMany(room => room.Facilities)
                .WithMany(facility => facility.Rooms)
                .UsingEntity<FacilityRoomEntity>(
                    j => j
                        .HasOne(fr => fr.Facility)
                        .WithMany(f => f.FacilityRooms)
                        .HasForeignKey(fr => fr.FacilityId),
                    j => j
                        .HasOne(fr => fr.Room)
                        .WithMany(r => r.FacilityRooms)
                        .HasForeignKey(fr => fr.RoomId),
                    j => j.HasKey(j => j.Id)
                );

            modelBuilder.Entity<OrderEntity>()
                .HasMany(order => order.Facilities)
                .WithMany(facility => facility.Orders)
                .UsingEntity(t => t.ToTable("FacilityOrder"));
        }
    }
}