using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class AccountPasswordToEdit
    {
        [Required]
        [MinLength(ValidationParams.Account.PasswordMinLength)]
        public string OldPassword { get; set; }

        [Required]
        [MinLength(ValidationParams.Account.PasswordMinLength)]
        public string NewPassword { get; set; }
    }
}
