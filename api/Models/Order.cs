﻿using System.Collections.Generic;

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
        public List<Facility> Facilities { get; set; }
        public string CheckInDate { get; set; }
        public string CheckOutDate { get; set; }
    }
}
