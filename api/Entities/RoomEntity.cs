using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace iTechArt.Hotels.Api.Entities
{
    public class RoomEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Sleeps { get; set; }
        public int Number { get; set; }
        [Column(TypeName = "decimal(19,4)")]
        public decimal Price { get; set; }
        [ForeignKey("Hotel")]
        public int HotelId { get; set; }
        public HotelEntity Hotel { get; set; }
        public int? MainImageId { get; set; }
        [ForeignKey("RoomId")]
        public ICollection<ImageEntity> Images { get; set; }
    }
}
