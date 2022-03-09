using static iTechArt.Hotels.Api.Constants;

namespace iTechArt.Hotels.Api.Models
{
    public class OrderFilterParams
    {
        public OrderDate Date { get; set; }
        
        public string Country { get; set; }

        public string City { get; set; }
    }
}
