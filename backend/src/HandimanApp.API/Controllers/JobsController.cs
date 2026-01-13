using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;

namespace HandimanApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class JobsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<JobsController> _logger;

    public JobsController(ApplicationDbContext context, ILogger<JobsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Job>>> GetJobs(
        [FromQuery] string? status = null,
        [FromQuery] Guid? customerId = null,
        [FromQuery] string? search = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] int limit = 50,
        [FromQuery] int offset = 0)
    {
        try
        {
            var query = _context.Jobs
                .Include(j => j.Customer)
                .Include(j => j.Materials)
                .AsQueryable();

            // Filter by status
            if (!string.IsNullOrEmpty(status))
                query = query.Where(j => j.Status == status);

            // Filter by customer
            if (customerId.HasValue)
                query = query.Where(j => j.CustomerId == customerId);

            // Search by job title, description, or customer name
            if (!string.IsNullOrEmpty(search))
            {
                var searchLower = search.ToLower();
                query = query.Where(j => 
                    j.Title.ToLower().Contains(searchLower) ||
                    j.Description.ToLower().Contains(searchLower) ||
                    j.Customer.FirstName.ToLower().Contains(searchLower) ||
                    j.Customer.LastName.ToLower().Contains(searchLower)
                );
            }

            // Filter by date range
            if (startDate.HasValue)
                query = query.Where(j => j.ScheduledDate >= startDate);

            if (endDate.HasValue)
                query = query.Where(j => j.ScheduledDate <= endDate);

            var jobs = await query
                .OrderByDescending(j => j.CreatedAt)
                .Skip(offset)
                .Take(limit)
                .ToListAsync();

            return Ok(jobs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching jobs");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Job>> GetJob(Guid id)
    {
        try
        {
            var job = await _context.Jobs
                .Include(j => j.Customer)
                .Include(j => j.Materials)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
                return NotFound();

            return Ok(job);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching job {JobId}", id);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    [HttpPost]
    public async Task<ActionResult<Job>> CreateJob(CreateJobRequest request)
    {
        try
        {
            var job = new Job
            {
                AccountId = request.AccountId,
                CustomerId = request.CustomerId,
                Title = request.Title,
                Description = request.Description,
                JobType = request.JobType,
                ScheduledDate = request.ScheduledDate,
                EstimatedLaborHours = request.EstimatedLaborHours,
                Location = request.Location,
                Notes = request.Notes,
                Status = "lead"
            };

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJob), new { id = job.Id }, job);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating job");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateJob(Guid id, UpdateJobRequest request)
    {
        try
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
                return NotFound();

            job.Title = request.Title ?? job.Title;
            job.Description = request.Description ?? job.Description;
            job.Status = request.Status ?? job.Status;
            job.ActualLaborHours = request.ActualLaborHours ?? job.ActualLaborHours;
            job.UpdatedAt = DateTime.UtcNow;

            _context.Jobs.Update(job);
            await _context.SaveChangesAsync();

            return Ok(job);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating job {JobId}", id);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteJob(Guid id)
    {
        try
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
                return NotFound();

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting job {JobId}", id);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }
}

public class CreateJobRequest
{
    public Guid AccountId { get; set; }
    public Guid CustomerId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? JobType { get; set; }
    public DateTime? ScheduledDate { get; set; }
    public decimal? EstimatedLaborHours { get; set; }
    public string? Location { get; set; }
    public string? Notes { get; set; }
}

public class UpdateJobRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Status { get; set; }
    public decimal? ActualLaborHours { get; set; }
}
