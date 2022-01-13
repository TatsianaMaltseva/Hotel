using AutoMapper;
using AutoMapper.QueryableExtensions;
using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacilitiesController : Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;
        public readonly IMapper _mapper;

        public FacilitiesController(HotelsDatabaseContext hotelDb, IMapper mapper)
        {
            _hotelsDb = hotelDb;
            _mapper = mapper;
        }

        [Route("{facilityId}")]
        [HttpGet]
        public async Task<IActionResult> GetFacility([FromRoute] int facilityId)
        {
            Facility facility = await _hotelsDb.Facilities
                .Where(facility => facility.Id == facilityId)
                .ProjectTo<Facility>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
            if (facility == null)
            {
                return NotFound($"Facility with {facilityId} id does not exist");
            }
            return Ok(facility);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllFacilities()
        {
            Facility[] facilities = await _hotelsDb.Facilities
                .ProjectTo<Facility>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
            return Ok(facilities);
        }

        [HttpPost]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> AddFacility([FromBody] FacilityToAdd request)
        {
            FacilityEntity facility = _mapper.Map<FacilityEntity>(request);
            if (!CheckIfFacilityUnique(facility.Name))
            {
                return BadRequest($"Facility with {facility.Name} name already exists");
            }
            await _hotelsDb.AddAsync(facility);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtAction(nameof(GetFacility), new { facilityId = facility.Id }, facility.Id);
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
        [HttpPatch]
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

        private async Task<FacilityEntity> GetFacilityEntityAsync(int facilityId) =>
            await _hotelsDb.Facilities
                .FirstOrDefaultAsync(facility => facility.Id == facilityId);

        private bool CheckIfFacilityUnique(string name) =>
            !_hotelsDb.Facilities.Any(facility => facility.Name == name);
    }
}
