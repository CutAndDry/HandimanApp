using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;

namespace HandimanApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AccountsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AccountsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("me")]
        public async Task<ActionResult<Account>> GetMyAccount()
        {
            // In a real app, get from JWT claims
            var accounts = await _context.Accounts.FirstOrDefaultAsync();
            if (accounts == null)
                return NotFound();
            return Ok(accounts);
        }

        [HttpPost("setup")]
        public async Task<ActionResult<Account>> SetupAccount(SetupAccountRequest request)
        {
            var account = new Account
            {
                OwnerId = request.OwnerId,
                BusinessName = request.BusinessName,
                BusinessType = request.BusinessType,
                SubscriptionTier = "professional",
                MaxTeamMembers = 10,
                CurrentTeamMembers = 1,
                HourlyRate = request.HourlyRate,
                TaxRate = request.TaxRate,
                BusinessAddress = request.BusinessAddress,
                BusinessCity = request.BusinessCity,
                BusinessState = request.BusinessState,
                BusinessPostalCode = request.BusinessPostalCode,
                BusinessPhone = request.BusinessPhone,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMyAccount), account);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAccount(Guid id, UpdateAccountRequest request)
        {
            var account = await _context.Accounts.FindAsync(id);
            if (account == null)
                return NotFound();

            account.BusinessName = request.BusinessName ?? account.BusinessName;
            account.HourlyRate = request.HourlyRate ?? account.HourlyRate;
            account.TaxRate = request.TaxRate ?? account.TaxRate;
            account.BusinessAddress = request.BusinessAddress ?? account.BusinessAddress;
            account.BusinessCity = request.BusinessCity ?? account.BusinessCity;
            account.BusinessState = request.BusinessState ?? account.BusinessState;
            account.BusinessPhone = request.BusinessPhone ?? account.BusinessPhone;
            account.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(account);
        }

        [HttpGet("{id}/team")]
        public async Task<ActionResult<IEnumerable<TeamMember>>> GetTeam(Guid id)
        {
            var team = await _context.TeamMembers
                .Where(t => t.AccountId == id)
                .Include(t => t.User)
                .ToListAsync();
            return Ok(team);
        }

        [HttpPost("{id}/team")]
        public async Task<ActionResult<TeamMember>> AddTeamMember(Guid id, AddTeamMemberRequest request)
        {
            var account = await _context.Accounts.FindAsync(id);
            if (account == null)
                return NotFound();

            var member = new TeamMember
            {
                AccountId = id,
                UserId = request.UserId,
                Role = request.Role,
                HourlyRate = request.HourlyRate,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.TeamMembers.Add(member);
            account.CurrentTeamMembers++;
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTeam", new { id }, member);
        }
    }

    public class SetupAccountRequest
    {
        public Guid OwnerId { get; set; }
        public string BusinessName { get; set; }
        public string BusinessType { get; set; }
        public decimal? HourlyRate { get; set; }
        public decimal TaxRate { get; set; }
        public string? BusinessAddress { get; set; }
        public string? BusinessCity { get; set; }
        public string? BusinessState { get; set; }
        public string? BusinessPostalCode { get; set; }
        public string? BusinessPhone { get; set; }
    }

    public class UpdateAccountRequest
    {
        public string? BusinessName { get; set; }
        public decimal? HourlyRate { get; set; }
        public decimal? TaxRate { get; set; }
        public string? BusinessAddress { get; set; }
        public string? BusinessCity { get; set; }
        public string? BusinessState { get; set; }
        public string? BusinessPhone { get; set; }
    }

    public class AddTeamMemberRequest
    {
        public Guid UserId { get; set; }
        public UserRole Role { get; set; }
        public decimal HourlyRate { get; set; }
    }
}
