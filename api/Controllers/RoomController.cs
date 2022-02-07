using AutoMapper;
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
        public async Task<IActionResult> GetRooms([FromRoute] int hotelId, [FromQuery] RoomFilterParams roomFilterParams)
        {
            if (!await CheckIfHotelExistsAsync(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }

            List<Room> rooms = await _hotelsDb.Rooms
                .Where(room => room.HotelId == hotelId)
                .Include(room => room.Orders)
                .Include(room => room.ActiveViews)
                .Include(room => room.FacilityRooms)
                .ThenInclude(facilityRoom => facilityRoom.Facility)
                .Select(room => new Room()
                {
                    Id = room.Id,
                    Name = room.Name,
                    Sleeps = room.Sleeps,
                    Price = room.Price,
                    MainImageId = room.MainImageId,
                    Number = (roomFilterParams.CheckInDate != null && roomFilterParams.CheckOutDate != null) 
                        ? room.Number - room.Orders
                            .Where(order => !(roomFilterParams.CheckOutDate < order.CheckInDate
                                || roomFilterParams.CheckInDate > order.CheckOutDate))
                            .Count() - room.ActiveViews.Count()
                        : room.Number - room.ActiveViews.Count(),
                    Facilities = room.FacilityRooms
                        .Select(facilityRoom => new Facility()
                        {
                            Id = facilityRoom.FacilityId,
                            Name = facilityRoom.Facility.Name,
                            Realm = Realm.Room,
                            Price = facilityRoom.Price
                        })
                        .ToList()
                })
                .Where(room => room.Number > 0)
                .ToListAsync();

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
            HotelEntity hotel = await _hotelsDb.Hotels
                .Where(hotel => hotel.Id == hotelId)
                .Include(hotel => hotel.Rooms)
                .FirstOrDefaultAsync();
            hotel.Rooms.Add(room);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtAction(nameof(ChangeRoom), new { hotelId, roomId = room.Id }, room.Id);
        }

        private Task<RoomEntity> GetRoomEntityAsync(int? roomId) =>
            _hotelsDb.Rooms
                .FirstOrDefaultAsync(room => room.Id == roomId);

        private Task<bool> CheckIfHotelExistsAsync(int hotelId) =>
            _hotelsDb.Hotels.AnyAsync(hotel => hotel.Id == hotelId);
    }
}
