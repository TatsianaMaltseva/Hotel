using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class HotelToEdit
    {
        [MaxLength(60)]
        public string Name { get; set; }

        [MaxLength(56)]
        public string Country { get; set; }

        [MaxLength(85)]
        public string City { get; set; }

        [MaxLength(155)]
        public string Address { get; set; }

        [MaxLength(3000)]
        public string Description { get; set; }
    }
}
