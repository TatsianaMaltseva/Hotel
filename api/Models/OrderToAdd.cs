using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class OrderToAdd
    {
        [Required]
        public int RoomId { get; set; }

        [Required]
        public int HotelId { get; set; }

        [Required]
        public DateTime CheckInDate { get; set; }

        [Required]
        public DateTime CheckOutDate { get; set; }

        public List<int> FacilityIds { get; set; }
    }
}
