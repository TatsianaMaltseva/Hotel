using System.Collections.Generic;

namespace iTechArt.Hotels.Api.Models
{
    public class Hotel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public int? MainImageId { get; set; }
        public List<Facility> Facilities { get; set; }
    }
}