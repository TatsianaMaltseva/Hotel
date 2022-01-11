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
        public async Task<IActionResult> AddHotel([FromBody] HotelToAdd request)
        {
            HotelEntity hotel = _mapper.Map<HotelEntity>(request);
            await _hotelsDb.AddAsync(hotel);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtAction(nameof(GetHotel), new { hotelId = hotel.Id }, null);
        }

        [Route("{hotelId}")]
        [HttpPatch]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> ChangeHotel([FromRoute] int hotelId, [FromBody] HotelToEdit request)
        {
            HotelEntity hotelEntity = await GetHotelEntityAsync(hotelId);
            if (hotelEntity == null)
            {
                return BadRequest("Such hotel does not exist");
            }
            _mapper.Map(request, hotelEntity);
            await _hotelsDb.SaveChangesAsync();
            return NoContent();
        }

        [Route("{hotelId}/rooms/{roomId}")]
        [HttpPatch]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> ChangeRoom([FromRoute] int hotelId, [FromRoute] int roomId, [FromBody] RoomToEdit request)
        {
            if (await GetHotelEntityAsync(hotelId) == null)
            {
                return BadRequest("Such hotel does not exist");
            }
            RoomEntity roomEntity = await GetRoomEntityAsync(roomId);
            if (roomEntity == null)
            {
                return BadRequest("Such room does not exist");
            }
            _mapper.Map(request, roomEntity);
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
            if (hotel == null)
            {
                return NotFound($"Hotel with {hotelId} id does not exist");
            }
            return Ok(hotel);
        }


        [HttpGet]
        public async Task<IActionResult> GetHotelCards(
            [FromQuery] PageParameters pageParameters,
            [FromQuery] HotelFilterParameters filterParams
        )
        {
            var filteredHotelCards = _hotelsDb.Hotels.AsQueryable();
            if (!string.IsNullOrEmpty(filterParams.Name))
            {
                filteredHotelCards = filteredHotelCards.Where(h => h.Name.Contains(filterParams.Name));
            }
            var hotelCount = await filteredHotelCards.CountAsync();
            HotelCard[] hotelCards = await filteredHotelCards
                .Skip(pageParameters.PageIndex * pageParameters.PageSize)
                .Take(pageParameters.PageSize)
                .ProjectTo<HotelCard>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
            return Ok(new { hotelCards, hotelCount });
        }

        [Route("names")]
        [HttpGet]
        public async Task<IActionResult> GetHotelNames([FromQuery] string name, [FromQuery] int number = 2)
        {
            if (string.IsNullOrEmpty(name))
            {
                return NoContent();
            }
            string[] names = await _hotelsDb.Hotels
                .Where(h => h.Name.Contains(name))
                .OrderBy(h => h.Name)
                .Distinct()
                .Take(number)
                .Select(h => h.Name)
                .ToArrayAsync();
            return Ok(names);
        }

        [Route("{hotelId}/images")]
        [Route("{hotelId}/rooms/{roomId}/images")]
        [HttpPost]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> AddImage([FromRoute] int hotelId, [FromRoute] int? roomId)
        {
            if (await GetHotelEntityAsync(hotelId) == null)
            {
                return BadRequest("Such hotel does not exist");
            }

            if (roomId != null && await GetRoomEntityAsync(roomId) == null)
            {
                return BadRequest("Such room does not exist");
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
                Hotel = await GetHotelEntityAsync(hotelId),
                IsOuterLink = false,
            };

            if (roomId != null)
            {
                var room = await GetRoomEntityAsync(roomId);
                image.RoomId = roomId;
                image.Room = room;
            }
            await _hotelsDb.Images.AddAsync(image);
            await _hotelsDb.SaveChangesAsync();

            if (image.RoomId == null)
            {
                return CreatedAtAction(nameof(GetImage), new { hotelId = image.Hotel.Id, imageId = image.Id }, image.Id);
            }
            return CreatedAtAction(nameof(GetImage), new { hotelId = image.Hotel.Id, roomId = image.RoomId, imageId = image.Id }, image.Id);
        }

        [Route("{hotelId}/images")]
        [Route("{hotelId}/rooms/{roomId}/images")]
        [HttpGet]
        public async Task<IActionResult> GetImages([FromRoute] int hotelId, [FromRoute] int? roomId)
        {
            if (await GetHotelEntityAsync(hotelId) == null)
            {
                return BadRequest("Such hotel does not exist");
            }
            var imagesForHotel = _hotelsDb.Images.Where(image => image.HotelId == hotelId);
            if (roomId != null && await GetRoomEntityAsync(roomId) == null)
            {
                return BadRequest("Such room does not exist");
            }
            var imagesForRoom = imagesForHotel.Where(image => image.RoomId == roomId);
            var imagesToReturn = await imagesForRoom
                .ProjectTo<Image>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
            return Ok(imagesToReturn);
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

        [Route("{hotelId}/rooms/{roomId}")]
        [HttpDelete]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> DeleteRoom([FromRoute] int roomId)
        {
            RoomEntity room = await GetRoomEntityAsync(roomId);
            if (room == null)
            {
                return BadRequest("Such room does not exist");
            }
            _hotelsDb.Rooms.Remove(room);
            var roomImages = _hotelsDb.Images.Where(image => image.RoomId == roomId).AsQueryable();
            _hotelsDb.Images.RemoveRange(roomImages);
            await _hotelsDb.SaveChangesAsync();
            return NoContent();
        }

        [Route("{hotelId}/rooms")]
        [HttpGet]
        public async Task<IActionResult> GetRooms([FromRoute] int hotelId)
        {
            Room[] rooms = await _hotelsDb.Rooms
                .Where(r => r.HotelId == hotelId)
                .ProjectTo<Room>(_mapper.ConfigurationProvider)
                .ToArrayAsync();
            return Ok(rooms);
        }

        [Route("{hotelId}/rooms")]
        [HttpPost]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> AddRoom([FromRoute] int hotelId, [FromBody] RoomToAdd request)
        {
            RoomEntity room = _mapper.Map<RoomEntity>(request);
            room.HotelId = hotelId;
            await _hotelsDb.AddAsync(room);
            await _hotelsDb.SaveChangesAsync();
            return Ok();// CreatedAtAction(nameof(GetRoom), new { hotelId, roomId = room.Id }, null);
        }

        [Route("{hotetId}/rooms/{roomId}")]
        [HttpGet]
        public async Task<IActionResult> GetRoom([FromRoute] int roomId)
        {
            Room room  = await _hotelsDb.Rooms
                .Where(room => room.Id == roomId)
                .ProjectTo<Room>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
            return Ok(room);
        }

        private async Task<HotelEntity> GetHotelEntityAsync(int hotelId) =>
            await _hotelsDb.Hotels
                .FirstOrDefaultAsync(hotel => hotel.Id == hotelId);

        private async Task<ImageEntity> GetImageEntityAsync(int imageId) =>
            await _hotelsDb.Images
                .FirstOrDefaultAsync(image => image.Id == imageId);

        private async Task<RoomEntity> GetRoomEntityAsync(int? roomId) =>
            await _hotelsDb.Rooms
                .FirstOrDefaultAsync(room => room.Id == roomId);
    }
}