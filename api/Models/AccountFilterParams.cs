using static iTechArt.Hotels.Api.Constants;

namespace iTechArt.Hotels.Api.Models
{
    public class AccountFilterParams
    {
        public string Email { get; set; }

        public Role? Role { get; set; }
    }
}
