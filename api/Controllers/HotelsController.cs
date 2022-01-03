using AutoMapper;
using AutoMapper.QueryableExtensions;
using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.IO;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HotelsController : Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;
        private readonly IMapper _mapper;
        private readonly string _imagesFolder;

        public HotelsController(
            HotelsDatabaseContext hotelsDb,
            IMapper mapper,
            IOptions<ResourcesOptions> resourcesOptions
        )
        {
            _hotelsDb = hotelsDb;
            _mapper = mapper;
            _imagesFolder = resourcesOptions.Value.ImagesFolder;
        }

        [HttpPost]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> CreateHotel([FromBody] HotelToAdd request)
        {
            HotelEntity hotelEntity = _mapper.Map<HotelEntity>(request); 
            await _hotelsDb.AddAsync(hotelEntity);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtAction(nameof(GetHotel), new { id = hotelEntity.Id }, null);
        }

        [Route("{hotelId}")]
        [HttpPut]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> EditHotel([FromRoute] int hotelId, [FromBody] HotelToEdit request)
        {
            HotelEntity hotelEntity = await GetHotelEntity(hotelId);
            if (hotelEntity == null)
            {
                return BadRequest("Such hotel does not exist");
            }
            _mapper.Map(request, hotelEntity);
            await _hotelsDb.SaveChangesAsync();
            return NoContent();
        }

        [Route("{hotelId}")]
        [HttpGet]
        public async Task<IActionResult> GetHotel([FromRoute] int hotelId)
        {
            Hotel hotel = await _hotelsDb.Hotels
                .Where(hotel => hotel.Id == hotelId)
                .ProjectTo<Hotel>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
            return Ok(hotel);
        }

        [HttpGet]
        public async Task<IActionResult> GetHotelCards(
            [FromQuery] PageParams pageParameters, 
            [FromQuery] FilterParams filterParameters
        )
        {
            var filteredHotelCards = _hotelsDb.Hotels;
            if (filterParameters.Name != null)
            {
                var f  = filteredHotelCards.Where(h => h.Name.Contains(filterParameters.Name));
            }
            HotelCard[] hotelCards = await filteredHotelCards
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

        [Route("names")]
        [HttpGet]
        public async Task<IActionResult> GetHotelNames([FromQuery] string name)//number
        {
            string[] names = await _hotelsDb.Hotels
                .Where(h => h.Name.ToLower().Contains(name.ToLower()))// TODO
                .OrderBy(h => h.Name)
                .Distinct()
                .Take(2) // from front
                .Select(h => h.Name)
                .ToArrayAsync();
            return Ok(names);
        }

        [Route("{hotelId}/images")]
        [HttpPost]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> AddImage([FromRoute] int hotelId)
        {
            if (await GetHotelEntity(hotelId) == null)
            {
                return BadRequest("Such hotel does not exist");
            }

            var file = Request.Form.Files[0];
            if (file.Length <= 0)
            {
                return BadRequest("Something is wrong with file, probably file is empty");
            }
            string fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            string fullPath = Path.Combine(_imagesFolder, fileName);
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            ImageEntity image = new()
            {
                Path = fileName,
                HotelId = hotelId,
                Hotel = await GetHotelEntity(hotelId),
                IsOuterLink = false
            };
            await _hotelsDb.Images.AddAsync(image);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtAction(nameof(GetImage), new { hotelId = image.Hotel.Id, imageId = image.Id }, image.Id);
        }

        [Route("{hotelId}/images")]
        [HttpGet]
        public async Task<IActionResult> GetImages([FromRoute] int hotelId)
        {
            if (await GetHotelEntity(hotelId) == null)
            {
                return BadRequest("Such hotel does not exist");
            }
            Image[] images = await _hotelsDb.Images
                .Where(image => image.HotelId == hotelId)
                .ProjectTo<Image>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
            return Ok(images);
        }

        [Route("{hotelId}/images/{imageId}")]
        [HttpGet]
        public async Task<IActionResult> GetImage([FromRoute] int imageId)
        {
            ImageEntity image = await GetImageEntity(imageId);
            string fullPath = Path.Combine(_imagesFolder, image.Path);
            string extension = image.Path.Split(".")[^1];
            return PhysicalFile(fullPath, $"image/{extension}");
        }

        private async Task<HotelEntity> GetHotelEntity(int hotelId) =>
            await _hotelsDb.Hotels
                .FirstOrDefaultAsync(hotel => hotel.Id == hotelId);

        private async Task<ImageEntity> GetImageEntity(int imageId) =>
            await _hotelsDb.Images
                .FirstOrDefaultAsync(image => image.Id == imageId);
    }
}