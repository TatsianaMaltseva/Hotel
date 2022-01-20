using DataAnnotationsExtensions;
using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class OrderToAdd
    {
        [Required]
        public Room Room { get; set; }
    }
}
