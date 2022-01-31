using System;

namespace iTechArt.Hotels.Api.Models
{
    public class RoomFilterParams
    {
        public DateTime? CheckInDate { get; set; }

        public DateTime? CheckOutDate { get; set; }
    }
}
