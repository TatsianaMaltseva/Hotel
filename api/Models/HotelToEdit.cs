using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace iTechArt.Hotels.Api.Models
{
    public class HotelToEdit
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

        [Required]
        [JsonConverter(typeof(JsonTimeSpanConverter))]
        public TimeSpan CheckInTime { get; set; }

        [Required]
        [JsonConverter(typeof(JsonTimeSpanConverter))]
        public TimeSpan CheckOutTime { get; set; }

        public int? MainImageId { get; set; }
    }
}
