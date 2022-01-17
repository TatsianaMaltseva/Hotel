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

        public int HotelId { get; set; }

        public int? RoomId { get; set; }
    }
}