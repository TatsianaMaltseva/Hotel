using System.Text.Json.Serialization;

namespace iTechArt.Hotels.Api
{
    public static class Constants
    {
        public static class Role
        {
            public const string Admin = "admin";
            public const string Client = "client";
        }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public enum Realm
        {
            Hotel,
            Room
        }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public enum OrderDate
        {
            Past,
            Future
        }
    }
}