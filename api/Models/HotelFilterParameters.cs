using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class HotelFilterParameters
    {
        [MaxLength(HotelParamsMaxLength.Name)]
        public string Name { get; set; }

        [MaxLength(HotelParamsMaxLength.Country)]
        public string Country { get; set; }

        [MaxLength(HotelParamsMaxLength.City)]
        public string City { get; set; }
    }
}
