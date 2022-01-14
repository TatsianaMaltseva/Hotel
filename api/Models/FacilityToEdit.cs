using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class FacilityToEdit
    {
        [MaxLength(ValidationParams.Facility.NameMaxLenght)]
        public string Name { get; set; }
        public string Realm { get; set; }
    }
}
