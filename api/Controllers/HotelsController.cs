using AutoMapper;
using AutoMapper.QueryableExtensions;
using iTechArt.Hotels.Api.Services;
using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
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
        private readonly IMapper _mapper;

        public HotelsController
        (
            HotelsDatabaseContext hotelsDb,
            ImageService imageService,
            IMapper mapper
        )
        {
            _hotelsDb = hotelsDb;
            _imageService = imageService;
            _mapper = mapper;
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
            try
            {
                HotelEntity hotelEntity = await _hotelsDb.Hotels.SingleOrDefaultAsync(h => h.Id == id);
                _mapper.Map(request, hotelEntity);
                await _hotelsDb.SaveChangesAsync();
                return NoContent();
            }
            catch(Exception ex)
            {
                return Conflict("Data is not valid." + ex);
            }
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
                    return BadRequest("Something is wrong with file, probably it is empty");
                }
                string dbPath = await _imageService.AddImageToPath(file);
                ImageEntity image = new ImageEntity
                {
                    Path = dbPath,
                    HotelId = hotelId
                };
                await _hotelsDb.Images.AddAsync(image);
                await _hotelsDb.SaveChangesAsync();
                return CreatedAtAction(nameof(GetImageByPath), new { dbPath }, null);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [Route("{hotelId}/images")]
        [HttpGet]
        public async Task<IActionResult> GetImagePathsHotel([FromRoute] int hotelId)
        {
            Image[] images = await _hotelsDb.Images
                .Where(image => image.HotelId == hotelId)
                .ProjectTo<Image>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
            return Ok(images);
        }

        private async Task<ImageEntity> GetImageByPath(string dbPath) =>
            await _hotelsDb.Images
                .Where(image => image.Path == dbPath)
                .SingleAsync();

        [Route("countries")]
        [HttpGet]
        public async Task<IActionResult> GetHotelNames()
        {
            string[] names =  await _hotelsDb.Hotels
                                .Select(h => h.Name)
                                .Distinct()
                                .ToArrayAsync();
            return Ok(names);
        }
    }
}