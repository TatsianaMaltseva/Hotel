using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class HotelFilterParameters
    {
        [MaxLength(HotelParams.NameMaxLength)]
        public string Name { get; set; }

        [MaxLength(HotelParams.CountryMaxLength)]
        public string Country { get; set; }

        [MaxLength(HotelParams.CityMaxLength)]
        public string City { get; set; }
    }
}
