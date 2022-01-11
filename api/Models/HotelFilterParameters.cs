using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class HotelFilterParameters
    {
        [MaxLength(150)]
        public string Name { get; set; }

        [MaxLength(150)]
        public string Country { get; set; }

        [MaxLength(200)]
        public string City { get; set; }
    }
}
