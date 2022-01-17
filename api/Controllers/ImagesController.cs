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
            if (!CheckIfHotelExists(hotelId))
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
            if (!CheckIfHotelExists(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            if (!CheckIfRoomExists(roomId))
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
        public async Task<IActionResult> GetHotelImages([FromRoute] int hotelId)
        {
            if (!CheckIfHotelExists(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            var images = await _hotelsDb.Images
                .Where(image => image.HotelId == hotelId && image.RoomId == null)
                .ProjectTo<Image>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
            return Ok(images);
        }

        [Route("{hotelId}/rooms/{roomId}/images")]
        [HttpGet]
        public async Task<IActionResult> GetRoomImages([FromRoute] int hotelId, [FromRoute] int roomId)
        {
            if (!CheckIfHotelExists(hotelId))
            {
                return BadRequest("Such hotel does not exist");
            }
            if (!CheckIfRoomExists(roomId))
            {
                return BadRequest("Such room does not exist");
            }
            var images = await _hotelsDb.Images
                .Where(image => image.HotelId == hotelId && image.RoomId == roomId)
                .ProjectTo<Image>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
            return Ok(images);
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

        private async Task<ImageEntity> GetImageEntityAsync(int imageId) =>
            await _hotelsDb.Images
                .FirstOrDefaultAsync(image => image.Id == imageId);

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

        private bool CheckIfHotelExists(int hotelId) =>
            _hotelsDb.Hotels.Any(hotel => hotel.Id == hotelId);

        private bool CheckIfRoomExists(int roomId) =>
            _hotelsDb.Rooms.Any(room => room.Id == roomId);
    }
}
