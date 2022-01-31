﻿using AutoMapper;
using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.Models;
using System;
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
                .ForMember(h => h.CheckInTime, y => y.MapFrom(he => he.CheckInTime.ToString()))
                .ForMember(h => h.CheckOutTime, y => y.MapFrom(he => he.CheckOutTime.ToString()))
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
                    f => f.Price,
                    m => m
                        .MapFrom(fe => fe.Realm == Constants.Realm.Hotel ?
                            fe.FacilityHotels
                                .Where(fr => fr.FacilityId == fe.Id)
                                .FirstOrDefault()
                                .Price :
                            fe.FacilityRooms
                                .Where(fr => fr.FacilityId == fe.Id)
                                .FirstOrDefault()
                                .Price))
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