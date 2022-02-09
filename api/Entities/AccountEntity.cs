using static iTechArt.Hotels.Api.Constants;

namespace iTechArt.Hotels.Api.Entities
{
    public class AccountEntity
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Salt { get; set; }
        public Role Role { get; set; }
    }
}
