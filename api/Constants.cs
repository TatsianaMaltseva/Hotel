namespace iTechArt.Hotels.Api
{
    public static class Constants
    {
        public static class Role
        {
            public const string Admin = "admin";
            public const string Client = "client";
        }

        public enum Realm
        {
            Hotel,
            Room
        }
    }
}