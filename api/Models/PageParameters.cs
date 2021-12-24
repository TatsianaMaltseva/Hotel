using DataAnnotationsExtensions;
using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class PageParameters
    {
        [Required]
        [Min(0)]
        public int PageIndex { get; set; }

        [Required]
        [Min(1)]
        public int PageSize { get; set; }
    }
}
