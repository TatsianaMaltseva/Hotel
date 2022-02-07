using AutoMapper;
using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.Models;
using System.Linq;

namespace iTechArt.Hotels.Api.Services
{
    public class Mapper : Profile
    {
        private readonly string dateFormat = "dd MMMM yyyy";

        public Mapper()
        {
            CreateMap<HotelEntity, HotelCard>()
                .ReverseMap();

            CreateMap<HotelEntity, Hotel>()
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
    }
}