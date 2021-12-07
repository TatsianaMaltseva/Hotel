﻿using iTechArt.Hotels.Api.Models;
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

        public AccountsController(
            HotelsDatabaseContext hotelsDb, 
            HashPasswordsService hashPasswordsService,
            JwtService jwtService    
        )
        {
            _hotelsDb = hotelsDb;
            _hashPasswordsService = hashPasswordsService;
            _jwtService = jwtService;
        }

        [HttpPost]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> CreateAccount([FromBody] RegistrationAccountData request)
        {
            if (!CheckIfEmailUnique(request.Email))
            {
                return BadRequest("User is already registered with this email");
            }
            byte[] salt = _hashPasswordsService.GenerateSalt();
            Account account = new Account
            {
                Email = request.Email,
                Salt = Convert.ToBase64String(salt),
                Password = _hashPasswordsService.HashPassword(request.Password, salt),
                Role = Role.Admin
            };
            await _hotelsDb.AddAsync(account);
            await _hotelsDb.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAccountEmail), new { id = account.Id }, null);
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

        [Route("{id}")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> ChangeAccountPassword([FromRoute] int id, [FromBody] ChangePassword request)
        {
            if (request.NewPassword == null)
            {
                return BadRequest("No new password");
            }

            Account account = await GetAccountById(id);

            if (account == null)
            {
                return BadRequest("Such account does not exist");
            }

            if (!_hashPasswordsService
                .CheckIfPasswordIsCorrect(account.Password, request.OldPassword, Convert.FromBase64String(account.Salt)))
            {
                return BadRequest("You entered wrong old password");
            }

            string newPasswordHashed = _hashPasswordsService.HashPassword(request.NewPassword, Convert.FromBase64String(account.Salt));

            if (account.Password == newPasswordHashed)
            {
                return BadRequest("New password can not be the same as old one");
            }

            account.Password = newPasswordHashed;
            await _hotelsDb.SaveChangesAsync();
            string token = GenerateJWT(account);
            return Ok(token);
        }

        private async Task<Account> GetAccountById(int id) =>
            await _hotelsDb.Accounts
                .Where(account => account.Id == id)
                .SingleAsync();

        private bool CheckIfEmailUnique(string email) =>
            !_hotelsDb.Accounts.Any(u => u.Email == email);

        private string GenerateJWT(Account account) =>
            _jwtService.GenerateJWT(account);
    }
}