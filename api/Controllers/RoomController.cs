using AutoMapper;
using AutoMapper.QueryableExtensions;
using System.Linq;
using System.Threading.Tasks;
using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using static iTechArt.Hotels.Api.Constants;
using System.Collections.Generic;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api/hotels")]
    [ApiController]
    public class RoomController : Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;
        private readonly IMapper _mapper;

        public RoomController(
            HotelsDatabaseContext hotelsDb,
            IMapper mapper
        )
        {
            _hotelsDb = hotelsDb;
            _mapper = mapper;
        }

        [Route("{hotelId}/rooms/{roomId}")]
        [HttpDelete]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> DeleteRoom([FromRoute] int hotelId, [FromRoute] int roomId)
        {
            if (!await CheckIfHotelExistsAsync(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            RoomEntity room = await GetRoomEntityAsync(roomId);
            if (room == null)
            {
                return BadRequest("Such room does not exist");
            }
            _hotelsDb.Rooms.Remove(room);

            var roomImages = _hotelsDb.Images.Where(image => image.RoomId == roomId);
            _hotelsDb.Images.RemoveRange(roomImages);

            await _hotelsDb.SaveChangesAsync();
            return NoContent();
        }

        [Route("{hotelId}/rooms/{roomId}")]
        [HttpPut]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> ChangeRoom([FromRoute] int hotelId, [FromRoute] int roomId, [FromBody] RoomToEdit request)
        {
            if (!await CheckIfHotelExistsAsync(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            RoomEntity roomEntity = await GetRoomEntityAsync(roomId);
            if (roomEntity == null)
            {
                return BadRequest("Such room does not exist");
            }
            _mapper.Map(request, roomEntity);
            await _hotelsDb.SaveChangesAsync();
            return NoContent();
        }

        [Route("{hotelId}/rooms")]
        [HttpGet]
        public async Task<IActionResult> GetRooms([FromRoute] int hotelId, [FromQuery] OrderDateParams orderDateParams)
        {
            if (!await CheckIfHotelExistsAsync(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }

            List<Room> rooms = await _hotelsDb.Hotels
                .Where(h => h.Id == hotelId)
                .Include(hotel => hotel.Rooms)
                .ThenInclude(room => room.Facilities)
                .Select(hotel => _mapper.Map<List<Room>>(hotel.Rooms))
                .SingleOrDefaultAsync();

            foreach (Room room in rooms)
            {
                OrderEntity[] orders = await _hotelsDb.Orders
                    .Where(order => order.RoomId == room.Id)
                    .ToArrayAsync();
                foreach (OrderEntity order in orders)
                {
                    if (!(orderDateParams.CheckInDate < order.CheckInDate
                        || orderDateParams.CheckInDate > order.CheckOutDate))
                    {
                        room.Number -= 1;
                    }
                }
            }

            rooms.RemoveAll(room => room.Number <= 0);

            return Ok(rooms);
        }

        [Route("{hotelId}/rooms")]
        [HttpPost]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> AddRoom([FromRoute] int hotelId, [FromBody] RoomToAdd request)
        {
            if (!await CheckIfHotelExistsAsync(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            RoomEntity room = _mapper.Map<RoomEntity>(request);
            HotelEntity hotel = await _hotelsDb.Hotels.Where(hotel => hotel.Id == hotelId).FirstOrDefaultAsync();
            hotel.Rooms.Add(room);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRoom), new { hotelId, roomId = room.Id }, room.Id);
        }

        [Route("{hotelId}/rooms/{roomId}")]
        [HttpGet]
        public async Task<IActionResult> GetRoom([FromRoute] int hotelId, [FromRoute] int roomId)
        {
            if (!await CheckIfHotelExistsAsync(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            Room room = await _hotelsDb.Rooms
                .Where(room => room.Id == roomId)
                .ProjectTo<Room>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
            return Ok(room);
        }

        private Task<RoomEntity> GetRoomEntityAsync(int? roomId) =>
            _hotelsDb.Rooms
                .FirstOrDefaultAsync(room => room.Id == roomId);

        private Task<bool> CheckIfHotelExistsAsync(int hotelId) =>
            _hotelsDb.Hotels.AnyAsync(hotel => hotel.Id == hotelId);
    }
}
