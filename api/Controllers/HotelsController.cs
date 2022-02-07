using AutoMapper;
using AutoMapper.QueryableExtensions;
using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
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
        private readonly string timeFormat = @"hh\:mm";

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
                .Include(hotel => hotel.FacilityHotels)
                .ThenInclude(facilityHotel => facilityHotel.Facility)
                .Select(hotel => new Hotel()
                {
                    Id = hotel.Id,
                    Name = hotel.Name,
                    Country = hotel.Country,
                    City = hotel.City,
                    Address = hotel.Address,
                    Description = hotel.Description,
                    MainImageId = hotel.MainImageId,
                    Facilities = hotel.FacilityHotels
                        .Select(facilityHotel => new Facility()
                        {
                            Id = facilityHotel.FacilityId,
                            Name = facilityHotel.Facility.Name,
                            Realm = Realm.Hotel,
                            Price = facilityHotel.Price
                        })
                        .ToList(),
                    CheckInTime = hotel.CheckInTime.ToString(timeFormat),
                    CheckOutTime = hotel.CheckOutTime.ToString(timeFormat)
                })
                .FirstOrDefaultAsync();
            if (hotel == null)
            {
                return NotFound($"Hotel with {hotelId} id does not exist");
            }

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
            if (!string.IsNullOrEmpty(filterParams.Country))
            {
                filteredHotelCards = filteredHotelCards.Where(h => h.Country.Contains(filterParams.Country));
            }
            if (!string.IsNullOrEmpty(filterParams.City))
            {
                filteredHotelCards = filteredHotelCards.Where(h => h.City.Contains(filterParams.City));
            }
            var hotelCount = await filteredHotelCards.CountAsync();
            HotelCard[] hotelCards = await filteredHotelCards
                .Skip(pageParameters.PageIndex * pageParameters.PageSize)
                .Take(pageParameters.PageSize)
                //
                .ProjectTo<HotelCard>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
            return Ok(new { hotelCards, hotelCount });
        }

        [HttpPost]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> AddHotel([FromBody] HotelToAdd request)
        {
            if (request.CheckInTime >= request.CheckOutTime)
            {
                return BadRequest("Check in time should be less than check out time");
            }
            HotelEntity hotel = _mapper.Map<HotelEntity>(request);
            await _hotelsDb.AddAsync(hotel);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtAction(nameof(GetHotel), new { hotelId = hotel.Id }, hotel.Id);
        }

        [Route("{hotelId}")]
        [HttpPut]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> ChangeHotel([FromRoute] int hotelId, [FromBody] HotelToEdit request)
        {
            if (request.CheckInTime >= request.CheckOutTime)
            {
                return BadRequest("Check in time should be less than check out time");
            }
            HotelEntity hotelEntity = await GetHotelEntityAsync(hotelId);
            if (hotelEntity == null)
            {
                return BadRequest("Such hotel does not exist");
            }
            _mapper.Map(request, hotelEntity);
            await _hotelsDb.SaveChangesAsync();
            return NoContent();
        }

        [Route("{hotelId}")]
        [HttpDelete]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> DeleteHotel([FromRoute] int hotelId)
        {
            HotelEntity hotel = await GetHotelEntityAsync(hotelId);
            if (hotel == null)
            {
                return BadRequest("Such hotel does not exist");
            }
            _hotelsDb.Hotels.Remove(hotel);

            var hotelImages = _hotelsDb.Images.Where(image => image.HotelId == hotelId);
            _hotelsDb.Images.RemoveRange(hotelImages);

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

        [Route("countries")]
        [HttpGet]
        public async Task<string[]> GetHotelCountries([FromQuery] string country, [FromQuery] int number = 2)
        {
            if (string.IsNullOrEmpty(country))
            {
                return Array.Empty<string>();
            }
            string[] names = await _hotelsDb.Hotels
                .Where(h => h.Country.Contains(country))
                .OrderBy(h => h.Country)
                .Distinct()
                .Take(number)
                .Select(h => h.Country)
                .ToArrayAsync();
            return names;
        }

        [Route("cities")]
        [HttpGet]
        public async Task<string[]> GetHotelCities([FromQuery] string city, [FromQuery] int number = 2)
        {
            if (string.IsNullOrEmpty(city))
            {
                return Array.Empty<string>();
            }
            string[] names = await _hotelsDb.Hotels
                .Where(h => h.City.Contains(city))
                .OrderBy(h => h.City)
                .Distinct()
                .Take(number)
                .Select(h => h.City)
                .ToArrayAsync();
            return names;
        }

        private Task<HotelEntity> GetHotelEntityAsync(int hotelId) =>
             _hotelsDb.Hotels
                .Where(hotel => hotel.Id == hotelId)
                .FirstOrDefaultAsync();
    }
}