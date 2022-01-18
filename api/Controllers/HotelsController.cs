using AutoMapper;
using AutoMapper.QueryableExtensions;
using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.JoinEntities;
using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using static iTechArt.Hotels.Api.Constants;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HotelsController : Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;
        private readonly IMapper _mapper;

        public HotelsController(HotelsDatabaseContext hotelsDb, IMapper mapper)
        {
            _hotelsDb = hotelsDb;
            _mapper = mapper;
        }

        [Route("{hotelId}")]
        [HttpGet]
        public async Task<IActionResult> GetHotel([FromRoute] int hotelId)
        {
            Hotel hotel = await _hotelsDb.Hotels
                .Where(hotel => hotel.Id == hotelId)
                .ProjectTo<Hotel>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
            if (hotel == null)
            {
                return NotFound($"Hotel with {hotelId} id does not exist");
            }

            hotel.Facilities = await GetHotelFacilitiesAsync(hotelId);
            return Ok(hotel);
        }

        [HttpGet]
        public async Task<IActionResult> GetHotelCards(
            [FromQuery] PageParameters pageParameters,
            [FromQuery] HotelFilterParameters filterParams
        )
        {
            var filteredHotelCards = _hotelsDb.Hotels.AsQueryable();
            if (!string.IsNullOrEmpty(filterParams.Name))
            {
                filteredHotelCards = filteredHotelCards.Where(h => h.Name.Contains(filterParams.Name));
            }
            var hotelCount = await filteredHotelCards.CountAsync();
            HotelCard[] hotelCards = await filteredHotelCards
                .Skip(pageParameters.PageIndex * pageParameters.PageSize)
                .Take(pageParameters.PageSize)
                .ProjectTo<HotelCard>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
            return Ok(new { hotelCards, hotelCount });
        }

        [HttpPost]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> AddHotel([FromBody] HotelToAdd request)
        {
            HotelEntity hotel = _mapper.Map<HotelEntity>(request);
            await _hotelsDb.AddAsync(hotel);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtAction(nameof(GetHotel), new { hotelId = hotel.Id }, null);
        }

        [Route("{hotelId}")]
        [HttpPut]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> ChangeHotel([FromRoute] int hotelId, [FromBody] HotelToEdit request)
        {
            HotelEntity hotelEntity = await GetHotelEntityAsync(hotelId);
            if (hotelEntity == null)
            {
                return BadRequest("Such hotel does not exist");
            }
            _mapper.Map(request, hotelEntity);
            await _hotelsDb.SaveChangesAsync();
            return NoContent();
        }

        [Route("names")]
        [HttpGet]
        public async Task<string[]> GetHotelNames([FromQuery] string name, [FromQuery] int number = 2)
        {
            if (string.IsNullOrEmpty(name))
            {
                return Array.Empty<string>();
            }
            string[] names = await _hotelsDb.Hotels
                .Where(h => h.Name.Contains(name))
                .OrderBy(h => h.Name)
                .Distinct()
                .Take(number)
                .Select(h => h.Name)
                .ToArrayAsync();
            return names;
        }

        private Task<Facility[]> GetHotelFacilitiesAsync(int hotelId)
        {
            return _hotelsDb.Facilities
               .Join(
                    _hotelsDb.FacilityHotel.Where(fh => fh.HotelId == hotelId),
                    facility => facility.Id,
                    facilityHotel => facilityHotel.FacilityId,
                    (facility, facilityHotel) => new Facility
                    {
                        Id = facility.Id,
                        Name = facility.Name
                    }
                )
               .ToArrayAsync();
        }

        private async Task<HotelEntity> GetHotelEntityAsync(int hotelId) =>
            await _hotelsDb.Hotels
                .FirstOrDefaultAsync(hotel => hotel.Id == hotelId);
    }
}