﻿using AutoMapper;
using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.Models;

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

            CreateMap<AccountEntity, AccountToAdd>()
                .ReverseMap();

            CreateMap<AccountEntity, AccountToEdit>()
                .ForMember(a => a.Password, m => m.Ignore())
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