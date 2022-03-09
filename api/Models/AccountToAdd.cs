using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class AccountToAdd
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(ValidationParams.Account.PasswordMinLength)]
        public string Password { get; set; }
    }
}
