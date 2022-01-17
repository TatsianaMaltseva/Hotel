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
    public class FacilitiesForHotelController : Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;

        public FacilitiesForHotelController(HotelsDatabaseContext hotelDb)
        {
            _hotelsDb = hotelDb;
        }

        [Route("{hotelId}/facilities")]
        [HttpPut]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> SetFacilityForHotel([FromRoute] int hotelId, [FromBody] Facility request)
        {
            FacilityEntity facility = await GetFacilityEntityAsync(request.Id);
            if (!CheckIfHotelExists(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            if (!CheckIdFacilityExists(facility.Id))
            {
                return BadRequest("Such facility does not exist");
            }

            FacilityHotel facilityHotel = new FacilityHotel
            {
                HotelId = hotelId,
                FacilityId = facility.Id
            };
            facility.FacilityHotels.Add(facilityHotel);
            await _hotelsDb.SaveChangesAsync();
            return Ok();
        }

        [Route("{hotelId}/facilities/{facilityId}")]
        [HttpDelete]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> RemoveFacilityForHotel([FromRoute] int hotelId, [FromRoute] int facilityId)
        {
            FacilityEntity facility = await GetFacilityEntityAsync(facilityId);

            if (!CheckIfHotelExists(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            if (facility == null)
            {
                return BadRequest("Such facility does not exist");
            }

            FacilityHotel facilityHotel = await GetFacilityHotelAsync(hotelId, facilityId);
            facility.FacilityHotels.Remove(facilityHotel);
            await _hotelsDb.SaveChangesAsync();
            return Ok();
        }

        private async Task<FacilityEntity> GetFacilityEntityAsync(int facilityId) =>
            await _hotelsDb.Facilities
                .FirstOrDefaultAsync(facility => facility.Id == facilityId);

        private async Task<FacilityHotel> GetFacilityHotelAsync(int hotelId, int facilityId) =>
            await _hotelsDb.FacilityHotel
                .FirstOrDefaultAsync(fh => fh.HotelId == hotelId && fh.FacilityId == facilityId);

        private bool CheckIfHotelExists(int hotelId) =>
            _hotelsDb.Hotels.Any(hotel => hotel.Id == hotelId);

        private bool CheckIdFacilityExists(int facilityId) =>
            _hotelsDb.Facilities.Any(facility => facility.Id == facilityId);

    }
}
