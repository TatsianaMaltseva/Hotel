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
            if (!CheckIfHotelExists(hotelId))
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
            if (!CheckIfHotelExists(hotelId))
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
        public async Task<IActionResult> GetRooms([FromRoute] int hotelId)
        {
            if (!CheckIfHotelExists(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            Room[] rooms = await _hotelsDb.Rooms
                .Where(r => r.HotelId == hotelId)
                .ProjectTo<Room>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
            foreach (Room room in rooms)
            {
                room.Facilities = await GetRoomFacilitiesAsync(room.Id);
            }
            return Ok(rooms);
        }

        private Task<Facility[]> GetRoomFacilitiesAsync(int roomId)
        {
            return _hotelsDb.Facilities
                .Join(
                    _hotelsDb.FacilityRoom.Where(fh => fh.RoomId == roomId),
                    facility => facility.Id,
                    facilityRoom => facilityRoom.FacilityId,
                    (facility, facilityRoom) => new Facility
                    {
                        Id = facility.Id,
                        Name = facility.Name,
                        Price = facilityRoom.Price
                    }
                )
                .OrderBy(facility => facility.Price)
                .ToArrayAsync();

        }

        [Route("{hotelId}/rooms")]
        [HttpPost]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> AddRoom([FromRoute] int hotelId, [FromBody] RoomToAdd request)
        {
            if (!CheckIfHotelExists(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            RoomEntity room = _mapper.Map<RoomEntity>(request);
            room.HotelId = hotelId;
            await _hotelsDb.AddAsync(room);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRoom), new { hotelId, roomId = room.Id }, room.Id);
        }

        [Route("{hotelId}/rooms/{roomId}")]
        [HttpGet]
        public async Task<IActionResult> GetRoom([FromRoute] int hotelId, [FromRoute] int roomId)
        {
            if (!CheckIfHotelExists(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            Room room = await _hotelsDb.Rooms
                .Where(room => room.Id == roomId)
                .ProjectTo<Room>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
            return Ok(room);
        }

        private async Task<RoomEntity> GetRoomEntityAsync(int? roomId) =>
            await _hotelsDb.Rooms
                .FirstOrDefaultAsync(room => room.Id == roomId);

        private bool CheckIfHotelExists(int hotelId) =>
            _hotelsDb.Hotels.Any(hotel => hotel.Id == hotelId);
    }
}
