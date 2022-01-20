using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.JoinEntities;
using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static iTechArt.Hotels.Api.Constants;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api")]
    [ApiController]
    public class OrdersController : Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;

        public OrdersController(HotelsDatabaseContext hotelDb)
        {
            _hotelsDb = hotelDb;
        }

        [Route("orders")]
        [HttpPost]
        [Authorize(Roles = Role.Client)]
        public decimal CalculateOrderPrice(OrderToAdd order)
        {
            //get price for room and facilties from db
            decimal totalPrice = order.Room.Price;
            foreach (Facility facility in order.Room.Facilities)
            {
                if (facility.Checked)
                {
                    totalPrice += facility.Price;
                }
            }

            return totalPrice;
        }

        [Route("accounts/{accountId}/orders")]
        [HttpPost]
        [Authorize(Roles = Role.Client)]
        public async Task<IActionResult> AddOrder([FromRoute] int accountId, [FromBody] OrderToAdd order)
        {
            //validate everything!!
            OrderEntity orderEntity = new()
            {
                RoomId = order.Room.Id,
                AccountId = accountId,
                Price = CalculateOrderPrice(order)
            };

            foreach (Facility facility in order.Room.Facilities)
            {
                FacilityOrderEntity facilityOrder = new()
                {
                    FacilityId = facility.Id,
                    OrderId = orderEntity.Id
                };
                orderEntity.FacilityOrders.Add(facilityOrder);
            }

            await _hotelsDb.AddAsync(orderEntity);
            await _hotelsDb.SaveChangesAsync();
            return Ok(); //createdAtAction
        }

        private Task<RoomEntity> GetRoomEntityAsync(int roomId) =>
            _hotelsDb.Rooms
               .FirstOrDefaultAsync(room => room.Id == roomId);

        private Task<FacilityHotelEntity[]> GetFacilityHotelsAsync(int hotelId) =>
            _hotelsDb.FacilityHotel
                .Where(fh => fh.HotelId == hotelId)
                .ToArrayAsync();

    }
}
