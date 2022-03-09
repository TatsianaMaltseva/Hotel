using System;
using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class RoomFilterParams
    {
        public DateTime? CheckInDate { get; set; }

        public DateTime? CheckOutDate { get; set; }

        public int? Sleeps { get; set; }

        [Required]
        public bool ShowAvailableRoomsOnly { get; set; }
    }
}
