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
using System.IO;
using Microsoft.Extensions.Configuration;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HotelsController : Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;
        private readonly IMapper _mapper;
        private readonly string fileFolder;

        public HotelsController(
            HotelsDatabaseContext hotelsDb,
            IMapper mapper,
            IConfiguration configuration
        )
        {
            _hotelsDb = hotelsDb;
            _mapper = mapper;
            fileFolder = configuration["AppSettings:ImageFolder"];
        }

        [HttpPost]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> CreateHotel([FromBody] AddHotel request)
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
        [HttpPut]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> EditHotel([FromRoute] int id, [FromBody] EditHotel request)
        {
            if (request == null)
            {
                return BadRequest("No data to change hotel");
            }
            HotelEntity hotelEntity = await _hotelsDb.Hotels.SingleOrDefaultAsync(h => h.Id == id);
            if (hotelEntity == null)
            {
                return BadRequest("Such hotel does not exist");
            }
            _mapper.Map(request, hotelEntity);
            await _hotelsDb.SaveChangesAsync();
            return NoContent();
        }

        [Route("{id}")]
        [HttpGet]
        public async Task<IActionResult> GetHotel([FromRoute] int id)
        {
            Hotel hotel = await _hotelsDb.Hotels
                .Where(h => h.Id == id)
                .ProjectTo<Hotel>(_mapper.ConfigurationProvider)
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

        [Route("{hotelId}/images")]
        [HttpPost]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> AddImage([FromRoute] int hotelId)
        {
            try
            {
                var file = Request.Form.Files[0];
                if (file.Length <= 0)
                {
                    return BadRequest("Something is wrong with file, probably file is empty");
                }
                string fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                string fullPath = Path.Combine(fileFolder, fileName);
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                ImageEntity image = new ImageEntity
                {
                    Path = fileName,
                    HotelId = hotelId,
                    Hotel = await _hotelsDb.Hotels
                        .Where(h => h.Id == hotelId)
                        .SingleOrDefaultAsync(),
                    IsOuterLink = false
                };
                await _hotelsDb.Images.AddAsync(image);
                await _hotelsDb.SaveChangesAsync();
                return CreatedAtAction(nameof(GetImage), new { hotelId = image.Hotel.Id, imageId = image.Id }, null);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [Route("{hotelId}/images")]
        [HttpGet]
        public async Task<IActionResult> GetImagesId([FromRoute] int hotelId)
        {
            if (await _hotelsDb.Hotels.SingleOrDefaultAsync( h => h.Id == hotelId) == null)
            {
                return BadRequest("Such hotel does not exist");
            }
            Image[] images = await _hotelsDb.Images
                .Where(image => image.Hotel.Id == hotelId)
                .ProjectTo<Image>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
            return Ok(images);
        }

        [Route("{hotelId}/images/{imageId}")]
        [HttpGet]
        public async Task<IActionResult> GetImage([FromRoute] int imageId)
        {
            ImageEntity image = await _hotelsDb.Images.Where(image => image.Id == imageId).SingleOrDefaultAsync();
            string fullPath = Path.Combine(fileFolder, image.Path);
            string extension = image.Path.Split(".")[^1];
            return PhysicalFile(fullPath, $"image/{extension}");
        }
    }
}