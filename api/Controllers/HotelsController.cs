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
                return BadRequest("Wrong response");
            }

            Hotel hotel = new Hotel
            {
                Name = request.Name,
                Country = request.Country,
                Sity = request.Sity,
                Address = request.Address
            };
            _hotelsDb.Add(hotel);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtAction(nameof(GetHotel), new { id = hotel.HotelId }, null);
        }

        [Route("{id}")]
        [HttpGet]
        public async Task<IActionResult> GetHotel([FromRoute] int id)
        {
            Hotel hotel = await _hotelsDb.Hotels.SingleOrDefaultAsync(h => h.HotelId == id);
            return Ok(hotel);
        }

        [HttpGet]
        public async Task<IActionResult> GetHotels([FromQuery] PageParameters pageParamaters)
        {
            Hotel[] hotels = await _hotelsDb.Hotels
                .Skip((pageParamaters.PageIndex - 1) * pageParamaters.PageSize)
                .Take(pageParamaters.PageSize)
                .ToArrayAsync();
            return Ok(hotels);
        }

        [Route("count")]
        [HttpGet]
        public async Task<IActionResult> GetHotelsCount() =>
            Ok(await _hotelsDb.Hotels.CountAsync());
    }
}