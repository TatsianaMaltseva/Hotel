using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class HotelsDb
    {
        public List<Hotel> Hotels => new List<Hotel> {
            new Hotel { Id = 1, Price = 10.5M, Title = "Hotel1" },
            new Hotel { Id = 2, Price = 20.7M, Title = "Hotel2" },
            new Hotel { Id = 2, Price = 15.05M, Title = "Hotel3" }
        };
    }
}
