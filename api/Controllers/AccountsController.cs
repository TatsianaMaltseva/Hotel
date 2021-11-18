using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Linq;
using System.Threading.Tasks;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;

        public AccountsController(HotelsDatabaseContext hotelsDb)
        {
            _hotelsDb = hotelsDb;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateAccount([FromBody] Login request)
        {
            if (!CheckIfEmailUnique(request.Email))
            {
                return BadRequest("User is already registered with this email");
            }
            var user = new Account
            {
                Email = request.Email,
                Password = request.Password
            };
            _hotelsDb.Add(user);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtRoute(
                routeName: "GetLink",
                routeValues: new { id = user.Id },
                value: user);
        }

        [Route("{id}")]
        [HttpGet("{id}", Name = "GetLink")]
        [Authorize]
        public async Task<Account> GetAccount([FromRoute] int Id) =>
            await _hotelsDb.Accounts.SingleOrDefaultAsync(account => account.Id == Id);

        private bool CheckIfEmailUnique(string email) =>
            !_hotelsDb.Accounts.Any(u => u.Email == email);

    }
}
