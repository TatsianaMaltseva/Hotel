namespace iTechArt.Hotels.Api.Models
{
    public class Facility
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Checked { get; set; } = false;
        public string Realm { get; set; }
        public decimal Price { get; set; } = 0;
    }
}
