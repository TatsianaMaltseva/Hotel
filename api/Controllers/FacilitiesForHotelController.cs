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
            if (!await CheckIfHotelExistsAsync(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            if (!await CheckIdFacilityExistsAsync(facility.Id))
            {
                return BadRequest("Such facility does not exist");
            }

            FacilityHotel facilityHotel = new ()
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

            if (!await CheckIfHotelExistsAsync(hotelId))
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

        private Task<FacilityEntity> GetFacilityEntityAsync(int facilityId) =>
            _hotelsDb.Facilities
                .FirstOrDefaultAsync(facility => facility.Id == facilityId);

        private Task<FacilityHotel> GetFacilityHotelAsync(int hotelId, int facilityId) =>
            _hotelsDb.FacilityHotel
                .FirstOrDefaultAsync(fh => fh.HotelId == hotelId && fh.FacilityId == facilityId);

        private Task<bool> CheckIfHotelExistsAsync(int hotelId) =>
            _hotelsDb.Hotels.AnyAsync(hotel => hotel.Id == hotelId);

        private Task<bool> CheckIdFacilityExistsAsync(int facilityId) =>
            _hotelsDb.Facilities.AnyAsync(facility => facility.Id == facilityId);

    }
}
