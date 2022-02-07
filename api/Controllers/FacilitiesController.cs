using AutoMapper;
using AutoMapper.QueryableExtensions;
using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using static iTechArt.Hotels.Api.Constants;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacilitiesController : Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;
        private readonly IMapper _mapper;

        public FacilitiesController(HotelsDatabaseContext hotelDb, IMapper mapper)
        {
            _hotelsDb = hotelDb;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize(Roles = Role.Admin)]
        public async Task<Facility[]> GetFacilities([FromQuery] FacilityParams facilityParams)
        {
            if (facilityParams.RoomId != null)
            {
                return await _hotelsDb.Facilities
                    .Where(facility => facility.Realm == Realm.Room)
                    .ProjectTo<Facility>(_mapper.ConfigurationProvider)
                    .ToArrayAsync();
            }
            if (facilityParams.HotelId != null)
            {
                return await _hotelsDb.Facilities
                    .Where(facility => facility.Realm == Realm.Hotel)
                    .ProjectTo<Facility>(_mapper.ConfigurationProvider)
                    .ToArrayAsync();
            }
            return await _hotelsDb.Facilities
                .ProjectTo<Facility>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
        }

        [HttpPost]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> AddFacility([FromBody] FacilityToAdd request)
        {
            FacilityEntity facility = _mapper.Map<FacilityEntity>(request);
            if (!await CheckIfFacilityUniqueAsync(facility))
            {
                return BadRequest($"Facility with {facility.Name} name for {facility.Realm} already exists");
            }
            await _hotelsDb.AddAsync(facility);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtAction(nameof(ChangeFacility), new { facilityId = facility.Id }, facility.Id);
        }

        [Route("{facilityId}")]
        [HttpDelete]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> DeleteFacility([FromRoute] int facilityId)
        {
            FacilityEntity facility = await GetFacilityEntityAsync(facilityId);
            _hotelsDb.Facilities.Remove(facility);
            await _hotelsDb.SaveChangesAsync();
            return NoContent();
        }

        [Route("{facilityId}")]
        [HttpPut]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> ChangeFacility([FromRoute] int facilityId, [FromBody] FacilityToEdit request)
        {
            FacilityEntity facilityEntity = await GetFacilityEntityAsync(facilityId);
            if (facilityEntity == null)
            {
                return BadRequest("Such facility does not exist");
            }
            _mapper.Map(request, facilityEntity);
            await _hotelsDb.SaveChangesAsync();
            return NoContent();
        }

        private Task<FacilityEntity> GetFacilityEntityAsync(int facilityId) =>
             _hotelsDb.Facilities
                .Where(facility => facility.Id == facilityId)
                .FirstOrDefaultAsync();

        private async Task<bool> CheckIfFacilityUniqueAsync(FacilityEntity facility) =>
            !await _hotelsDb.Facilities
                .Where(f => f.Name == facility.Name && f.Realm == facility.Realm)
                .AnyAsync();
    }
}
