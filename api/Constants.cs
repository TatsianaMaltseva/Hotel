using System.Text.Json.Serialization;

namespace iTechArt.Hotels.Api
{
    public static class Constants
    {
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public enum Role
        {
            Admin,
            Client
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