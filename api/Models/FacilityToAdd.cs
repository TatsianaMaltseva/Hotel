using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class FacilityToAdd
    {
        [Required]
        [MaxLength(ValidationParams.Facility.NameMaxLenght)]
        public string Name { get; set; }

        [Required]
        [MaxLength(ValidationParams.Facility.RealmMaxLength)]
        public string Realm { get; set; }
    }
}
