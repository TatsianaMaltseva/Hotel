using AutoMapper;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.IO;
using System.Security.Claims;
using System;
using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using static iTechArt.Hotels.Api.Constants;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api/hotels")]
    [ApiController]
    public class RoomController : Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;
        private readonly IMapper _mapper;
        private readonly string _imagesFolder;

        public RoomController(
            HotelsDatabaseContext hotelsDb,
            IMapper mapper,
            IOptions<ResourcesOptions> resourcesOptions
        )
        {
            _hotelsDb = hotelsDb;
            _mapper = mapper;
            _imagesFolder = resourcesOptions.Value.ImagesFolder;
        }

        [Route("{hotelId}/rooms/{roomId}")]
        [HttpDelete]
        [Authorize(Roles = nameof(Role.Admin))]
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

            var roomImages = _hotelsDb.Images
                .Where(image => image.RoomId == roomId);
            _hotelsDb.Images.RemoveRange(roomImages);
            foreach(ImageEntity image in roomImages)
            {
                string imageFullPath = Path.Combine(_imagesFolder, image.Path);
                if (System.IO.File.Exists(imageFullPath))
                {
                    System.IO.File.Delete(imageFullPath);
                }
            }

            await _hotelsDb.SaveChangesAsync();
            return NoContent();
        }

        [Route("{hotelId}/rooms/{roomId}")]
        [HttpPut]
        [Authorize(Roles = nameof(Role.Admin))]
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

            Claim role = (HttpContext.User.Identity as ClaimsIdentity)
                .FindFirst(ClaimTypes.Role);

            if (role == null || Enum.Parse<Role>(role.Value) != Role.Admin)
            {
                return Ok(await GetRoomsForClientAsync(hotelId, roomFilterParams));
            }
            return Ok(await GetRoomsForAdminAsync(hotelId));
        }

        [Route("{hotelId}/rooms")]
        [HttpPost]
        [Authorize(Roles = nameof(Role.Admin))]
        public async Task<IActionResult> AddRoom([FromRoute] int hotelId, [FromBody] RoomToAdd request)
        {
            if (!await CheckIfHotelExistsAsync(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            RoomEntity room = _mapper.Map<RoomEntity>(request);
            room.HotelId = hotelId;
            _hotelsDb.Rooms.Add(room);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtAction(nameof(ChangeRoom), new { hotelId, roomId = room.Id }, room.Id);
        }

        private async Task<List<Room>> GetRoomsForAdminAsync(int hotelId)
        {
            List<Room> roomsForAdmin = await _hotelsDb.Rooms
                .Where(room => room.HotelId == hotelId)
                .Include(room => room.FacilityRooms)
                .ThenInclude(facilityRoom => facilityRoom.Facility)
                .Select(room => new Room()
                {
                    Id = room.Id,
                    Name = room.Name,
                    Sleeps = room.Sleeps,
                    Price = room.Price,
                    MainImageId = room.MainImageId,
                    Number = room.Number,
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
            return roomsForAdmin;
        }

        private async Task<List<Room>> GetRoomsForClientAsync(int hotelId, RoomFilterParams roomFilterParams)
        {
            List<Room> roomsForCLient = await _hotelsDb.Rooms
                .Where(room => room.HotelId == hotelId)
                .Include(room => room.FacilityRooms)
                .ThenInclude(facilityRoom => facilityRoom.Facility)
                .Include(room => room.Orders)
                .Include(room => room.ActiveViews)
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
            return roomsForCLient;
        }

        private Task<RoomEntity> GetRoomEntityAsync(int? roomId) =>
            _hotelsDb.Rooms
                .FirstOrDefaultAsync(room => room.Id == roomId);

        private Task<bool> CheckIfHotelExistsAsync(int hotelId) =>
            _hotelsDb.Hotels.AnyAsync(hotel => hotel.Id == hotelId);
    }
}
