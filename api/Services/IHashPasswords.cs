namespace iTechArt.Hotels.Api.Services
{
    public interface IHashPasswords
    {
        public byte[] GenerateSalt();

        public string HashPassword(string password, byte[] salt);

        public bool CheckIfPasswordIsCorrect(string hashedPassword, string supposedPassword, byte[] salt);
    }
}
