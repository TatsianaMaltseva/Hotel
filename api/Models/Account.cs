using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class Account
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
