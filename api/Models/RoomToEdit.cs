using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace iTechArt.Hotels.Api.Models
{
    public class RoomToEdit
    {
        [MaxLength(150)]
        public string Name { get; set; }
        public int? Sleeps { get; set; }
        public int? Number { get; set; }
        [Column(TypeName = "decimal(19,4)")]
        public decimal? Price { get; set; }
        public int? MainImageId { get; set; }
    }
}
