namespace iTechArt.Hotels.Api
{
    public class FacilitiesHotelsRelation
    {
        public int FacilityId { get; set; }
        public int HotelId { get; set; }

        public virtual Facility Facility { get; set; }
        public virtual Hotel Hotel { get; set; }
    }
}
