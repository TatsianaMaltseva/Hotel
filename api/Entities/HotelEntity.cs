using iTechArt.Hotels.Api.JoinEntities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace iTechArt.Hotels.Api.Entities
{
    public class HotelEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string Country { get; set; }

        public string City { get; set; }

        public string Address { get; set; }

        public string Description { get; set; }

        public int? MainImageId { get; set; }

        public List<RoomEntity> Rooms { get; }

        public List<FacilityEntity> Facilities { get; }

        public List<FacilityHotelEntity> FacilityHotels { get; }

        [Column(TypeName = "time")]
        public TimeSpan CheckInTime { get; set; }

        [Column(TypeName = "time")]
        public TimeSpan CheckOutTime { get; set; }
    }
}