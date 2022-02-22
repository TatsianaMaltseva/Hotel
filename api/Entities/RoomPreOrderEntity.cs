using System;

namespace iTechArt.Hotels.Api.Entities
{
    public class RoomPreOrderEntity
    {
        public int Id { get; set; }

        public int RoomId { get; set; }

        public int AccountId { get; set; }

        public DateTime ExpireTime { get; set; }
    }
}
