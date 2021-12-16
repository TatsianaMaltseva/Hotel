using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Entities
{
    public class ImageEntity
    {
        public int HotelId { get; set; }
        [Key]
        [MaxLength(36)]
        public string Id { get; set; }

        [MaxLength(5)]
        public string Extension { get; set; }
    }
}