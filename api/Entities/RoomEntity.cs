using DataAnnotationsExtensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace iTechArt.Hotels.Api.Entities
{
    public class RoomEntity
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; }

        [Required]
        [Min(0)]
        public int Sleeps { get; set; }

        [Required]
        [Min(0)]
        public int Number { get; set; }

        [Column(TypeName = "decimal(19,4)")]
        [Required]
        [Min(0)]
        public decimal Price { get; set; }

        [Required]
        public int HotelId { get; set; }

        public int? MainImageId { get; set; }
    }
}
