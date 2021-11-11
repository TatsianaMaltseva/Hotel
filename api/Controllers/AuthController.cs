using iTechArt.Hotels.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        private readonly HotelsDatabaseContext _hotelsDb;

        public AuthController(IOptions<AuthOptions> authOptions, HotelsDatabaseContext hotelsDb)
        {
            _authOptions = authOptions;
            _hotelsDb = hotelsDb;
        }

        [Route("login")]
        [HttpPost]
        public IActionResult Login([FromBody]Login request)
        {
            var user = GetAccount(request.Email, request.Password);
            if (user == null)
            {
                return Unauthorized();
            }
            var token = GenerateJWT(user);
            return Ok(token);
        }

        [Route("registration")]
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

        private Account GetAccount(string email, string password) =>
            _hotelsDb.Accounts.SingleOrDefault(u => u.Email == email && u.Password == password);

        private bool CheckIfEmailUnique(string email) =>
            _hotelsDb.Accounts.SingleOrDefault(u => u.Email == email) == null;

        private string GenerateJWT(Account user)
        {
            var authParams = _authOptions.Value;

            var securityKey = authParams.GetSymmetricSecurityKey();
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>() {
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
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
