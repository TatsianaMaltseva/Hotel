using System.Collections.Generic;

namespace iTechArt.Hotels.Api.Entities
{
    public class HotelEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public int? MainImageId { get; set; }
        public ICollection<ImageEntity> Images { get; set; }
        public ICollection<RoomEntity> Rooms { get; set; }
        public ICollection<FacilityEntity> Facilities { get; set; }
        public List<FacilityHotel> FacilityHotels { get; set; } = new List<FacilityHotel>();
    }
}