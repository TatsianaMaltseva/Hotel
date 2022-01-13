using AutoMapper;
using AutoMapper.QueryableExtensions;
using iTechArt.Hotels.Api.Entities;
using iTechArt.Hotels.Api.Models;
using iTechArt.Hotels.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace iTechArt.Hotels.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : Controller
    {
        private readonly HotelsDatabaseContext _hotelsDb;
        private readonly HashPasswordsService _hashPasswordsService;
        private readonly JwtService _jwtService;
        private readonly IMapper _mapper;

        public AccountsController(
            HotelsDatabaseContext hotelsDb, 
            HashPasswordsService hashPasswordsService,
            JwtService jwtService,
            IMapper mapper
        )
        {
            _hotelsDb = hotelsDb;
            _hashPasswordsService = hashPasswordsService;
            _jwtService = jwtService;
            _mapper = mapper;
        }

        [HttpPost]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> CreateAccount([FromBody] Account request)
        {
            if (!!CheckIfEmailUnique(request.Email))
            {
                return BadRequest("User is already registered with this email");
            }
            byte[] salt = _hashPasswordsService.GenerateSalt();
            AccountEntity account = new()
            {
                Email = request.Email,
                Salt = Convert.ToBase64String(salt),
                Password = _hashPasswordsService.HashPassword(request.Password, salt),
                Role = Role.Admin
            };
            await _hotelsDb.AddAsync(account);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAccount), new { id = account.Id }, null);
        }

        [Route("{id}")]
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAccount([FromRoute] int Id)
        {
            Account account = await _hotelsDb.Accounts
                .Where(account => account.Id == Id)
                .ProjectTo<Account>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
            return Ok(account);
        }

        [Route("{id}")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> ChangeAccountPassword([FromBody] AccountPasswordToEdit request)
        {
            int id = Convert.ToInt32(User.Identity.Name);

            AccountEntity account = await GetAccountById(id);

            if (!_hashPasswordsService
                .CheckIfPasswordIsCorrect(account.Password, request.OldPassword, Convert.FromBase64String(account.Salt)))
            {
                return BadRequest("Wrong old password");
            }

            string newPasswordHashed = _hashPasswordsService.HashPassword(request.NewPassword, Convert.FromBase64String(account.Salt));

            if (account.Password == newPasswordHashed)
            {
                return BadRequest("New password can not be the same as old one");
            }

            account.Password = newPasswordHashed;
            await _hotelsDb.SaveChangesAsync();
            return Ok();
        }

        private async Task<AccountEntity> GetAccountById(int id) =>
            await _hotelsDb.Accounts
                .Where(account => account.Id == id)
                .FirstOrDefaultAsync();

        private bool CheckIfEmailUnique(string email) =>
            !_hotelsDb.Accounts.Any(u => u.Email == email);

        private string GenerateJWT(AccountEntity account) =>
            _jwtService.GenerateJWT(account);
    }
}