using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class HotelToEdit
    {
        [MaxLength(ValidationParams.Hotel.NameMaxLength)]
        public string Name { get; set; }

        [MaxLength(ValidationParams.Hotel.CountryMaxLength)]
        public string Country { get; set; }

        [MaxLength(ValidationParams.Hotel.CityMaxLength)]
        public string City { get; set; }

        [MaxLength(ValidationParams.Hotel.AddressMaxLength)]
        public string Address { get; set; }

        [MaxLength(ValidationParams.Hotel.DescriptionMaxLength)]
        public string Description { get; set; }

        public int? MainImageId { get; set; }
    }
}
