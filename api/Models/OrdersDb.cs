using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class OrdersDb
    {
        public Dictionary<int, int[]> Orders => new Dictionary<int, int[]>
        {
            { 1, new int[] { 1, 2 } },
            { 2, new int[] { 3 } },
            { 3, new int[] { 2, 1 } },
        };
    }
}
