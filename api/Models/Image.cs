namespace iTechArt.Hotels.Api
{
    public class Image
    {
        public int Id { get; set; }
        public string Path { get; set; }
        public int HotelId { get; set; }

        public Hotel Hotel { get; set; }
    }
}