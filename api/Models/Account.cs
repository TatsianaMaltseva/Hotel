namespace iTechArt.Hotels.Api
{
    public class Account
    {
        public int Id { get; set; }
        public virtual string Email { get; set; }
        public virtual string Password { get; set; }
    }
}
