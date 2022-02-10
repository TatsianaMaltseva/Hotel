using System.ComponentModel.DataAnnotations;

using static iTechArt.Hotels.Api.Constants;

namespace iTechArt.Hotels.Api.Models
{
    public class AccountToEdit
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string Password { get; set; }

        [Required]
        public Role Role { get; set; }
    }
}
