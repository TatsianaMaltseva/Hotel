using iTechArt.Hotels.Api.Entities;

namespace iTechArt.Hotels.Api.JoinEntities
{
    public class FacilityRoom
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public RoomEntity Room { get; set; }
        public int FacilityId { get; set; }
        public FacilityEntity Facility { get; set; }
    }
}
