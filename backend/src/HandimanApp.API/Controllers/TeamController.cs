using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;
using System.Security.Claims;

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

        /// <summary>
        /// Get all team members for an account
        /// </summary>
        [HttpGet("members")]
        public async Task<ActionResult<IEnumerable<TeamMemberResponse>>> GetMembers([FromQuery] Guid? accountId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim?.Value, out var userId))
                return Unauthorized();

            var query = _context.TeamMembers
                .Include(t => t.User)
                .AsQueryable();

            if (accountId.HasValue)
                query = query.Where(t => t.AccountId == accountId && t.DeletedAt == null);
            else
                query = query.Where(t => t.DeletedAt == null);

            var members = await query
                .Select(m => new TeamMemberResponse
                {
                    Id = m.Id,
                    Email = m.Email,
                    FirstName = m.User!.FirstName,
                    LastName = m.User.LastName,
                    Role = m.Role,
                    HourlyRate = m.HourlyRate,
                    IsActive = m.IsActive,
                    IsInviteAccepted = m.IsInviteAccepted,
                    InviteAcceptedAt = m.InviteAcceptedAt,
                    CreatedAt = m.CreatedAt
                })
                .ToListAsync();

            return Ok(members);
        }

        /// <summary>
        /// Invite a new team member to the account
        /// </summary>
        [HttpPost("members/invite")]
        public async Task<ActionResult<object>> InviteTeamMember([FromBody] InviteTeamMemberRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || request.AccountId == Guid.Empty)
                return BadRequest("Email and AccountId are required");

            var account = await _context.Accounts.FindAsync(request.AccountId);
            if (account == null)
                return NotFound("Account not found");

            // Check if already a team member
            var existingMember = await _context.TeamMembers
                .FirstOrDefaultAsync(t => t.Email == request.Email && t.AccountId == request.AccountId && t.DeletedAt == null);

            if (existingMember != null && existingMember.IsInviteAccepted)
                return BadRequest("This user is already a team member");

            var inviteToken = Guid.NewGuid().ToString();
            
            var teamMember = new TeamMember
            {
                AccountId = request.AccountId,
                Email = request.Email,
                Role = request.Role,
                HourlyRate = request.HourlyRate ?? 0,
                InviteToken = inviteToken,
                IsInviteAccepted = false,
                InviteSentAt = DateTime.UtcNow,
                UserId = Guid.Empty // Will be set when invite is accepted
            };

            _context.TeamMembers.Add(teamMember);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = teamMember.Id,
                email = teamMember.Email,
                inviteToken = inviteToken,
                message = "Invite sent successfully. User should accept the invite to join the team."
            });
        }

        /// <summary>
        /// Accept team invite (used by new team members)
        /// </summary>
        [HttpPost("members/accept-invite")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> AcceptTeamInvite([FromBody] AcceptInviteRequest request)
        {
            var teamMember = await _context.TeamMembers
                .FirstOrDefaultAsync(t => t.InviteToken == request.InviteToken && !t.IsInviteAccepted && t.DeletedAt == null);

            if (teamMember == null)
                return NotFound("Invalid or expired invite");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == teamMember.Email);
            if (user == null)
            {
                // Create new user if doesn't exist
                user = new User
                {
                    Email = teamMember.Email,
                    FirstName = request.FirstName ?? "",
                    LastName = request.LastName ?? "",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    IsActive = true,
                    Role = teamMember.Role
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            teamMember.UserId = user.Id;
            teamMember.IsInviteAccepted = true;
            teamMember.InviteAcceptedAt = DateTime.UtcNow;
            teamMember.InviteToken = null;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Invite accepted successfully", userId = user.Id });
        }

        /// <summary>
        /// Get single team member details
        /// </summary>
        [HttpGet("members/{id}")]
        public async Task<ActionResult<TeamMemberResponse>> GetMember(Guid id)
        {
            var member = await _context.TeamMembers
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Id == id && t.DeletedAt == null);

            if (member == null)
                return NotFound();

            var response = new TeamMemberResponse
            {
                Id = member.Id,
                Email = member.Email,
                FirstName = member.User?.FirstName ?? "",
                LastName = member.User?.LastName ?? "",
                Role = member.Role,
                HourlyRate = member.HourlyRate,
                IsActive = member.IsActive,
                IsInviteAccepted = member.IsInviteAccepted,
                InviteAcceptedAt = member.InviteAcceptedAt,
                CreatedAt = member.CreatedAt
            };

            return Ok(response);
        }

        /// <summary>
        /// Update team member role and hourly rate
        /// </summary>
        [HttpPut("members/{id}")]
        public async Task<ActionResult<object>> UpdateMember(Guid id, [FromBody] UpdateTeamMemberRequest request)
        {
            var member = await _context.TeamMembers.FindAsync(id);
            if (member == null || member.DeletedAt != null)
                return NotFound();

            if (request.Role.HasValue)
                member.Role = request.Role.Value;

            if (request.HourlyRate.HasValue)
                member.HourlyRate = request.HourlyRate.Value;

            if (request.IsActive.HasValue)
                member.IsActive = request.IsActive.Value;

            member.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Team member updated successfully" });
        }

        /// <summary>
        /// Remove team member from account (soft delete)
        /// </summary>
        [HttpDelete("members/{id}")]
        public async Task<IActionResult> DeleteMember(Guid id)
        {
            var member = await _context.TeamMembers.FindAsync(id);
            if (member == null)
                return NotFound();

            // Soft delete
            member.DeletedAt = DateTime.UtcNow;
            member.IsActive = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Get team analytics (total members, roles, revenue by team member)
        /// </summary>
        [HttpGet("analytics")]
        public async Task<ActionResult<object>> GetTeamAnalytics([FromQuery] Guid accountId)
        {
            var teamMembers = await _context.TeamMembers
                .Where(t => t.AccountId == accountId && t.DeletedAt == null && t.IsInviteAccepted)
                .Include(t => t.AssignedJobs)
                .ToListAsync();

            var analytics = new
            {
                totalMembers = teamMembers.Count,
                adminCount = teamMembers.Count(t => t.Role == UserRole.Admin),
                managerCount = teamMembers.Count(t => t.Role == UserRole.Manager),
                employeeCount = teamMembers.Count(t => t.Role == UserRole.Employee),
                totalHourlyRate = teamMembers.Sum(t => t.HourlyRate),
                averageHourlyRate = teamMembers.Count > 0 ? teamMembers.Average(t => t.HourlyRate) : 0,
                memberDetails = teamMembers.Select(m => new
                {
                    id = m.Id,
                    name = $"{m.User?.FirstName} {m.User?.LastName}",
                    email = m.Email,
                    role = m.Role,
                    hourlyRate = m.HourlyRate,
                    assignedJobs = m.AssignedJobs.Count,
                    completedJobs = m.AssignedJobs.Count(j => j.Status == "completed")
                })
            };

            return Ok(analytics);
        }
    }

    // DTOs
    public class TeamMemberResponse
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public decimal HourlyRate { get; set; }
        public bool IsActive { get; set; }
        public bool IsInviteAccepted { get; set; }
        public DateTime? InviteAcceptedAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class InviteTeamMemberRequest
    {
        public Guid AccountId { get; set; }
        public string Email { get; set; } = string.Empty;
        public UserRole Role { get; set; } = UserRole.Employee;
        public decimal? HourlyRate { get; set; }
    }

    public class AcceptInviteRequest
    {
        public string InviteToken { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
    }

    public class UpdateTeamMemberRequest
    {
        public UserRole? Role { get; set; }
        public decimal? HourlyRate { get; set; }
        public bool? IsActive { get; set; }
    }
}

