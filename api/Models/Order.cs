using System.Collections.Generic;

namespace iTechArt.Hotels.Api.Models
{
    public class Order
    {
        public Hotel Hotel { get; set; }
        public Room Room { get; set; }
        public decimal Price { get; set; }
        public List<Facility> Facilities { get; set; }
        public string CheckInDate { get; set; }
        public string CheckOutDate { get; set; }
    }
}
