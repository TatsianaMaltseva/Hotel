using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Linq;
using System.Threading.Tasks;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;
        private readonly IOptions<UserOptions> _userOptions;

        public UsersController(IOptions<UserOptions> userOptions, HotelsDatabaseContext hotelsDb)
        {
            _userOptions = userOptions;
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
            return NoContent();
        }

        private bool CheckIfEmailUnique(string email) =>
    !       _hotelsDb.Accounts.Any(u => u.Email == email);
    }
}
