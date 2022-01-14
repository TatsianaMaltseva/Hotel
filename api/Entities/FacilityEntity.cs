using System.Collections.Generic;

namespace iTechArt.Hotels.Api.Entities
{
    public class FacilityEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Realm { get; set; }
        public ICollection<HotelEntity> Hotels { get; set; } = new List<HotelEntity>();
        public List<FacilityHotel> FacilityHotels { get; set; } = new List<FacilityHotel>();
    }
}
