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
        public DbSet<RoomViewEntity> RoomViews { get; set; }

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
                .HasOne<HotelEntity>()
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

            modelBuilder.Entity<RoomEntity>()
                .HasMany(room => room.ActiveViews)
                .WithOne()
                .HasForeignKey(viev => viev.RoomId);

            modelBuilder.Entity<FacilityEntity>()
                .Property(e => e.Realm)
                .HasConversion<string>();

            modelBuilder.Entity<AccountEntity>()
                .Property(e => e.Role)
                .HasConversion<string>();

            modelBuilder.Entity<RoomViewEntity>()
                .HasOne<AccountEntity>()
                .WithMany()
                .HasForeignKey(view => view.AccountId);

            modelBuilder.Entity<OrderEntity>()
                .HasMany(o => o.Facilities)
                .WithMany(nameof(Orders));
        }
    }
}