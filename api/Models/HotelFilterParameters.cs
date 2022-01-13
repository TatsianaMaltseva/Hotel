using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class HotelFilterParameters
    {
        [MaxLength(ValidationParams.Hotel.NameMaxLength)]
        public string Name { get; set; }

        [MaxLength(ValidationParams.Hotel.CountryMaxLength)]
        public string Country { get; set; }

        [MaxLength(ValidationParams.Hotel.CityMaxLength)]
        public string City { get; set; }
    }
}
