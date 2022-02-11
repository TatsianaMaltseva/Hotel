using iTechArt.Hotels.Api.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace iTechArt.Hotels.Api.JoinEntities
{
    public class FacilityRoomEntity
    {
        public int Id { get; set; }

        [ForeignKey(nameof(Room))]
        public int RoomId { get; set; }

        public RoomEntity Room { get; set; }

        [ForeignKey(nameof(Facility))]
        public int FacilityId { get; set; }

        public FacilityEntity Facility { get; set; }

        [Column(TypeName = "decimal(19,4)")]
        public decimal Price { get; set; }
    }
}
