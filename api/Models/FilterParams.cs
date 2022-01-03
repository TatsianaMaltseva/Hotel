using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class FilterParams
    {
        [MaxLength(60)]
        public string Name { get; set; }

        [MaxLength(56)]
        public string Country { get; set; }

        [MaxLength(85)]
        public string City { get; set; }
    }
}
