using iTechArt.Hotels.Api.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace iTechArt.Hotels.Api.JoinEntities
{
    public class FacilityHotelEntity
    {
        public int Id { get; set; }

        [ForeignKey("Hotel")]
        public int HotelId { get; set; }

        public HotelEntity Hotel { get; set; }

        [ForeignKey("Facility")]
        public int FacilityId { get; set; }

        public FacilityEntity Facility { get; set; }

        [Column(TypeName = "decimal(19,4)")]
        public decimal Price { get; set; }
    }
}
