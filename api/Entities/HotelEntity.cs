using iTechArt.Hotels.Api.JoinEntities;
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

        public List<RoomEntity> Rooms { get; } = new List<RoomEntity>();

        public List<FacilityHotelEntity> FacilityHotels { get; }
    }
}