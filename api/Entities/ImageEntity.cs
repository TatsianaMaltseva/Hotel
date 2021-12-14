using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Entities
{
    public class ImageEntity
    {
        public int HotelId { get; set; }
        [Key]
        [MaxLength(58)]
        public string Path { get; set; }
    }
}