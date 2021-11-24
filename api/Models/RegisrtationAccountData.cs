using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class RegisrtationAccountData
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
