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
        public async Task<IActionResult> SetFacilitiesForRoom([FromRoute] int hotelId, [FromRoute] int roomId, [FromBody] Facility[] facilities)
        {
            if (!await CheckIfHotelExistsAsync(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }

            RoomEntity room = await _hotelsDb.Rooms
                .Where(room => room.Id == roomId)
                .Include(room => room.FacilityRooms)
                .FirstOrDefaultAsync();

            if (room == null)
            {
                return BadRequest("Such room does not exist");
            }

            room.FacilityRooms.RemoveAll(facilityRoom => room.FacilityRooms.Contains(facilityRoom));

            foreach (Facility facility in facilities)
            {
                FacilityRoomEntity facilityRoom = new()
                {
                    FacilityId = facility.Id,
                    RoomId = roomId,
                    Price = facility.Price
                };
                room.FacilityRooms.Add(facilityRoom);
            }
            await _hotelsDb.SaveChangesAsync();
            return Ok();
        }

        private Task<bool> CheckIfHotelExistsAsync(int hotelId) =>
            _hotelsDb.Hotels.AnyAsync(hotel => hotel.Id == hotelId);
    }
}
