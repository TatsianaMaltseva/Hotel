using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Cryptography;
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
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> CreateAccount([FromBody] Login request)
        {
            if (!CheckIfEmailUnique(request.Email))
            {
                return BadRequest("User is already registered with this email");
            }
            byte[] salt = GenerateSalt();
            var user = new Account
            {
                Email = request.Email,
                Salt = Convert.ToBase64String(salt),
                Password = HashPassword(request.Password, salt),
                Role = "admin"
            };
            _hotelsDb.Add(user);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAccountEmail), new { id = user.Id }, null);
        }

        [Route("{id}")]
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAccountEmail([FromRoute] int Id)
        {
            string email = await _hotelsDb.Accounts
                .Where(account => account.Id == Id)
                .Select(account => account.Email)
                .SingleAsync();
            return Ok(email);
        }

        private bool CheckIfEmailUnique(string email) =>
            !_hotelsDb.Accounts.Any(u => u.Email == email);

        private byte[] GenerateSalt()
        {
            byte[] salt = new byte[128 / 8];
            using (var rngCsp = new RNGCryptoServiceProvider())
            {
                rngCsp.GetNonZeroBytes(salt);
            }
            return salt;
        }

        private string HashPassword(string password, byte[] salt)
        {
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));
            return hashed;
        }
    }
}