namespace iTechArt.Hotels.Api.Entities
{
    public class FacilityHotel
    {
        public int Id { get; set; }
        public int HotelId { get; set; }
        public HotelEntity Hotel { get; set; }
        public int FacilityId { get; set; }
        public FacilityEntity Facility { get; set; }
    }
}
