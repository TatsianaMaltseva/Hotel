using api.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HotelsController : Controller // take hotels from db in future
    {
        private readonly HotelsDb hotels;
        public HotelsController(HotelsDb hotels)
        {
            this.hotels = hotels;
        }
        [HttpGet]
        [Route("")]
        public IActionResult GetAvailableBooks()
        {
            return Ok(hotels.Hotels);
        }
    }
}
