using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : Controller // take orders from db in future
    {
        private readonly OrdersDb orders;
        private readonly HotelsDb hotels;
        private int UserId => int.Parse(User.Claims.Single(c => c.Type == ClaimTypes.NameIdentifier).Value);

        public OrdersController(OrdersDb orders, HotelsDb hotels)
        {
            this.orders = orders;
            this.hotels = hotels;
        }
        [HttpGet]
        [Authorize (Roles = "User")]
        [Route("")]
        public IActionResult GetOrders()
        {
            if (!orders.Orders.ContainsKey(UserId)) return Ok(Enumerable.Empty<Hotel>());

            var orderedHotelsId = orders.Orders.Single(o => o.Key == UserId).Value;
            var orderedBooks = hotels.Hotels.Where(b => orderedHotelsId.Contains(b.Id));
            return Ok(orderedBooks);
        }
    }
}
