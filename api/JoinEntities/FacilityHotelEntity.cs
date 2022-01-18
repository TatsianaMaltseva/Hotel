using iTechArt.Hotels.Api.Entities;

namespace iTechArt.Hotels.Api.JoinEntities
{
    public class FacilityHotelEntity
    {
        public int Id { get; set; }
        public int HotelId { get; set; }
        public HotelEntity Hotel { get; set; }
        public int FacilityId { get; set; }
        public FacilityEntity Facility { get; set; }
    }
}
