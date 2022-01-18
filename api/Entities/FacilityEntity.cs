using iTechArt.Hotels.Api.JoinEntities;
using System.Collections.Generic;

namespace iTechArt.Hotels.Api.Entities
{
    public class FacilityEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Realm { get; set; }
        public List<FacilityHotelEntity> FacilityHotels { get; set; } = new List<FacilityHotelEntity>();
        public List<FacilityRoomEntity> FacilityRooms { get; set; } = new List<FacilityRoomEntity>();
    }
}
