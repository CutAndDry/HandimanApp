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
    public class TeamController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TeamController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("members")]
        public async Task<ActionResult<IEnumerable<TeamMember>>> GetMembers([FromQuery] Guid? accountId)
        {
            var query = _context.TeamMembers.Include(t => t.User).AsQueryable();
            if (accountId.HasValue)
                query = query.Where(t => t.AccountId == accountId);

            return Ok(await query.ToListAsync());
        }

        [HttpGet("members/{id}")]
        public async Task<ActionResult<TeamMember>> GetMember(Guid id)
        {
            var member = await _context.TeamMembers
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (member == null)
                return NotFound();
            return Ok(member);
        }

        [HttpPut("members/{id}")]
        public async Task<IActionResult> UpdateMember(Guid id, UpdateTeamMemberRequest request)
        {
            var member = await _context.TeamMembers.FindAsync(id);
            if (member == null)
                return NotFound();

            member.Role = request.Role ?? member.Role;
            member.HourlyRate = request.HourlyRate ?? member.HourlyRate;
            member.IsActive = request.IsActive ?? member.IsActive;
            member.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(member);
        }

        [HttpDelete("members/{id}")]
        public async Task<IActionResult> DeleteMember(Guid id)
        {
            var member = await _context.TeamMembers.FindAsync(id);
            if (member == null)
                return NotFound();

            var account = await _context.Accounts.FindAsync(member.AccountId);
            if (account != null)
                account.CurrentTeamMembers--;

            _context.TeamMembers.Remove(member);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public class UpdateTeamMemberRequest
    {
        public string? Role { get; set; }
        public decimal? HourlyRate { get; set; }
        public bool? IsActive { get; set; }
    }
}
