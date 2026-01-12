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
    public async Task<ActionResult<IEnumerable<Job>>> GetJobs()
    {
        try
        {
            var jobs = await _context.Jobs
                .Include(j => j.Customer)
                .Include(j => j.Materials)
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
