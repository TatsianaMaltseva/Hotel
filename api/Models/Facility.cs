namespace iTechArt.Hotels.Api.Models
{
    public class Facility
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Realm { get; set; }
        public bool Checked { get; set; } = false;
        public decimal Price { get; set; } = 0;
    }
}
