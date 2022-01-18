using iTechArt.Hotels.Api.Entities;
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
        private readonly HotelsDatabaseContext _hotelsDb;
        private readonly HashPasswordsService _hashPasswordsService;
        private readonly JwtService _jwtService;

        public AuthController(
            HotelsDatabaseContext hotelsDb, 
            HashPasswordsService hashPasswordsService,
            JwtService jwtService
        )
        {
            _hotelsDb = hotelsDb;
            _hashPasswordsService = hashPasswordsService;
            _jwtService = jwtService;
        }

        [Route("login")]
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] Login request)
        {
            AccountEntity account = await GetAccountByEmailAsync(request.Email);
            if (account == null)
            {
                return BadRequest("Wrong credentials");
            }
            if (!_hashPasswordsService
                .CheckIfPasswordIsCorrect(account.Password, request.Password, Convert.FromBase64String(account.Salt)))
            {
                return BadRequest("Wrong credentials");
            }
            string token = _jwtService.GenerateJWT(account);
            return Ok(token);
        }

        [Route("registration")]
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] Account request)
        {
            if (!await CheckIfEmailUnique(request.Email))
            {
                return BadRequest("User is already registered with this email");
            }
            byte[] salt = _hashPasswordsService.GenerateSalt();
            AccountEntity account = new AccountEntity
            {
                Email = request.Email,
                Salt = Convert.ToBase64String(salt),
                Password = _hashPasswordsService.HashPassword(request.Password, salt),
                Role = Role.Client
            };
            await _hotelsDb.AddAsync(account);
            await _hotelsDb.SaveChangesAsync();
            string token = _jwtService.GenerateJWT(account);
            return Ok(token);
        }

        private Task<AccountEntity> GetAccountByEmailAsync(string email) =>
            _hotelsDb.Accounts.SingleOrDefaultAsync(u => u.Email == email);

        private async Task<bool> CheckIfEmailUnique(string email) =>
            !await _hotelsDb.Accounts.AnyAsync(u => u.Email == email);

        [Route("{id}")]
        [HttpGet]
        public async Task<IActionResult> GetAccountEmailAsync([FromRoute] int Id)
        {
            string email = await _hotelsDb.Accounts
                .Where(account => account.Id == Id)
                .Select(account => account.Email)
                .SingleAsync();
            return Ok(email);
        }
    }
}