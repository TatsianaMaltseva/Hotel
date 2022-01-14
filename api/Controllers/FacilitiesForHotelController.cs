using AutoMapper;
using AutoMapper.QueryableExtensions;
using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.JoinEntities;
using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api/hotels")]
    [ApiController]
    public class FacilitiesForHotelController : Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;
        private readonly IMapper _mapper;

        public FacilitiesForHotelController(HotelsDatabaseContext hotelDb, IMapper mapper)
        {
            _hotelsDb = hotelDb;
            _mapper = mapper;
        }

        [Route("{hotelId}/facilities")]
        [HttpGet]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> GetAllFacilities([FromRoute] int hotelId)
        {
            if (!CheckIfHotelExists(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            Facility[] facilities = await _hotelsDb.Facilities
                .Where(facility => facility.Realm == Realm.Hotel)
                .ProjectTo<Facility>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
            foreach (Facility facility in facilities)
            {
                if (_hotelsDb.FacilityHotel.Any(fh => fh.FacilityId == facility.Id && fh.HotelId == hotelId))
                {
                    facility.Checked = true;
                }
            }
            return Ok(facilities);
        }

        [Route("{hotelId}/facilities/{facilityId}")]
        [HttpPut]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> SetFacilityForHotel([FromRoute] int hotelId, [FromRoute] int facilityId)
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

            FacilityHotel facilityHotel = new FacilityHotel
            {
                HotelId = hotelId,
                FacilityId = facilityId
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
    }
}
