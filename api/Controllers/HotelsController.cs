using iTechArt.Hotels.Api.Models;
using iTechArt.Hotels.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
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
        private readonly ImageService _imageService;

        public HotelsController
        (
            HotelsDatabaseContext hotelsDb,
            ImageService imageService
        )
        {
            _hotelsDb = hotelsDb;
            _imageService = imageService;
        }

        [HttpPost]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> CreateHotel([FromBody] Hotel request)
        {
            if (request == null)
            {
                return BadRequest("Request is empty");
            }
            Hotel hotel = request; 
            await _hotelsDb.AddAsync(hotel);
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

        [Route("{hotelId}/images")]
        [HttpPost, DisableRequestSizeLimit] //second argument maybe should not be here
        [Authorize(Roles = Role.Admin)]
        public IActionResult AddImage([FromRoute] int hotelId) // make async
        {
            try
            {
                var file = Request.Form.Files[0];
                if (file.Length <= 0)
                {
                    return BadRequest("Something is wrong with file, probably it is empty");
                }
                string dbPath = _imageService.AddImageToPath(file);
                Image image = new Image
                {
                    Path = dbPath,
                    HotelId = hotelId
                };
                _hotelsDb.Images.Add(image);
                _hotelsDb.SaveChanges();
                return Ok(new { dbPath });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex); //500 code is ban
            }
        }

        [Route("{hotelId}/images")]
        [HttpGet]
        public IActionResult GetImagesPathsHotel([FromRoute] int hotelId)
        {
            IEnumerable<Image> images = _hotelsDb.Images
                .Where(image => image.HotelId == hotelId)
                .Select(image => new Image
                {
                    Path = image.Path
                });
            return Ok(images);
        }
    }
}