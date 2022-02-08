using System.Collections.Generic;
using static iTechArt.Hotels.Api.Constants;

namespace iTechArt.Hotels.Api.Entities
{
    public class FacilityEntity
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public Realm Realm { get; set; }

        public List<OrderEntity> Orders { get; }
    }
}
