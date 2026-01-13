using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;
using System.Security.Claims;

namespace HandimanApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TimeEntriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<TimeEntriesController> _logger;

        public TimeEntriesController(ApplicationDbContext context, ILogger<TimeEntriesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetTimeEntries([FromQuery] Guid? jobId, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {
                var userId = GetCurrentUserId();
                var teamMember = await _context.TeamMembers.FirstOrDefaultAsync(t => t.UserId == userId);

                if (teamMember == null)
                {
                    return BadRequest(new { message = "User is not a team member" });
                }

                var query = _context.TimeEntries
                    .Where(t => t.TeamMemberId == teamMember.Id)
                    .AsNoTracking();

                if (jobId.HasValue)
                {
                    query = query.Where(t => t.JobId == jobId.Value);
                }

                if (startDate.HasValue)
                {
                    query = query.Where(t => t.StartTime >= startDate.Value);
                }

                if (endDate.HasValue)
                {
                    query = query.Where(t => t.EndTime <= endDate.Value);
                }

                var entries = await query
                    .OrderByDescending(t => t.StartTime)
                    .Select(t => new
                    {
                        t.Id,
                        t.JobId,
                        t.StartTime,
                        t.EndTime,
                        t.DurationMinutes,
                        HoursWorked = t.DurationMinutes / 60.0,
                        t.Description,
                        t.IsBillable
                    })
                    .ToListAsync();

                return Ok(entries);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching time entries: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching time entries" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetTimeEntry(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var teamMember = await _context.TeamMembers.FirstOrDefaultAsync(t => t.UserId == userId);

                if (teamMember == null)
                {
                    return BadRequest(new { message = "User is not a team member" });
                }

                var entry = await _context.TimeEntries
                    .Where(t => t.Id == id && t.TeamMemberId == teamMember.Id)
                    .AsNoTracking()
                    .Select(t => new
                    {
                        t.Id,
                        t.JobId,
                        t.StartTime,
                        t.EndTime,
                        t.DurationMinutes,
                        HoursWorked = t.DurationMinutes / 60.0,
                        t.Description,
                        t.IsBillable
                    })
                    .FirstOrDefaultAsync();

                if (entry == null)
                {
                    return NotFound(new { message = "Time entry not found" });
                }

                return Ok(entry);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching time entry: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching time entry" });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CreateTimeEntry([FromBody] CreateTimeEntryRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var teamMember = await _context.TeamMembers.FirstOrDefaultAsync(t => t.UserId == userId);

                if (teamMember == null)
                {
                    return BadRequest(new { message = "User is not a team member" });
                }

                var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == request.JobId);
                if (job == null)
                {
                    return NotFound(new { message = "Job not found" });
                }

                var durationMinutes = request.EndTime.HasValue 
                    ? (int)(request.EndTime.Value - request.StartTime).TotalMinutes 
                    : 0;

                var entry = new TimeEntry
                {
                    Id = Guid.NewGuid(),
                    JobId = request.JobId,
                    TeamMemberId = teamMember.Id,
                    StartTime = request.StartTime,
                    EndTime = request.EndTime,
                    DurationMinutes = durationMinutes,
                    Description = request.Description ?? string.Empty,
                    IsBillable = request.IsBillable ?? true
                };

                _context.TimeEntries.Add(entry);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTimeEntry), new { id = entry.Id }, new
                {
                    entry.Id,
                    entry.JobId,
                    entry.StartTime,
                    entry.EndTime,
                    entry.DurationMinutes,
                    HoursWorked = entry.DurationMinutes / 60.0,
                    entry.Description,
                    entry.IsBillable
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating time entry: {ex.Message}");
                return StatusCode(500, new { message = "Error creating time entry" });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTimeEntry(Guid id, [FromBody] UpdateTimeEntryRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var teamMember = await _context.TeamMembers.FirstOrDefaultAsync(t => t.UserId == userId);

                if (teamMember == null)
                {
                    return BadRequest(new { message = "User is not a team member" });
                }

                var entry = await _context.TimeEntries
                    .FirstOrDefaultAsync(t => t.Id == id && t.TeamMemberId == teamMember.Id);

                if (entry == null)
                {
                    return NotFound(new { message = "Time entry not found" });
                }

                if (request.StartTime.HasValue)
                {
                    entry.StartTime = request.StartTime.Value;
                }

                if (request.EndTime.HasValue)
                {
                    entry.EndTime = request.EndTime.Value;
                }

                if (entry.EndTime.HasValue)
                {
                    entry.DurationMinutes = (int)(entry.EndTime.Value - entry.StartTime).TotalMinutes;
                }

                if (!string.IsNullOrWhiteSpace(request.Description))
                {
                    entry.Description = request.Description;
                }

                if (request.IsBillable.HasValue)
                {
                    entry.IsBillable = request.IsBillable.Value;
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Time entry updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating time entry: {ex.Message}");
                return StatusCode(500, new { message = "Error updating time entry" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTimeEntry(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var teamMember = await _context.TeamMembers.FirstOrDefaultAsync(t => t.UserId == userId);

                if (teamMember == null)
                {
                    return BadRequest(new { message = "User is not a team member" });
                }

                var entry = await _context.TimeEntries
                    .FirstOrDefaultAsync(t => t.Id == id && t.TeamMemberId == teamMember.Id);

                if (entry == null)
                {
                    return NotFound(new { message = "Time entry not found" });
                }

                _context.TimeEntries.Remove(entry);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Time entry deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting time entry: {ex.Message}");
                return StatusCode(500, new { message = "Error deleting time entry" });
            }
        }

        [HttpGet("statistics/summary")]
        public async Task<ActionResult> GetStatistics([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {
                var userId = GetCurrentUserId();
                var teamMember = await _context.TeamMembers.FirstOrDefaultAsync(t => t.UserId == userId);

                if (teamMember == null)
                {
                    return BadRequest(new { message = "User is not a team member" });
                }

                var query = _context.TimeEntries
                    .Where(t => t.TeamMemberId == teamMember.Id)
                    .AsNoTracking();

                if (startDate.HasValue)
                {
                    query = query.Where(t => t.StartTime >= startDate.Value);
                }

                if (endDate.HasValue)
                {
                    query = query.Where(t => t.EndTime <= endDate.Value);
                }

                var entries = await query.ToListAsync();

                var totalMinutes = entries.Sum(e => e.DurationMinutes);
                var totalHours = totalMinutes / 60.0;
                var billableMinutes = entries.Where(e => e.IsBillable).Sum(e => e.DurationMinutes);
                var billableHours = billableMinutes / 60.0;

                var stats = new
                {
                    TotalEntries = entries.Count,
                    TotalMinutes = totalMinutes,
                    TotalHours = Math.Round(totalHours, 2),
                    BillableHours = Math.Round(billableHours, 2),
                    NonBillableHours = Math.Round(totalHours - billableHours, 2),
                    BillablePercentage = totalHours > 0 ? Math.Round((billableHours / totalHours) * 100, 2) : 0,
                    AverageHoursPerEntry = entries.Count > 0 ? Math.Round(totalHours / entries.Count, 2) : 0,
                    JobsWorkedOn = entries.Select(e => e.JobId).Distinct().Count(),
                    HourlyRate = teamMember.HourlyRate,
                    EstimatedEarnings = Math.Round(billableHours * (double)teamMember.HourlyRate, 2)
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching time statistics: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching statistics" });
            }
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return userId;
            }
            return Guid.Empty;
        }
    }

    public class CreateTimeEntryRequest
    {
        public Guid JobId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string? Description { get; set; }
        public bool? IsBillable { get; set; }
    }

    public class UpdateTimeEntryRequest
    {
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string? Description { get; set; }
        public bool? IsBillable { get; set; }
    }
}
