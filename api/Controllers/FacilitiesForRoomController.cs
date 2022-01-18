using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.JoinEntities;
using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using static iTechArt.Hotels.Api.Constants;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api/hotels")]
    [ApiController]
    public class FacilitiesForRoomController: Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;

        public FacilitiesForRoomController(HotelsDatabaseContext hotelDb)
        {
            _hotelsDb = hotelDb;
        }

        [Route("{hotelId}/rooms/{roomId}/facilities")]
        [HttpPut]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> SetFacilityForRoom([FromRoute] int hotelId, [FromRoute] int roomId, [FromBody] Facility request)
        {
            FacilityEntity facility = await GetFacilityEntityAsync(request.Id);

            if (!await CheckIfHotelExistsAsync(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            if (!await CheckIfRoomExistsAsync(roomId))
            {
                return BadRequest("Such room does not exist");
            }
            if (facility == null)
            {
                return BadRequest("Such facility does not exist");
            }

            FacilityRoom facilityRoom = new FacilityRoom
            {
                FacilityId = request.Id,
                RoomId = roomId,
                Price = request.Price
            };
            facility.FacilityRooms.Add(facilityRoom);
            await _hotelsDb.SaveChangesAsync();
            return Ok();
        }

        [Route("{hotelId}/rooms/{roomId}/facilities/{facilityId}")]
        [HttpDelete]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> RemoveFacilityForRooms([FromRoute] int hotelId, [FromRoute] int roomId, [FromRoute] int facilityId)
        {
            FacilityEntity facility = await GetFacilityEntityAsync(facilityId);

            if (!await CheckIfHotelExistsAsync(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            if (!await CheckIfRoomExistsAsync(roomId))
            {
                return BadRequest("Such room does not exist");
            }
            if (facility == null)
            {
                return BadRequest("Such facility does not exist");
            }

            FacilityRoom facilityRoom = await GetFacilityRoomAsync(roomId, facilityId);
            facility.FacilityRooms.Remove(facilityRoom);
            await _hotelsDb.SaveChangesAsync();
            return Ok();
        }

        private Task<FacilityEntity> GetFacilityEntityAsync(int facilityId) =>
            _hotelsDb.Facilities
                .FirstOrDefaultAsync(facility => facility.Id == facilityId);

        private Task<FacilityRoom> GetFacilityRoomAsync(int roomId, int facilityId) =>
            _hotelsDb.FacilityRoom
                .FirstOrDefaultAsync(fh => fh.RoomId == roomId && fh.FacilityId == facilityId);

        private Task<bool> CheckIfHotelExistsAsync(int hotelId) =>
            _hotelsDb.Hotels.AnyAsync(hotel => hotel.Id == hotelId);

        private Task<bool> CheckIfRoomExistsAsync(int roomId) =>
            _hotelsDb.Rooms.AnyAsync(room => room.Id == roomId);
    }
}
