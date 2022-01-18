using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class HotelToEdit
    {
        [Required]
        [MaxLength(HotelParams.NameMaxLength)]
        public string Name { get; set; }

        [Required]
        [MaxLength(HotelParams.CountryMaxLength)]
        public string Country { get; set; }

        [Required]
        [MaxLength(HotelParams.CityMaxLength)]
        public string City { get; set; }

        [Required]
        [MaxLength(HotelParams.AddressMaxLength)]
        public string Address { get; set; }

        [MaxLength(HotelParams.DescriptionMaxLength)]
        public string Description { get; set; }

        public int? MainImageId { get; set; }
    }
}
