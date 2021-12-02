using System;
using Microsoft.EntityFrameworkCore;
namespace iTechArt.Hotels.Api
{
    public  class HotelsDatabaseContext : DbContext
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

                entity.Property(e => e.City)
                    .HasMaxLength(85)
                    .IsUnicode(true);

                entity.Property(e => e.Country)
                    .HasMaxLength(56)
                    .IsUnicode(true);

                entity.Property(e => e.Description)
                    .HasMaxLength(3000)
                    .IsUnicode(true);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(60)
                    .IsUnicode(true);
            });

            modelBuilder.Entity<Image>(entity =>
            {
                entity.Property(e => e.Path)
                    .IsRequired()
                    .HasMaxLength(265);

                entity.HasOne(d => d.Hotel)
                    .WithMany(p => p.Images)
                    .HasForeignKey(d => d.HotelId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Images__HotelId__2EDAF651");
            });
        }
    }
}
