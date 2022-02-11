using System.ComponentModel.DataAnnotations;
using static iTechArt.Hotels.Api.Constants;

namespace iTechArt.Hotels.Api.Models
{
    public class FacilityToEdit
    {
        [Required]
        [MaxLength(ValidationParams.Facility.NameMaxLenght)]
        public string Name { get; set; }

        [Required]
        public Realm Realm { get; set; }
    }
}
