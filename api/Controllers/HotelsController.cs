using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HotelsController : Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;

        public HotelsController(HotelsDatabaseContext hotelsDb)
        {
            _hotelsDb = hotelsDb;
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> CreateHotel([FromBody] Hotel request )
        {
            if (request == null)
            {
                return BadRequest("Request is empty");
            }
            Hotel hotel = request; 
            _hotelsDb.Add(hotel);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtAction(nameof(GetHotel), new { id = hotel.Id }, null);
        }

        [Route("{id}")]
        [HttpGet]
        public async Task<IActionResult> GetHotel([FromRoute] int id)
        {
            Hotel hotel = await _hotelsDb.Hotels.SingleOrDefaultAsync(h => h.Id == id);
            return Ok(hotel);
        }

        [HttpGet]
        public async Task<IActionResult> GetHotelsDto([FromQuery] PageParameters pageParameters)
        {
            if (pageParameters == null)
            {
                return BadRequest("No page parameters");
            }
            IEnumerable<HotelDto> hotels = await _hotelsDb.Hotels
                .Skip(pageParameters.PageIndex * pageParameters.PageSize)
                .Take(pageParameters.PageSize)
                .Select(h => new HotelDto
                    {
                        Id = h.Id,
                        City = h.City,
                        Country = h.Country,
                        Name = h.Name
                    })
                .ToArrayAsync();
            return Ok(hotels);
        }

        [Route("count")]
        [HttpGet]
        public async Task<IActionResult> GetHotelsCount() =>
            Ok(await _hotelsDb.Hotels.CountAsync());
    }
}