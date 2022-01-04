using DataAnnotationsExtensions;
using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class PageParams
    {
        [Required]
        [Min(0)]
        public int PageIndex { get; set; }

        [Required]
        [Range(1, 60)]
        public int PageSize { get; set; }
    }
}
