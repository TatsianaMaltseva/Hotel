using iTechArt.Hotels.Api.Entities;

namespace iTechArt.Hotels.Api.JoinEntities
{
    public class FacilityOrderEntity
    {
        public int Id { get; set; }
        public int FacilityId { get; set; }
        public FacilityEntity Facility { get; set; }
        public int OrderId { get; set; }
        public OrderEntity Order { get; set; }
    }
}
