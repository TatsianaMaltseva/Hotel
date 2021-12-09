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

            CreateMap<AddHotelRepresentation, HotelEntity>();
            CreateMap<HotelEntity, AddHotelRepresentation>();

            CreateMap<HotelRepresentation, HotelEntity>();
            CreateMap<HotelEntity, HotelRepresentation>();
        }
    }
}
