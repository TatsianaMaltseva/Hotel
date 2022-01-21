using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.JoinEntities;
using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using static iTechArt.Hotels.Api.Constants;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api")]
    [ApiController]
    public class OrdersController : Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;

        public OrdersController(HotelsDatabaseContext hotelDb)
        {
            _hotelsDb = hotelDb;
        }

        [Route("orders/calculate-price")]
        [HttpPost]
        [Authorize(Roles = Role.Client)]
        public async Task<decimal> CalculateOrderPrice([FromBody] OrderToAdd order)
        {
            RoomEntity room = await GetRoomEntityAsync(order.Room.Id);
            decimal pricePerDay = room.Price;
            foreach (Facility facility in order.Room.Facilities)
            {
                if (facility.Checked)
                {
                    pricePerDay += (await GetFacilityRoomEntity(room.Id, facility.Id)).Price;
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
            //check if there is at least one room that is not booked for this dates
            if (!await CheckIfRoomExists(order.Room.Id))
            {
                return BadRequest("Such room does not exist");
            }
            OrderEntity orderEntity = new()
            {
                RoomId = order.Room.Id,
                AccountId = Convert.ToInt32(User.Identity.Name),
                Price = await CalculateOrderPrice(order),
                CheckInDate = order.OrderDateParams.CheckInDate,
                CheckOutDate = order.OrderDateParams.CheckOutDate
            };

            foreach (Facility facility in order.Room.Facilities)
            {
                if (facility.Checked)
                {
                    FacilityOrderEntity facilityOrder = new()
                    {
                        FacilityId = facility.Id,
                        OrderId = orderEntity.Id,
                    };
                    orderEntity.FacilityOrders.Add(facilityOrder);
                }
            }

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
            RoomEntity roomEntity = await GetRoomEntityAsync(orderEntity.RoomId);
            HotelEntity hotelEntity = await GetHotelEntityAsync(roomEntity.HotelId);

            Order order = new ()
            {
                HotelName = hotelEntity.Name,
                Country = hotelEntity.Country,
                City = hotelEntity.City,
                Address = hotelEntity.Address,
                RoomName = roomEntity.Name,
                Sleeps = roomEntity.Sleeps,
                Price = orderEntity.Price,
                CheckInDate = orderEntity.CheckInDate,
                CheckOutDate = orderEntity.CheckOutDate
            };
            return Ok(order);
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

        private Task<OrderEntity> GetOrderEntity(int orderId) =>
            _hotelsDb.Orders
                .FirstOrDefaultAsync(order => order.Id == orderId);

        private Task<bool> CheckIfRoomExists(int roomId) =>
            _hotelsDb.Rooms.AnyAsync(room => room.Id == roomId);
    }
}
