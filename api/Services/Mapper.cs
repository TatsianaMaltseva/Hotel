using AutoMapper;
using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.Models;

namespace iTechArt.Hotels.Api.Services
{
    public class Mapper : Profile
    {
        public Mapper()
        {
            CreateMap<HotelEntity, HotelCard>()
                .ReverseMap();

            CreateMap<HotelEntity, Hotel>()
                .ReverseMap();

            CreateMap<HotelEntity, HotelToAdd>()
                .ReverseMap();

            CreateMap<HotelEntity, HotelToEdit>()
                .ReverseMap()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember is not null));

            CreateMap<ImageEntity, Image>()
                .ReverseMap();

            CreateMap<AccountEntity, Account>()
                .ReverseMap();

            CreateMap<RoomEntity, Room>()
                .ReverseMap();

            CreateMap<RoomEntity, RoomToEdit>()
                .ReverseMap()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember is not null and not 0 and not 0M));

            CreateMap<RoomEntity, RoomToAdd>()
                .ReverseMap();
        }
    }
}