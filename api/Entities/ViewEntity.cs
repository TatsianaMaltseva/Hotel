using System;

namespace iTechArt.Hotels.Api.Entities
{
    public class ViewEntity
    {
        public int Id { get; set; }

        public int RoomId { get; set; }

        public DateTime ExpireTime { get; set; }
    }
}
