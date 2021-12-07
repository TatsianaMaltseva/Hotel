using iTechArt.Hotels.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;
        private readonly ImageService _imageService;

        public ImagesController(
            HotelsDatabaseContext hotelsDb,
            ImageService imageService
        )
        {
            _hotelsDb = hotelsDb;
            _imageService = imageService;
        }

        [Route("{hotelId}")]//do not like such url
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

        [Route("{hotelId}")]
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