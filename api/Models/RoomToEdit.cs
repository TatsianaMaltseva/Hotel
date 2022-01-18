using DataAnnotationsExtensions;
using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class RoomToEdit
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; }

        [Required]
        [Min(0)]
        public int Sleeps { get; set; }

        [Required]
        [Min(0)]
        public int Number { get; set; }

        [Required]
        [Min(0)]
        public decimal Price { get; set; }

        public int? MainImageId { get; set; }
    }
}
