using AutoMapper;
using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.JoinEntities;
using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
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

            if (!CheckIfHotelExists(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            if (!CheckIfRoomExists(roomId))
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

            if (!CheckIfHotelExists(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            if (!CheckIfRoomExists(roomId))
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

        private async Task<FacilityEntity> GetFacilityEntityAsync(int facilityId) =>
            await _hotelsDb.Facilities
                .FirstOrDefaultAsync(facility => facility.Id == facilityId);

        private async Task<FacilityRoom> GetFacilityRoomAsync(int roomId, int facilityId) =>
            await _hotelsDb.FacilityRoom
                .FirstOrDefaultAsync(fh => fh.RoomId == roomId && fh.FacilityId == facilityId);

        private bool CheckIfHotelExists(int hotelId) =>
            _hotelsDb.Hotels.Any(hotel => hotel.Id == hotelId);

        private bool CheckIfRoomExists(int roomId) =>
            _hotelsDb.Rooms.Any(room => room.Id == roomId);
    }
}
