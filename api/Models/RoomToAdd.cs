using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace iTechArt.Hotels.Api.Models
{
    public class RoomToAdd
    {
        [Required]
        [MaxLength(ValidationParams.Room.NameMaxLength)]
        public string Name { get; set; }

        [Required]
        public int Sleeps { get; set; }

        [Required]
        public int Number { get; set; }

        [Required]
        [Column(TypeName = "decimal(19,4)")]
        public decimal Price { get; set; }
    }
}
