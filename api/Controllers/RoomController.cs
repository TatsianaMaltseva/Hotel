﻿using AutoMapper;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.IO;
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

            foreach (ImageEntity image in roomImages)
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
            return Ok();
        }

        [Route("{hotelId}/rooms")]
        [HttpGet]
        public async Task<IActionResult> GetRooms([FromRoute] int hotelId, [FromQuery] RoomFilterParams roomFilterParams)
        {
            if (!await CheckIfHotelExistsAsync(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }

            return Ok(GetRoomsForClientAsync(hotelId, roomFilterParams));
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

        private List<Room> GetRoomsForClientAsync(int hotelId, RoomFilterParams roomFilterParams)
        {
            var rooms = _hotelsDb.Rooms
                .Where(room => room.HotelId == hotelId);
            if (roomFilterParams.Sleeps.HasValue)
            {
                rooms = rooms.Where(room => room.Sleeps == roomFilterParams.Sleeps);
            }
            List<Room> roomsForCLient = rooms
                .Include(room => room.ActiveViews)
                .Include(room => room.FacilityRooms)
                .ThenInclude(facilityRoom => facilityRoom.Facility)
                .AsEnumerable()
                .GroupJoin(_hotelsDb.Orders,
                    room => room.Id,
                    order => order.RoomId,
                    (room, orders) => new
                    {
                        room,
                        ordersNumber = (roomFilterParams.CheckInDate != null && roomFilterParams.CheckOutDate != null)
                            ? orders
                                .Where(order =>
                                    !(roomFilterParams.CheckOutDate < order.CheckInDate
                                        | roomFilterParams.CheckInDate > order.CheckOutDate)
                                )
                                .Count()
                            : 0
                    }
                )
                .Select(data =>
                    new Room
                    {
                        Id = data.room.Id,
                        Name = data.room.Name,
                        Sleeps = data.room.Sleeps,
                        Price = data.room.Price,
                        MainImageId = data.room.MainImageId,
                        Number = data.room.Number - data.ordersNumber - (roomFilterParams.ShowAvailableRoomsOnly ? data.room.ActiveViews.Count() : 0),
                        Facilities = data.room.FacilityRooms
                            .Select(facilityRoom =>
                                new Facility
                                {
                                    Id = facilityRoom.FacilityId,
                                    Name = facilityRoom.Facility.Name,
                                    Realm = Realm.Room,
                                    Price = facilityRoom.Price
                                }
                            )
                            .ToList()
                    }
                )
                .Where(room => room.Number > 0)
                .ToList();
            return roomsForCLient;
        }

        private Task<RoomEntity> GetRoomEntityAsync(int? roomId) =>
            _hotelsDb.Rooms
                .FirstOrDefaultAsync(room => room.Id == roomId);

        private Task<bool> CheckIfHotelExistsAsync(int hotelId) =>
            _hotelsDb.Hotels.AnyAsync(hotel => hotel.Id == hotelId);
    }
}
