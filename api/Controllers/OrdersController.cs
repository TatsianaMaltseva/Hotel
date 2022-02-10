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

        [Route("accounts/{accountId}/orders")]
        [HttpPost]
        [Authorize(Roles = nameof(Role.Client))]
        public async Task<IActionResult> AddOrder([FromRoute] int accountId, [FromBody] OrderToAdd order)
        {

            if (!await CheckIfHotelExistsAsync(order.HotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            if (!await CheckIfRoomExistsAsync(order.RoomId))
            {
                return BadRequest("Such room does not exist");
            }

            OrderEntity orderEntity = new()
            {
                HotelId = order.HotelId,
                RoomId = order.RoomId,
                AccountId = accountId,
                Price = ((order.CheckOutDate - order.CheckInDate).Days + 1)
                    * await GetPricePerDay(order.HotelId, order.RoomId, order.FacilityIds),
                CheckInDate = order.CheckInDate,
                CheckOutDate = order.CheckOutDate,
                Facilities = await _hotelsDb.Facilities
                    .Where(facility => order.FacilityIds
                        .Contains(facility.Id))
                    .ToListAsync()
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
        [Authorize(Roles = nameof(Role.Client))]
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

        [Route("accounts/{accountId}/orders")]
        [HttpGet]
        [Authorize(Roles = nameof(Role.Client))]
        public async Task<IActionResult> GetOrders([FromRoute] int accountId, [FromQuery] OrderFilterParams filterParams)
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
                .Where(order => order.AccountId == accountId)
                .Include(order => order.Hotel)
                .Include(order => order.Room)
                .Include(order => order.Facilities)
                .OrderBy(order => order.CheckInDate)
                .ProjectTo<Order>(_mapper.ConfigurationProvider)
                .ToListAsync();
            return Ok(ordersToReturn);
        }

        private async Task<decimal> GetPricePerDay(int hotelId, int roomId, List<int> orderesFacilities)
        {
            HotelEntity hotel = await _hotelsDb.Hotels
                .Where(hotel => hotel.Id == hotelId)
                .Include(hotel => hotel.FacilityHotels)
                .Include(hotel => hotel.Rooms
                    .Where(room => room.Id == roomId))
                .ThenInclude(room => room.FacilityRooms)
                .FirstOrDefaultAsync();

            RoomEntity room = hotel.Rooms
                .FirstOrDefault();

            decimal pricePerDay = room.Price;

            decimal hotelFacilityPrice = hotel.FacilityHotels
                .Where(facilityHotel => orderesFacilities
                    .Contains(facilityHotel.FacilityId))
                .Sum(facilityHotel => facilityHotel.Price);

            decimal roomFacilityPrice = room.FacilityRooms
                .Where(facilityRoom => orderesFacilities
                    .Contains(facilityRoom.FacilityId))
                .Sum(facilityRoom => facilityRoom.Price);

            return pricePerDay + hotelFacilityPrice + roomFacilityPrice;
        }

        private Task<bool> CheckIfRoomExistsAsync(int roomId) =>
            _hotelsDb.Rooms.AnyAsync(room => room.Id == roomId);

        private Task<bool> CheckIfHotelExistsAsync(int hotelId) =>
            _hotelsDb.Hotels.AnyAsync(hotel => hotel.Id == hotelId);
    }
}
