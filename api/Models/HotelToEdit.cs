using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class HotelToEdit
    {
        [MaxLength(150)]
        public string Name { get; set; }

        [MaxLength(150)]
        public string Country { get; set; }

        [MaxLength(200)]
        public string City { get; set; }

        [MaxLength(250)]
        public string Address { get; set; }

        [MaxLength(3000)]
        public string Description { get; set; }
    }
}
