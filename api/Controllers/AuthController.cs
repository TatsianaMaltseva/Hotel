using iTechArt.Hotels.Api.Models;
using iTechArt.Hotels.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IOptions<AuthOptions> _authOptions;
        private readonly HashPasswordsService _hashPasswordsService;
        private readonly HotelsDatabaseContext _hotelsDb;

        public AuthController(
            IOptions<AuthOptions> authOptions, 
            HotelsDatabaseContext hotelsDb, 
            HashPasswordsService hashPasswordsService
        )
        {
            _authOptions = authOptions;
            _hotelsDb = hotelsDb;
            _hashPasswordsService = hashPasswordsService;
        }

        [Route("login")]
        [HttpPost]
        public IActionResult Login([FromBody]Login request)
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
            var token = GenerateJWT(account);
            return Ok(token);
        }

        [Route("registration")]
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] Login request)
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
                Role = "client"
            };
            _hotelsDb.Add(account);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAccountEmail), new { id = account.Id }, null);
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

        private string GenerateJWT(Account account)
        {
            var authParams = _authOptions.Value;

            var securityKey = authParams.GetSymmetricSecurityKey();
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>() {
                new Claim(JwtRegisteredClaimNames.Email, account.Email),
                new Claim(JwtRegisteredClaimNames.Sub, account.Id.ToString()),
                new Claim("role", account.Role.ToString())
            };

            var token = new JwtSecurityToken(
                authParams.Issuer,
                authParams.Audience,
                claims,
                expires: DateTime.Now.Add(authParams.ExpireTime),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}