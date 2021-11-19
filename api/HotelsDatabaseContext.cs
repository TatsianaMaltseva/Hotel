using Microsoft.EntityFrameworkCore;

namespace iTechArt.Hotels.Api
{
    public class HotelsDatabaseContext : DbContext
    {
        public HotelsDatabaseContext(DbContextOptions<HotelsDatabaseContext> options)
            : base(options)
        {
        }

        public DbSet<Account> Accounts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>(entity =>
            {
                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(125)
                    .IsUnicode(false);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(44)
                    .IsUnicode(false)
                    .IsFixedLength(true);

                entity.Property(e => e.Salt)
                    .IsRequired()
                    .HasMaxLength(24)
                    .IsUnicode(false)
                    .IsFixedLength(true);

                entity.Property(e => e.Role)
                    .HasMaxLength(25)
                    .IsUnicode(false);
            });
        }
    }
}
