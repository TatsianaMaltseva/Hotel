using DataAnnotationsExtensions;
using System;
using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class HotelFilterParameters
    {
        public DateTime? CheckInDate { get; set; }

        public DateTime? CheckOutDate { get; set; }

        [MaxLength(ValidationParams.Hotel.NameMaxLength)]
        public string Name { get; set; }

        [MaxLength(ValidationParams.Hotel.CountryMaxLength)]
        public string Country { get; set; }

        [MaxLength(ValidationParams.Hotel.CityMaxLength)]
        public string City { get; set; }

        [Min(0)]
        public int? Sleeps { get; set; }

        [Required]
        public bool ShowAvailableRoomsOnly { get; set; }
    }
}
