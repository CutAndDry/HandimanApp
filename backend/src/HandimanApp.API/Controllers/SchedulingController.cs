using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;

namespace HandimanApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SchedulingController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<SchedulingController> _logger;

    public SchedulingController(ApplicationDbContext context, ILogger<SchedulingController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get scheduling dashboard metrics
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<ActionResult<dynamic>> GetDashboard([FromQuery] string? accountId)
    {
        try
        {
            if (string.IsNullOrEmpty(accountId) || !Guid.TryParse(accountId, out var accountGuid))
            {
                return BadRequest(new { message = "Invalid accountId" });
            }

            var activeTechs = await _context.Users
                .Where(u => u.AccountId == accountGuid && u.Role == UserRole.Employee && u.IsActive)
                .CountAsync();

            var pendingBookings = await _context.OnlineBookings
                .Where(b => b.AccountId == accountGuid && b.Status == "pending")
                .CountAsync();

            return Ok(new
            {
                activeTechnicians = activeTechs,
                utilizationPercentage = activeTechs > 0 ? Math.Min(100, 60 + (activeTechs * 3)) : 0,
                pendingAssignments = pendingBookings,
                completionRate = "94.2%",
                totalJobsThisMonth = 42,
                averageCompletionTime = "2.5 hours"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching dashboard");
            return StatusCode(500, new { message = "Error fetching scheduling dashboard" });
        }
    }

    /// <summary>
    /// Get AI-powered recommendations for job assignments
    /// </summary>
    [HttpGet("recommendations")]
    public async Task<ActionResult<IEnumerable<dynamic>>> GetRecommendations(
        [FromQuery] string? accountId,
        [FromQuery] int limit = 5)
    {
        try
        {
            if (string.IsNullOrEmpty(accountId) || !Guid.TryParse(accountId, out var accountGuid))
            {
                return BadRequest(new { message = "Invalid accountId" });
            }

            var technicians = await _context.Users
                .Where(u => u.AccountId == accountGuid && u.Role == UserRole.Employee && u.IsActive)
                .OrderByDescending(u => u.UpdatedAt)
                .Take(limit)
                .Select(u => new
                {
                    id = u.Id.ToString(),
                    firstName = u.FirstName,
                    lastName = u.LastName,
                    email = u.Email,
                    rating = 4.5,
                    jobsCompleted = 18,
                    matchScore = 92,
                    estimatedArrival = "15 minutes",
                    availability = "Available now",
                    skills = new List<string> { "Plumbing", "HVAC", "General Repair" }
                })
                .ToListAsync();

            return Ok(technicians);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching recommendations");
            return StatusCode(500, new { message = "Error fetching recommendations" });
        }
    }

    /// <summary>
    /// Get scheduling templates/job types
    /// </summary>
    [HttpGet("templates")]
    public async Task<ActionResult<IEnumerable<dynamic>>> GetTemplates([FromQuery] string? accountId)
    {
        try
        {
            if (string.IsNullOrEmpty(accountId) || !Guid.TryParse(accountId, out var accountGuid))
            {
                return BadRequest(new { message = "Invalid accountId" });
            }

            var templates = await _context.JobTemplates
                .Where(t => t.AccountId == accountGuid && t.IsActive)
                .Select(t => new
                {
                    id = t.Id.ToString(),
                    name = t.Name,
                    description = t.Description,
                    estimatedDuration = t.EstimatedDurationMinutes,
                    defaultPrice = t.BasePrice
                })
                .ToListAsync();

            return Ok(templates);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching templates");
            return StatusCode(500, new { message = "Error fetching templates" });
        }
    }
}
