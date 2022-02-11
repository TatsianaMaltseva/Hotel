using System.Collections.Generic;

namespace iTechArt.Hotels.Api.Models
{
    public class Room
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Sleeps { get; set; }
        public int Number { get; set; }
        public decimal Price { get; set; }
        public int? MainImageId { get; set; }
        public List<Facility> Facilities { get; set; } = new List<Facility>();
    }
}
