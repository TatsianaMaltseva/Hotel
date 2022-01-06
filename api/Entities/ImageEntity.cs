using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace iTechArt.Hotels.Api.Entities
{
    public class ImageEntity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(2000)]
        public string Path { get; set; }

        public bool IsOuterLink { get; set; }

        [ForeignKey("Hotel")]
        public int HotelId { get; set; }

        public HotelEntity Hotel { get; set; }

        [ForeignKey("Room")]
        public int? RoomId { get; set; }
        public RoomEntity Room { get; set; }
    }
}