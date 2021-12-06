using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;

        public ImagesController(HotelsDatabaseContext hotelsDb)
        {
            _hotelsDb = hotelsDb;
        }

        [Route("{hotelId}")]//do not like such url
        [HttpPost, DisableRequestSizeLimit] //second argument maybe should not be here
        //[Authorize(Roles = Role.Admin)]
        public IActionResult AddImage([FromRoute] int hotelId) // make async
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    Image image = new Image
                    {
                        Path = dbPath,
                        HotelId = hotelId
                    };
                    _hotelsDb.Images.Add(image);
                    _hotelsDb.SaveChanges();
                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest("Something went wrong"); // hyevi bad request message
                }
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
            IEnumerable<ImageDto> images = _hotelsDb.Images
                .Where(image => image.HotelId == hotelId)
                .Select(image => new ImageDto
                {
                    Id = image.Id,
                    Path = image.Path
                });
            return Ok(images);
        }
    }
}
