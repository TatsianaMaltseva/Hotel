using AutoMapper;
using AutoMapper.QueryableExtensions;
using iTechArt.Hotels.Api.Entities;
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
    public class FacilitiesController : Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;
        private readonly IMapper _mapper;

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
        [Authorize(Roles = Role.Admin)]
        public async Task<Facility[]> GetFacilities([FromQuery] FacilityParams facilityParams)
        {
            if (facilityParams.RoomId != null)
            {
                return await GetCheckedRoomFacilities(facilityParams.RoomId ?? -1);
            }
            if (facilityParams.HotelId != null)
            {
                return await GetCheckedHotelFacilities(facilityParams.HotelId ?? -1);
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

        private async Task<Facility[]> GetCheckedRoomFacilities(int roomId)
        {
            if (!CheckIfRoomExists(roomId))
            {
                return Array.Empty<Facility>();
            }
            Facility[] facilities = await _hotelsDb.Facilities
                .Where(facility => facility.Realm == Realm.Room)
                .ProjectTo<Facility>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
            facilities = MarkAsCheckedForRoom(facilities, roomId);
            return facilities;
        }

        private async Task<Facility[]> GetCheckedHotelFacilities(int hotelId)
        {
            if (!CheckIfHotelExists(hotelId))
            {
                return Array.Empty<Facility>();
            }
            Facility[] facilities = await _hotelsDb.Facilities
                .Where(facility => facility.Realm == Realm.Hotel)
                .ProjectTo<Facility>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
            facilities = MarkAsCheckedForHotel(facilities, hotelId);
            return facilities;
        }

        private Facility[] MarkAsCheckedForHotel(Facility[] facilities, int hotelId)
        {
            foreach (Facility facility in facilities)
            {
                if (_hotelsDb.FacilityHotel.Any(fh => fh.FacilityId == facility.Id && fh.HotelId == hotelId))
                {
                    facility.Checked = true;
                }
            }
            return facilities;
        }

        private Facility[] MarkAsCheckedForRoom(Facility[] facilities, int roomId)
        {
            foreach (Facility facility in facilities)
            {
                if (_hotelsDb.FacilityRoom.Any(fh => fh.FacilityId == facility.Id && fh.RoomId == roomId))
                {
                    facility.Checked = true;
                    facility.Price = _hotelsDb.FacilityRoom
                        .Where(fh => fh.FacilityId == facility.Id && fh.RoomId == roomId)
                        .First()
                        .Price;
                }
            }
            return facilities;
        }

        private async Task<FacilityEntity> GetFacilityEntityAsync(int facilityId) =>
            await _hotelsDb.Facilities
                .FirstOrDefaultAsync(facility => facility.Id == facilityId);

        private bool CheckIfFacilityUnique(string name) =>
            !_hotelsDb.Facilities.Any(facility => facility.Name == name);

        private bool CheckIfHotelExists(int hotelId) =>
            _hotelsDb.Hotels.Any(hotel => hotel.Id == hotelId);

        private bool CheckIfRoomExists(int roomId) =>
            _hotelsDb.Rooms.Any(room => room.Id == roomId);
    }
}
