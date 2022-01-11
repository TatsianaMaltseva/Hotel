using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class HotelToEdit
    {
        [MaxLength(HotelValidationParams.Name)]
        public string Name { get; set; }

        [MaxLength(HotelValidationParams.Country)]
        public string Country { get; set; }

        [MaxLength(HotelValidationParams.City)]
        public string City { get; set; }

        [MaxLength(HotelValidationParams.Address)]
        public string Address { get; set; }

        [MaxLength(HotelValidationParams.Description)]
        public string Description { get; set; }
    }
}
