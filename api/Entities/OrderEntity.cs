using iTechArt.Hotels.Api.JoinEntities;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace iTechArt.Hotels.Api.Entities
{
    public class OrderEntity
    {
        public int Id { get; set; }
        public int RoomId { get; set; }

        public int AccountId { get; set; }

        [Column(TypeName = "decimal(19,4)")]
        public decimal Price { get; set; }

        public List<FacilityOrderEntity> FacilityOrders { get; set; } = new List<FacilityOrderEntity>();
    }
}
