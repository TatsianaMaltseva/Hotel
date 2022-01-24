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
        public async Task<IActionResult> SetFacilitiesForHotel([FromRoute] int hotelId, [FromBody] Facility[] facilities)
        {
            HotelEntity hotel = await GetHotelEntityAsync(hotelId);

            if (hotel == null)
            {
                return BadRequest("Such hotel does not exist");
            }

            FacilityHotelEntity[] facilityHotels = await GetFacilityHotelsAsync(hotelId);

            foreach (FacilityHotelEntity facilityHotel in facilityHotels)
            {
                hotel.FacilityHotels.Remove(facilityHotel);
            }

            foreach (Facility facility in facilities)
            {
                FacilityHotelEntity facilityHotel = new()
                {
                    HotelId = hotelId,
                    FacilityId = facility.Id
                };
                hotel.FacilityHotels.Add(facilityHotel);
            }
            await _hotelsDb.SaveChangesAsync();
            return Ok(facilities);
        }

        private Task<HotelEntity> GetHotelEntityAsync(int hotelId) =>
            _hotelsDb.Hotels
                .FirstOrDefaultAsync(hotel => hotel.Id == hotelId);

        private Task<FacilityHotelEntity[]> GetFacilityHotelsAsync(int hotelId) =>
            _hotelsDb.FacilityHotel
                .Where(fh => fh.HotelId == hotelId)
                .ToArrayAsync();
    }
}
