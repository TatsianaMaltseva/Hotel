using iTechArt.Hotels.Api.Models;
using iTechArt.Hotels.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly JwtService _jwtService;
        private readonly HashPasswordsService _hashPasswordsService;
        private readonly HotelsDatabaseContext _hotelsDb;

        public AuthController(
            JwtService jwtService,
            HotelsDatabaseContext hotelsDb, 
            HashPasswordsService hashPasswordsService
        )
        {
            _jwtService = jwtService;
            _hotelsDb = hotelsDb;
            _hashPasswordsService = hashPasswordsService;
        }

        [Route("login")]
        [HttpPost]
        public IActionResult Login([FromBody] Login request)
        {
            Account account = GetAccountByEmail(request.Email);
            if (account == null)
            {
                return Unauthorized();
            }
            if (!_hashPasswordsService
                .CheckIfPasswordIsCorrect(account.Password, request.Password, Convert.FromBase64String(account.Salt)))
            {
                return Unauthorized();
            }
            string token = GenerateJWT(account);
            return Ok(token);
        }

        [Route("registration")]
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegistrationAccountData request)
        {
            if (!CheckIfEmailUnique(request.Email))
            {
                return BadRequest("User is already registered with this email");
            }
            byte[] salt = _hashPasswordsService.GenerateSalt();
            var account = new Account
            {
                Email = request.Email,
                Salt = Convert.ToBase64String(salt),
                Password = _hashPasswordsService.HashPassword(request.Password, salt),
                Role = Role.Client
            };
            _hotelsDb.Add(account);
            await _hotelsDb.SaveChangesAsync();
            string token = GenerateJWT(account);
            return Ok(token);
        }

        private Account GetAccountByEmail(string email) =>
            _hotelsDb.Accounts.SingleOrDefault(u => u.Email == email);

        private bool CheckIfEmailUnique(string email) =>
            !_hotelsDb.Accounts.Any(u => u.Email == email);

        [Route("{id}")]
        [HttpGet]
        public async Task<IActionResult> GetAccountEmail([FromRoute] int Id)
        {
            string email = await _hotelsDb.Accounts
                .Where(account => account.Id == Id)
                .Select(account => account.Email)
                .SingleAsync();
            return Ok(email);
        }

        private string GenerateJWT(Account account) =>
            _jwtService.GenerateJWT(account);
    }
}