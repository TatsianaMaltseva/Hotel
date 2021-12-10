using AutoMapper;
using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.Models;

namespace iTechArt.Hotels.Api.Services
{
    public class Mapper : Profile
    {
        public Mapper()
        {
            CreateMap<HotelCard, HotelEntity>();
            CreateMap<HotelEntity, HotelCard>();

            CreateMap<HotelRepresentation, HotelEntity>();
            CreateMap<HotelEntity, HotelRepresentation>();

            CreateMap<AddHotelRepresentation, HotelEntity>();
            CreateMap<HotelEntity, AddHotelRepresentation>();

            CreateMap<EditHotelRepresentation, HotelEntity>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<HotelEntity, EditHotelRepresentation>();
        }
    }
}
