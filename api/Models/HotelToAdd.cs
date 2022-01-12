using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class HotelToAdd
    {
        [MaxLength(HotelParamsMaxLength.Name)]
        public string Name { get; set; }

        [MaxLength(HotelParamsMaxLength.Country)]
        public string Country { get; set; }

        [MaxLength(HotelParamsMaxLength.City)]
        public string City { get; set; }

        [MaxLength(HotelParamsMaxLength.Address)]
        public string Address { get; set; }

        [MaxLength(HotelParamsMaxLength.Description)]
        public string Description { get; set; }
    }
}
