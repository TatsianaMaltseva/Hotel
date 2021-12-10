using iTechArt.Hotels.Api.Services;
﻿using AutoMapper;
using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Reflection;

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
        public async Task<IActionResult> CreateHotel([FromBody] AddHotelRepresentation request)
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
        public async Task<IActionResult> EditHotel([FromRoute] int id, [FromBody] EditHotelRepresentation request)
        {
            HotelEntity hotelEntity = await GetHotelService(id);
            _mapper.Map(request, hotelEntity);
            await _hotelsDb.SaveChangesAsync();
            return NoContent();
            //if mistake return 409
        }

        [Route("{id}")]
        [HttpGet]
        public async Task<IActionResult> GetHotel([FromRoute] int id)
        {
            HotelEntity hotelEntity = await _hotelsDb.Hotels.SingleOrDefaultAsync(h => h.Id == id);
            HotelRepresentation hotel = _mapper.Map<HotelRepresentation>(hotelEntity);
            return Ok(hotel);
        }

        private async Task<HotelEntity> GetHotelService(int id) // put into hotel service + async in naming
        {
            HotelEntity hotelEntity = await _hotelsDb.Hotels.SingleOrDefaultAsync(h => h.Id == id);
            return hotelEntity;
        }

        [HttpGet]
        public async Task<IActionResult> GetHotelCards([FromQuery] PageParameters pageParameters)
        {
            if (pageParameters == null)
            {
                return BadRequest("No page parameters");
            }

            IEnumerable<HotelEntity> hotelEntities = await _hotelsDb.Hotels
                .Skip(pageParameters.PageIndex * pageParameters.PageSize)
                .Take(pageParameters.PageSize)
                .ToArrayAsync();
            var hotelCards = _mapper.Map<IEnumerable<HotelCard>>(hotelEntities);
            return Ok(hotelCards);
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
                ImageEntity image = new ImageEntity
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
            IEnumerable<ImageEntity> images = _hotelsDb.Images
                .Where(image => image.HotelId == hotelId)
                .Select(image => new ImageEntity
                {
                    Path = image.Path
                });
            return Ok(images);
        }
    }
}