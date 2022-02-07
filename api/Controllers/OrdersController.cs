using AutoMapper;
using AutoMapper.QueryableExtensions;
using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
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
        private readonly IOptions<ViewsOptions> _viewsOptions;

        public OrdersController(
            HotelsDatabaseContext hotelDb, 
            IMapper mapper,
            IOptions<ViewsOptions> viewsOptions
        )
        {
            _hotelsDb = hotelDb;
            _mapper = mapper;
            _viewsOptions = viewsOptions;
        }

        [Route("orders")]
        [HttpPost]
        [Authorize(Roles = Role.Client)]
        public async Task<IActionResult> AddOrder([FromBody] OrderToAdd order)
        {
            //check hotel if exists
            if (!await CheckIfRoomExistsAsync(order.RoomId))
            {
                return BadRequest("Such room does not exist");
            }

            List<FacilityEntity> facilities = await _hotelsDb.Facilities
                
                //.ProjectTo<FacilityEntity>(_mapper.ConfigurationProvider)
                .ToListAsync();

            OrderEntity orderEntity = new()
            {
                HotelId = order.HotelId,
                RoomId = order.RoomId,
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

        [Route("viewed-rooms/{roomId}")]
        [HttpPost]
        public async Task<IActionResult> AddRoomToViewed([FromRoute] int roomId)
        {
            if (!await CheckIfRoomExistsAsync(roomId))
            {
                return BadRequest("Such room does not exist");
            }
            ViewEntity view = new ViewEntity()
            {
                RoomId = roomId,
                ExpireTime = DateTime.Now.Add(_viewsOptions.Value.ExpireTime)
            };
            await _hotelsDb.Views.AddAsync(view);
            await _hotelsDb.SaveChangesAsync();
            return Ok();
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
        public async Task<IActionResult> GetOrders()
        {
            List<Order> orders = await _hotelsDb.Orders
                .Where(order => order.AccountId == Convert.ToInt32(User.Identity.Name))
                .Include(order => order.Hotel)
                .Include(order => order.Room)
                .Include(order => order.Facilities)
                .ProjectTo<Order>(_mapper.ConfigurationProvider)
                .ToListAsync();
            return Ok(orders);
        }

        private async Task<decimal> CalculateOrderPrice(OrderToAdd order)
        {
            RoomEntity room = await _hotelsDb.Rooms
                .Where(room => room.Id == order.RoomId)
                .Include(room => room.FacilityRooms)
                .FirstOrDefaultAsync();
            HotelEntity hotel = await _hotelsDb.Hotels
                .Where(hotel => hotel.Id == order.HotelId)
                .Include(hotel => hotel.FacilityHotels)
                .FirstOrDefaultAsync();

            decimal pricePerDay = room.Price;
            foreach (Facility facility in order.Facilities)
            {
                if (facility.Checked)
                {
                    pricePerDay += room.FacilityRooms
                        .Where(facilityRoom => facilityRoom.FacilityId == facility.Id)
                        .FirstOrDefault()
                        .Price;
                }
            }
            int days = (order.CheckOutDate - order.CheckInDate).Days + 1;
            return days * pricePerDay;
        }

        private Task<bool> CheckIfRoomExistsAsync(int roomId) =>
            _hotelsDb.Rooms.AnyAsync(room => room.Id == roomId);
    }
}
