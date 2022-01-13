namespace iTechArt.Hotels.Api
{
    public static class ValidationParams
    {
        public static class Hotel
        {
            public const int NameMaxLength = 150;
            public const int CountryMaxLength = 150;
            public const int CityMaxLength = 200;
            public const int AddressMaxLength = 250;
            public const int DescriptionMaxLength = 3000;
        }

        public static class Room
        {
            public const int NameMaxLength = 150;
        }

        public static class Facility
        {
            public const int NameMaxLenght = 60;
        }
    }
}
