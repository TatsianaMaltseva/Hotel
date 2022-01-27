using AutoMapper;
using AutoMapper.QueryableExtensions;
using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.JoinEntities;
using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static iTechArt.Hotels.Api.Constants;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api")]
    [ApiController]
    public class OrdersController : Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;
        private readonly IMapper _mapper;
        private readonly string dateFormat = "dd MMMM yyyy";

        public OrdersController(HotelsDatabaseContext hotelDb, IMapper mapper)
        {
            _hotelsDb = hotelDb;
            _mapper = mapper;
        }

        [Route("orders/calculate-price")]
        [HttpPost]
        [Authorize(Roles = Role.Client)]
        public async Task<decimal> CalculateOrderPrice([FromBody] OrderToAdd order)
        {
            RoomEntity room = await _hotelsDb.Rooms.Where(room => room.Id == order.Room.Id)
                .Include(room => room.FacilityRooms)
                .FirstOrDefaultAsync();
            decimal pricePerDay = room.Price;
            foreach (Facility facility in order.Room.Facilities)
            {
                if (facility.Checked)
                {
                    pricePerDay += room.FacilityRooms.Where(facilityRoom => facilityRoom.FacilityId == facility.Id).FirstOrDefault().Price;
                }
            }
            int days = (order.OrderDateParams.CheckOutDate - order.OrderDateParams.CheckInDate).Days;
            return days * pricePerDay;
        }

        [Route("orders")]
        [HttpPost]
        [Authorize(Roles = Role.Client)]
        public async Task<IActionResult> AddOrder([FromBody] OrderToAdd order)
        {
            if (!await CheckIfRoomExists(order.Room.Id))
            {
                return BadRequest("Such room does not exist");
            }

            var facilities = new List<FacilityEntity>();
            foreach(Facility facility in order.Room.Facilities)
            {
                if (facility.Checked == true)
                {
                    facilities.Add(await _hotelsDb.Facilities.FirstOrDefaultAsync(facilityEntity => facilityEntity.Id == facility.Id));
                }
            }
            

            OrderEntity orderEntity = new()
            {
                RoomId = order.Room.Id,
                AccountId = Convert.ToInt32(User.Identity.Name),
                Price = await CalculateOrderPrice(order),
                CheckInDate = order.OrderDateParams.CheckInDate,
                CheckOutDate = order.OrderDateParams.CheckOutDate,
                Facilities = facilities
            };

            //foreach (Facility facility in order.Room.Facilities)
            //{
            //    if (facility.Checked)
            //    {
            //        FacilityOrderEntity facilityOrder = new()
            //        {
            //            FacilityId = facility.Id,
            //            OrderId = orderEntity.Id,
            //        };
            //        orderEntity.FacilityOrders.Add(facilityOrder);
            //    }
            //}

            await _hotelsDb.AddAsync(orderEntity);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtAction(nameof(GetOrder), new { orderId = orderEntity.Id }, null);
        }

        [Route("orders/{orderId}")]
        [HttpGet]
        [Authorize(Roles = Role.Client)]
        public async Task<IActionResult> GetOrder([FromRoute] int orderId)
        {
            OrderEntity orderEntity = await GetOrderEntity(orderId);
            if (orderEntity == null)
            {
                return BadRequest("Such order does not exist");
            }
            if (Convert.ToInt32(User.Identity.Name) != orderEntity.Id)
            {
                return BadRequest("Wrong credentials");
            }
            RoomEntity roomEntity = await GetRoomEntityAsync(orderEntity.RoomId);
            HotelEntity hotelEntity = await GetHotelEntityAsync(roomEntity.HotelId);

            //FacilityOrderEntity[] facilityOrderEntities = await GetFacilityOrderEntities(orderId);

            List<Facility> facilities = new();

            //foreach (FacilityOrderEntity facilityOrder in facilityOrderEntities)
            //{
            //    facilities.Add(await GetFacility(facilityOrder.FacilityId));
            //}

            Order order = new()
            {
                HotelName = hotelEntity.Name,
                Country = hotelEntity.Country,
                City = hotelEntity.City,
                Address = hotelEntity.Address,
                RoomName = roomEntity.Name,
                Sleeps = roomEntity.Sleeps,
                Price = orderEntity.Price,
                CheckInDate = orderEntity.CheckInDate.ToString(dateFormat),
                CheckOutDate = orderEntity.CheckOutDate.ToString(dateFormat),
                Facilities = facilities
            };
            return Ok(order);
        }

        [Route("orders")]
        [HttpGet]
        [Authorize(Roles = Role.Client)]
        public async Task<IActionResult> GetOrders()
        {
            List<OrderEntity> orderEntities = await _hotelsDb.Orders
                .Where(order => order.AccountId == Convert.ToInt32(User.Identity.Name))
                .ToListAsync();

            List<Order> ordersToReturn = new List<Order>();
            foreach (OrderEntity orderEntity in orderEntities)
            {
                RoomEntity roomEntity = await GetRoomEntityAsync(orderEntity.RoomId);
                HotelEntity hotelEntity = await GetHotelEntityAsync(roomEntity.HotelId);
                //FacilityOrderEntity[] facilityOrderEntities = await GetFacilityOrderEntities(orderEntity.Id);

                List<Facility> facilities = new();

                //foreach (FacilityOrderEntity facilityOrder in facilityOrderEntities)
                //{
                //    facilities.Add(await GetFacility(facilityOrder.FacilityId));
                //}

                Order order = new()
                {
                    HotelName = hotelEntity.Name,
                    Country = hotelEntity.Country,
                    City = hotelEntity.City,
                    Address = hotelEntity.Address,
                    RoomName = roomEntity.Name,
                    Sleeps = roomEntity.Sleeps,
                    Price = orderEntity.Price,
                    CheckInDate = orderEntity.CheckInDate.ToString(dateFormat),
                    CheckOutDate = orderEntity.CheckOutDate.ToString(dateFormat),
                    Facilities = facilities
                };

                ordersToReturn.Add(order);
            }
            return Ok(ordersToReturn);
        }

        private Task<RoomEntity> GetRoomEntityAsync(int roomId) =>
            _hotelsDb.Rooms
               .FirstOrDefaultAsync(room => room.Id == roomId);

        private Task<FacilityRoomEntity> GetFacilityRoomEntity(int roomId, int facilityId) =>
            _hotelsDb.FacilityRoom
                .FirstOrDefaultAsync(fh => fh.RoomId == roomId && fh.FacilityId == facilityId);

        private Task<HotelEntity> GetHotelEntityAsync(int hotelId) =>
            _hotelsDb.Hotels
                .FirstOrDefaultAsync(hotel => hotel.Id == hotelId);

        //private Task<FacilityOrderEntity[]> GetFacilityOrderEntities(int orderId) =>
        //    _hotelsDb.FacilityOrder
        //        .Where(fo => fo.OrderId == orderId)
        //        .ToArrayAsync();

        private Task<Facility> GetFacility(int facilityId) =>
            _hotelsDb.Facilities
                .Where(f => f.Id == facilityId)
                .ProjectTo<Facility>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

        private Task<OrderEntity> GetOrderEntity(int orderId) =>
            _hotelsDb.Orders
                .FirstOrDefaultAsync(order => order.Id == orderId);

        private Task<bool> CheckIfRoomExists(int roomId) =>
            _hotelsDb.Rooms.AnyAsync(room => room.Id == roomId);
    }
}
