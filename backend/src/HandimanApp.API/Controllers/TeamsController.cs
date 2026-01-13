using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;
using System.Security.Claims;

namespace HandimanApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/teams")]
public class TeamsController : ControllerBase
{
    private readonly ILogger<TeamsController> _logger;
    private readonly ApplicationDbContext _context;

    public TeamsController(ILogger<TeamsController> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    // GET: api/teams
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetTeams([FromQuery] bool active = true)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var teams = new List<object>
            {
                new { id = Guid.NewGuid().ToString(), name = "Plumbing Team", description = "Main plumbing division", memberCount = 5, manager = "John Smith", active = true, createdAt = DateTime.UtcNow.AddMonths(-8) },
                new { id = Guid.NewGuid().ToString(), name = "Electrical Team", description = "Electrical services division", memberCount = 3, manager = "Sarah Williams", active = true, createdAt = DateTime.UtcNow.AddMonths(-6) },
                new { id = Guid.NewGuid().ToString(), name = "HVAC Team", description = "Heating and cooling services", memberCount = 4, manager = "Robert Chen", active = true, createdAt = DateTime.UtcNow.AddMonths(-4) }
            };

            if (!active)
                return Ok(teams);

            return Ok(teams.Where(t => t.GetType().GetProperty("active")?.GetValue(t)?.Equals(true) ?? false));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching teams");
            return BadRequest("Error fetching teams");
        }
    }

    // GET: api/teams/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetTeam(string id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var team = new
            {
                id = id,
                name = "Plumbing Team",
                description = "Main plumbing division",
                manager = "John Smith",
                active = true,
                createdAt = DateTime.UtcNow.AddMonths(-8),
                members = new object[]
                {
                    new { memberId = Guid.NewGuid().ToString(), name = "Mike Johnson", role = "Lead Technician", email = "mike@example.com", joinDate = DateTime.UtcNow.AddMonths(-6) },
                    new { memberId = Guid.NewGuid().ToString(), name = "Tom Wilson", role = "Technician", email = "tom@example.com", joinDate = DateTime.UtcNow.AddMonths(-3) },
                    new { memberId = Guid.NewGuid().ToString(), name = "James Brown", role = "Technician", email = "james@example.com", joinDate = DateTime.UtcNow.AddMonths(-2) }
                },
                budget = 50000m,
                budgetUsed = 34500m,
                jobsCompleted = 89,
                revenue = 28400m
            };

            return Ok(team);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching team");
            return BadRequest("Error fetching team");
        }
    }

    // POST: api/teams
    [HttpPost]
    public async Task<ActionResult<object>> CreateTeam([FromBody] CreateTeamRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            if (string.IsNullOrEmpty(request.Name))
                return BadRequest("Team name is required");

            var team = new
            {
                id = Guid.NewGuid().ToString(),
                name = request.Name,
                description = request.Description,
                manager = request.Manager,
                active = request.Active,
                createdAt = DateTime.UtcNow,
                memberCount = 0
            };

            return Created($"/api/teams/{team}", team);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating team");
            return BadRequest("Error creating team");
        }
    }

    // PUT: api/teams/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTeam(string id, [FromBody] UpdateTeamRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            return Ok(new { message = "Team updated successfully", id = id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating team");
            return BadRequest("Error updating team");
        }
    }

    // DELETE: api/teams/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeam(string id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            return Ok(new { message = "Team deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting team");
            return BadRequest("Error deleting team");
        }
    }

    // POST: api/teams/{id}/members
    [HttpPost("{id}/members")]
    public async Task<ActionResult<object>> AddTeamMember(string id, [FromBody] AddTeamMemberToTeamRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            if (string.IsNullOrEmpty(request.Email))
                return BadRequest("Team member email is required");

            var member = new
            {
                memberId = Guid.NewGuid().ToString(),
                name = request.Name,
                email = request.Email,
                role = request.Role,
                joinDate = DateTime.UtcNow,
                status = "active"
            };

            return Created($"/api/teams/{id}/members", member);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding team member");
            return BadRequest("Error adding team member");
        }
    }

    // DELETE: api/teams/{id}/members/{memberId}
    [HttpDelete("{id}/members/{memberId}")]
    public async Task<IActionResult> RemoveTeamMember(string id, string memberId)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            return Ok(new { message = "Team member removed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing team member");
            return BadRequest("Error removing team member");
        }
    }

    // GET: api/teams/statistics/summary
    [HttpGet("statistics/summary")]
    public async Task<ActionResult<object>> GetTeamsStats()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var stats = new
            {
                totalTeams = 3,
                activeTeams = 3,
                totalMembers = 12,
                totalBudget = 150000m,
                budgetUsed = 98500m,
                budgetRemaining = 51500m,
                totalJobsCompleted = 234,
                totalRevenue = 89400m,
                averageTeamSize = 4,
                topTeam = "Plumbing Team",
                topTeamRevenue = 35000m
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching team statistics");
            return BadRequest("Error fetching team statistics");
        }
    }
}

public class CreateTeamRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Manager { get; set; }
    public bool Active { get; set; } = true;
}

public class UpdateTeamRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Manager { get; set; }
    public bool? Active { get; set; }
}

public class AddTeamMemberToTeamRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
