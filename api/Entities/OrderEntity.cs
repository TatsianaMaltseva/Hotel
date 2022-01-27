using iTechArt.Hotels.Api.JoinEntities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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

        public DateTime CheckInDate { get; set; }

        public DateTime CheckOutDate { get; set; }

        public List<FacilityEntity> Facilities { get; set; } = new List<FacilityEntity>();

        //public List<FacilityOrderEntity> FacilityOrders { get; }
    }
}
