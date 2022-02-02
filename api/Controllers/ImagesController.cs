using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static iTechArt.Hotels.Api.Constants;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api/hotels")]
    [ApiController]
    public class ImagesController : Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;
        private readonly IMapper _mapper;
        private readonly string _imagesFolder;

        public ImagesController(
            HotelsDatabaseContext hotelsDb,
            IMapper mapper,
            IOptions<ResourcesOptions> resourcesOptions
        )
        {
            _hotelsDb = hotelsDb;
            _mapper = mapper;
            _imagesFolder = resourcesOptions.Value.ImagesFolder;
        }

        [Route("{hotelId}/images")]
        [HttpPost]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> AddHotelImage([FromRoute] int hotelId)
        {
            if (!await CheckIfHotelExistsAsync(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }

            string fileName = null;
            try
            {
                var file = Request.Form.Files[0];
                fileName = await SaveFileAsync(file);
            }
            catch
            {
                return BadRequest("Something is wrong with file, probably file is empty");
            }
            ImageEntity image = new()
            {
                Path = fileName,
                HotelId = hotelId,
                IsOuterLink = false,
            };
            await _hotelsDb.Images.AddAsync(image);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtAction
            (
                nameof(GetImage), 
                new { hotelId = image.HotelId, imageId = image.Id }, 
                image.Id
            );
        }

        [Route("{hotelId}/rooms/{roomId}/images")]
        [HttpPost]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> AddRoomImage([FromRoute] int hotelId, [FromRoute] int roomId)
        {
            if (!await CheckIfHotelExistsAsync(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            if (!await CheckIfRoomExistsAsync(roomId))
            {
                return BadRequest("Such room does not exist");
            }
            var file = Request.Form.Files[0];
            if (file.Length == 0)
            {
                return BadRequest("Something is wrong with file, probably file is empty");
            }

            var fileName = await SaveFileAsync(file);
            ImageEntity image = new()
            {
                Path = fileName,
                HotelId = hotelId,
                IsOuterLink = false,
                RoomId = roomId,
            };
            await _hotelsDb.Images.AddAsync(image);
            await _hotelsDb.SaveChangesAsync();

            return CreatedAtAction
            (
                nameof(GetImage), 
                new { hotelId = image.HotelId, roomId = image.RoomId, imageId = image.Id }, 
                image.Id
            );
        }

        [Route("{hotelId}/images/{imageId}")]
        [Route("{hotelId}/rooms/{roomId}/images/{imageId}")]
        [HttpDelete]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> DeleteImage([FromRoute] int imageId)
        {
            ImageEntity image = await GetImageEntityAsync(imageId);
            if (image == null)
            {
                return NotFound("Such image does not exist");
            }
            string imageFullPath = Path.Combine(_imagesFolder, image.Path);
            if (System.IO.File.Exists(imageFullPath))
            {
                System.IO.File.Delete(imageFullPath);
            }
            _hotelsDb.Images.Remove(image);
            await _hotelsDb.SaveChangesAsync();
            return NoContent();
        }

        [Route("{hotelId}/images")]
        [HttpGet]
        public async Task<IActionResult> GetHotelImages([FromRoute] int hotelId, [FromQuery] PageParameters pageParameters)
        {
            if (!await CheckIfHotelExistsAsync(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            var imagesBeforePagination = _hotelsDb.Images
                .Where(image => image.HotelId == hotelId && image.RoomId == null);

            var imageCount = await imagesBeforePagination.CountAsync();

            Image[] images = await imagesBeforePagination
                .Skip(pageParameters.PageIndex * pageParameters.PageSize)
                .Take(pageParameters.PageSize)
                .ProjectTo<Image>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
            return Ok( new { images, imageCount });
        }

        [Route("{hotelId}/rooms/{roomId}/images")]
        [HttpGet]
        public async Task<IActionResult> GetRoomImages([FromRoute] int hotelId, [FromRoute] int roomId, [FromQuery] PageParameters pageParameters)
        {
            if (!await CheckIfHotelExistsAsync(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            if (!await CheckIfRoomExistsAsync(roomId))
            {
                return BadRequest("Such room does not exist");
            }
            var imagesBeforePagination = _hotelsDb.Images
                .Where(image => image.HotelId == hotelId && image.RoomId == roomId);

            var imageCount = await imagesBeforePagination.CountAsync();

            Image[] images = await imagesBeforePagination
                .Skip(pageParameters.PageIndex * pageParameters.PageSize)
                .Take(pageParameters.PageSize)
                .ProjectTo<Image>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
            return Ok(new { images, imageCount });
        }

        [Route("{hotelId}/images/{imageId}")]
        [Route("{hotelId}/rooms/{roomId}/images/{imageId}")]
        [HttpGet]
        public async Task<IActionResult> GetImage([FromRoute] int imageId)
        {
            ImageEntity image = await GetImageEntityAsync(imageId);
            string fullPath = Path.Combine(_imagesFolder, image.Path);
            string extension = image.Path.Split(".")[^1];
            return PhysicalFile(fullPath, $"image/{extension}");
        }

        private async Task<string> SaveFileAsync(IFormFile file)
        {
            string fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            string fullPath = Path.Combine(_imagesFolder, fileName);
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return fileName;
        }

        private Task<ImageEntity> GetImageEntityAsync(int imageId) =>
            _hotelsDb.Images
                .FirstOrDefaultAsync(image => image.Id == imageId);

        private Task<bool> CheckIfHotelExistsAsync(int hotelId) =>
            _hotelsDb.Hotels.AnyAsync(hotel => hotel.Id == hotelId);

        private Task<bool> CheckIfRoomExistsAsync(int roomId) =>
            _hotelsDb.Rooms.AnyAsync(room => room.Id == roomId);
    }
}
