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
using System.Security.Claims;
using System.Threading.Tasks;
using static iTechArt.Hotels.Api.Constants;

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
        [Authorize(Roles = nameof(Role.Admin))]
        public async Task<IActionResult> CreateAccount([FromBody] AccountToAdd request)
        {
            if (!await CheckIfEmailUniqueAsync(request.Email))
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
            return CreatedAtAction(nameof(ChangeAccount), new { accountId = account.Id }, null);
        }

        [Route("{accountId}/password")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> ChangeAccountPassword([FromBody] AccountPasswordToEdit request)
        {
            int id = Convert.ToInt32((HttpContext.User.Identity as ClaimsIdentity)
                .FindFirst("name")
                .Value);

            AccountEntity account = await GetAccountEntityAsync(id);

            if (!_hashPasswordsService
                .CheckIfPasswordIsCorrect(account.Password, request.OldPassword, Convert.FromBase64String(account.Salt)))
            {
                return BadRequest("Wrong old password");
            }

            string newPasswordHashed = _hashPasswordsService
                .HashPassword(request.NewPassword, Convert.FromBase64String(account.Salt));

            if (account.Password == newPasswordHashed)
            {
                return BadRequest("New password can not be the same as old one");
            }

            account.Password = newPasswordHashed;
            await _hotelsDb.SaveChangesAsync();
            return Ok();
        }

        [Route("{accountId}")]
        [HttpPut]
        [Authorize(Roles = nameof(Role.Admin))]
        public async Task<IActionResult> ChangeAccount([FromRoute] int accountId, [FromBody] AccountToEdit request)
        {
            AccountEntity account = await GetAccountEntityAsync(accountId);
            if (account == null)
            {
                return BadRequest("Such account does not exist");
            }
            _mapper.Map(request, account);
            if (!string.IsNullOrWhiteSpace(request.Password))
            {
                if (request.Password.Length < ValidationParams.Account.PasswordMinLength)
                {
                    return BadRequest($"Password is required to have at least {ValidationParams.Account.PasswordMinLength} symbols");
                }    
                account.Password = _hashPasswordsService
                    .HashPassword(request.Password, Convert.FromBase64String(account.Salt));
            }
            await _hotelsDb.SaveChangesAsync();
            return Ok();
        }

        [HttpGet]
        [Authorize(Roles = nameof(Role.Admin))]
        public async Task<IActionResult> GetAccounts([FromQuery] PageParameters pageParameters, [FromQuery] AccountFilterParams filterParams)
        {
            var filteredAccounts = _hotelsDb.Accounts
                .AsQueryable()
                .AsNoTracking();

            if (filterParams.Id.HasValue)
            {
                filteredAccounts = filteredAccounts
                    .Where(account => account.Id == filterParams.Id);
            }
            if (!string.IsNullOrEmpty(filterParams.Email))
            {
                filteredAccounts = filteredAccounts
                    .Where(account => account.Email
                        .Contains(filterParams.Email));
            }
            if (filterParams.Role.HasValue)
            {
                filteredAccounts = filteredAccounts
                    .Where(account => account.Role == filterParams.Role);
            }

            var accounts = await filteredAccounts.Skip(pageParameters.PageIndex * pageParameters.PageSize)
                .Take(pageParameters.PageSize)
                .OrderBy(account => account.Id)
                .ProjectTo<Account>(_mapper.ConfigurationProvider)
                .ToListAsync();

            int accountCount = await filteredAccounts.CountAsync();

            return Ok(new { accountCount, accounts });
        }

        [Route("{accountId}")]
        [HttpDelete]
        [Authorize(Roles = nameof(Role.Admin))]
        public async Task<IActionResult> DeleteAccount([FromRoute] int accountId)
        {
            AccountEntity account = await GetAccountEntityAsync(accountId);
            if (account == null)
            {
                return BadRequest("Such account does not exist");
            }

            _hotelsDb.Accounts.Remove(account);
            await _hotelsDb.SaveChangesAsync();
            return NoContent();
        }

        private Task<AccountEntity> GetAccountEntityAsync(int accountId) =>
            _hotelsDb.Accounts
                .Where(account => account.Id == accountId)
                .FirstOrDefaultAsync();

        private async Task<bool> CheckIfEmailUniqueAsync(string email) =>
            !await _hotelsDb.Accounts.AnyAsync(u => u.Email == email);
    }
}