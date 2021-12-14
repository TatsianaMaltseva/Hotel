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

            CreateMap<HotelEntity, AddHotel>()
                .ReverseMap();

            CreateMap<HotelEntity, EditHotel>()
                .ReverseMap()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<ImageEntity, Image>()
                .ReverseMap();
        }
    }
}