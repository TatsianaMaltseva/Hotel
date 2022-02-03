using AutoMapper;
using AutoMapper.QueryableExtensions;
using iTechArt.Hotels.Api.Entities;
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

        public OrdersController(HotelsDatabaseContext hotelDb, IMapper mapper)
        {
            _hotelsDb = hotelDb;
            _mapper = mapper;
        }

        [Route("viewed-rooms/{roomId}")]
        [HttpPost]
        public async Task<IActionResult> AddRoomToViewed([FromRoute] int roomId)
        {
            return Ok();
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

            foreach(Facility facility in order.Hotel.Facilities)
            {
                if (facility.Checked == true)
                {
                    facilities.Add(await _hotelsDb.Facilities.FirstOrDefaultAsync(facilityEntity => facilityEntity.Id == facility.Id));
                }
            }
            
            OrderEntity orderEntity = new()
            {
                HotelId = order.Hotel.Id,
                RoomId = order.Room.Id,
                AccountId = Convert.ToInt32(User.Identity.Name),
                Price = await CalculateOrderPrice(order),
                CheckInDate = order.CheckInDate,
                CheckOutDate = order.CheckOutDate,
                Facilities = facilities
            };

            await _hotelsDb.AddAsync(orderEntity);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtAction(nameof(GetOrder), new { orderId = orderEntity.Id }, null);
        }

        [Route("orders/{orderId}")]
        [HttpGet]
        [Authorize(Roles = Role.Client)]
        public async Task<IActionResult> GetOrder([FromRoute] int orderId)
        {
            Order order = await _hotelsDb.Orders
                .Where(order => order.Id == orderId)
                .Include(order => order.Hotel)
                .Include(order => order.Room)
                .Include(order => order.Facilities)
                .ProjectTo<Order>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
            return Ok(order);
        }

        [Route("orders")]
        [HttpGet]
        [Authorize(Roles = Role.Client)]
        public async Task<IActionResult> GetOrders([FromQuery] OrderFilterParams filterParams)
        {
            var orders = _hotelsDb.Orders
                .AsQueryable();

            if (filterParams.Date == OrderDate.Future)
            {
                orders = orders.Where(order => order.CheckOutDate >= DateTime.Today);
            }
            else if (filterParams.Date == OrderDate.Past)
            {
                orders = orders.Where(order => order.CheckOutDate < DateTime.Today);
            }

            List<Order> ordersToReturn = await orders
                .Where(order => order.AccountId == Convert.ToInt32(User.Identity.Name))
                .Include(order => order.Hotel)
                .Include(order => order.Room)
                .Include(order => order.Facilities)
                .OrderBy(order => order.CheckInDate)
                .ProjectTo<Order>(_mapper.ConfigurationProvider)
                .ToListAsync();
            return Ok(ordersToReturn);
        }

        private async Task<decimal> CalculateOrderPrice(OrderToAdd order)
        {
            RoomEntity room = await _hotelsDb.Rooms
                .Where(room => room.Id == order.Room.Id)
                .Include(room => room.FacilityRooms)
                .FirstOrDefaultAsync();
            HotelEntity hotel = await _hotelsDb.Hotels
                .Where(hotel => hotel.Id == order.Hotel.Id)
                .Include(hotel => hotel.FacilityHotels)
                .FirstOrDefaultAsync();

            decimal pricePerDay = room.Price;
            foreach (Facility facility in order.Room.Facilities)
            {
                if (facility.Checked)
                {
                    pricePerDay += room.FacilityRooms
                        .Where(facilityRoom => facilityRoom.FacilityId == facility.Id)
                        .FirstOrDefault()
                        .Price;
                }
            }
           foreach (Facility facility in order.Hotel.Facilities)
            {
                if (facility.Checked)
                {
                    pricePerDay += hotel.FacilityHotels
                        .Where(facilityHotel => facilityHotel.FacilityId == facility.Id)
                        .FirstOrDefault()
                        .Price;
                }
            }
            int days = (order.CheckOutDate - order.CheckInDate).Days + 1;
            return days * pricePerDay;
        }

        private Task<bool> CheckIfRoomExists(int roomId) =>
            _hotelsDb.Rooms.AnyAsync(room => room.Id == roomId);
    }
}
