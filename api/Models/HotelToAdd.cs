using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class HotelToAdd
    {
        [Required]
        [MaxLength(ValidationParams.Hotel.NameMaxLength)]
        public string Name { get; set; }

        [Required]
        [MaxLength(ValidationParams.Hotel.CountryMaxLength)]
        public string Country { get; set; }

        [Required]
        [MaxLength(ValidationParams.Hotel.CityMaxLength)]
        public string City { get; set; }

        [Required]
        [MaxLength(ValidationParams.Hotel.AddressMaxLength)]
        public string Address { get; set; }

        [MaxLength(ValidationParams.Hotel.DescriptionMaxLength)]
        public string Description { get; set; }
    }
}
