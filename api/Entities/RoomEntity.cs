using System.Collections.Generic;

namespace iTechArt.Hotels.Api.Entities
{
    public class RoomEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Sleeps { get; set; }
        public int Number { get; set; }
        public decimal Price { get; set; }
        public int HotelId { get; set; }
        public HotelEntity Hotel { get; set; }
        public int? MainImageId { get; set; }
        public ICollection<ImageEntity> Images { get; set; }
    }
}
