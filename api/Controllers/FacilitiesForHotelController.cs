using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.JoinEntities;
using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
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
        [Authorize(Roles = nameof(Role.Admin))]
        public async Task<IActionResult> SetFacilitiesForHotel([FromRoute] int hotelId, [FromBody] List<Facility> facilities)
        {
            HotelEntity hotel = await _hotelsDb.Hotels
                .Where(hotel => hotel.Id == hotelId)
                .Include(hotel => hotel.FacilityHotels)
                .FirstOrDefaultAsync();

            if (hotel == null)
            {
                return BadRequest("Such hotel does not exist");
            }
            
            hotel.FacilityHotels.RemoveAll(facilityHotel => hotel.FacilityHotels.Contains(facilityHotel));

            foreach (Facility facility in facilities)
            {
                FacilityHotelEntity facilityHotel = new()
                {
                    HotelId = hotelId,
                    FacilityId = facility.Id,
                    Price = facility.Price
                };
                hotel.FacilityHotels.Add(facilityHotel);
            }
            await _hotelsDb.SaveChangesAsync();
            return Ok();
        }
    }
}
