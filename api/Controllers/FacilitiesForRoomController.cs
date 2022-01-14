using AutoMapper;
using AutoMapper.QueryableExtensions;
using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api/hotels")]
    [ApiController]
    public class FacilitiesForRoomController: Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;
        private readonly IMapper _mapper;

        public FacilitiesForRoomController(HotelsDatabaseContext hotelDb, IMapper mapper)
        {
            _hotelsDb = hotelDb;
            _mapper = mapper;
        }

        [Route("{hotelId}/rooms/{roomId}/facilities")]
        [HttpGet]
        public async Task<IActionResult> GetAllFacilities()
        {
            Facility[] facilities = await _hotelsDb.Facilities
                .Where(facility => facility.Realm == Realm.Room)
                .ProjectTo<Facility>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
            return Ok(facilities);
        }
    }
}
