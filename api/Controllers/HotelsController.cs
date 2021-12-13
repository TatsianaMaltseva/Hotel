using AutoMapper;
using AutoMapper.QueryableExtensions;
using iTechArt.Hotels.Api.Entities;
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
        private readonly IMapper _mapper;

        public HotelsController
        (
            HotelsDatabaseContext hotelsDb,
            IMapper mapper
        )
        {
            _hotelsDb = hotelsDb;
            _mapper = mapper;
        }

        [HttpPost]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> CreateHotel([FromBody] AddHotelRepresentation request)
        {
            if (request == null)
            {
                return BadRequest("There is not enough data to create hotel");
            }

            HotelEntity hotelEntity = _mapper.Map<HotelEntity>(request); 
            await _hotelsDb.AddAsync(hotelEntity);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtAction(nameof(GetHotel), new { id = hotelEntity.Id }, null);
        }

        [Route("{id}")]
        [HttpGet]
        public async Task<IActionResult> GetHotel([FromRoute] int id)
        {
            HotelRepresentation hotel = await _hotelsDb.Hotels
                .Where(h => h.Id == id)
                .ProjectTo<HotelRepresentation>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
            return Ok(hotel);
        }

        [HttpGet]
        public async Task<IActionResult> GetHotelCards([FromQuery] PageParameters pageParameters)
        {
            if (pageParameters == null)
            {
                return BadRequest("No page parameters");
            }

            HotelCard[] hotelCards = await _hotelsDb.Hotels
                .Skip(pageParameters.PageIndex * pageParameters.PageSize)
                .Take(pageParameters.PageSize)
                .ProjectTo<HotelCard>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
            return Ok(hotelCards);
        }

        [Route("count")]
        [HttpGet]
        public async Task<IActionResult> GetHotelsCount() =>
            Ok(await _hotelsDb.Hotels.CountAsync());
    }
}