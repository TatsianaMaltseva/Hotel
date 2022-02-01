using AutoMapper;
using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.Models;
using System.Linq;
using static iTechArt.Hotels.Api.Constants;

namespace iTechArt.Hotels.Api.Services
{
    public class Mapper : Profile
    {
        private readonly string dateFormat = "dd MMMM yyyy";
        private readonly string timeFormat = @"hh\:mm";
       
        public Mapper()
        {
            CreateMap<HotelEntity, HotelCard>()
                .ReverseMap();

            CreateMap<HotelEntity, Hotel>()
                .ForMember(h => h.CheckInTime, y => y.MapFrom(he => he.CheckInTime.ToString(timeFormat)))
                .ForMember(h => h.CheckOutTime, y => y.MapFrom(he => he.CheckOutTime.ToString(timeFormat)))
                .ReverseMap();
            CreateMap<HotelEntity, HotelToAdd>()
                .ReverseMap();

            CreateMap<HotelEntity, HotelToEdit>()
                .ReverseMap();

            CreateMap<ImageEntity, Image>()
                .ReverseMap();

            CreateMap<AccountEntity, Account>()
                .ReverseMap();

            CreateMap<RoomEntity, Room>()
                .ReverseMap();

            CreateMap<RoomEntity, RoomToEdit>()
                .ReverseMap();

            CreateMap<RoomEntity, RoomToAdd>()
                .ReverseMap();

            CreateMap<FacilityEntity, Facility>()
                .ForMember(
                    f => f.Price, m => m.MapFrom(fe => SetFacilityPrice(fe)))
                .ReverseMap();

            CreateMap<FacilityEntity, FacilityToEdit>()
                .ReverseMap();

            CreateMap<FacilityEntity, FacilityToAdd>()
                .ReverseMap();

            CreateMap<OrderEntity, Order>()
                .ForMember(o => o.CheckInDate, m => m.MapFrom(oe => oe.CheckInDate.ToString(dateFormat)))
                .ForMember(o => o.CheckOutDate, m => m.MapFrom(oe => oe.CheckOutDate.ToString(dateFormat)))
                .ReverseMap();
        }
        public static decimal SetFacilityPrice(FacilityEntity facility)
        {
            if (facility.FacilityHotels == null && facility.FacilityRooms == null)
            {
                return 0;
            }

            if (facility.Realm == Realm.Hotel)
            {
                return facility.FacilityHotels
                    .Where(fr => fr.FacilityId == facility.Id)
                    .FirstOrDefault()
                    .Price;
            }
            else if (facility.Realm == Realm.Room)
            {
                return facility.FacilityRooms
                    .Where(fr => fr.FacilityId == facility.Id)
                    .FirstOrDefault()
                    .Price;
            }

            return 0;
        }
    }
}