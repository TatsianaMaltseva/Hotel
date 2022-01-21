using System;

namespace iTechArt.Hotels.Api.Models
{
    public class Order
    {
        public string HotelName { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string RoomName { get; set; }
        public int Sleeps { get; set; }
        public decimal Price { get; set; }
        public Facility[] Facilities { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
    }
}
