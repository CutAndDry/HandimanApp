using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;

namespace HandimanApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/job-costing")]
public class JobCostingController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<JobCostingController> _logger;

    public JobCostingController(ApplicationDbContext context, ILogger<JobCostingController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all job costs
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<dynamic>>> GetJobCosts(
        [FromQuery] string? jobId,
        [FromQuery] int limit = 50,
        [FromQuery] int offset = 0)
    {
        try
        {
            var query = _context.JobCosts.AsQueryable();

            if (!string.IsNullOrEmpty(jobId) && Guid.TryParse(jobId, out var jobGuid))
            {
                query = query.Where(jc => jc.JobId == jobGuid);
            }

            var costs = await query
                .OrderByDescending(jc => jc.CreatedAt)
                .Skip(offset)
                .Take(limit)
                .Select(jc => new
                {
                    id = jc.Id.ToString(),
                    jobId = jc.JobId.ToString(),
                    amount = jc.Amount,
                    costType = jc.CostType,
                    description = jc.Description,
                    createdAt = jc.CreatedAt
                })
                .ToListAsync();

            return Ok(costs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching job costs");
            return StatusCode(500, new { message = "Error fetching job costs" });
        }
    }

    /// <summary>
    /// Get a specific job cost
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<dynamic>> GetJobCost(string id)
    {
        try
        {
            if (!Guid.TryParse(id, out var costGuid))
            {
                return BadRequest(new { message = "Invalid ID format" });
            }

            var cost = await _context.JobCosts
                .Where(jc => jc.Id == costGuid)
                .FirstOrDefaultAsync();

            if (cost == null)
            {
                return NotFound(new { message = "Job cost not found" });
            }

            return Ok(new
            {
                id = cost.Id.ToString(),
                jobId = cost.JobId.ToString(),
                amount = cost.Amount,
                costType = cost.CostType,
                description = cost.Description,
                createdAt = cost.CreatedAt
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching job cost");
            return StatusCode(500, new { message = "Error fetching job cost" });
        }
    }

    /// <summary>
    /// Create a new job cost
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<dynamic>> CreateJobCost([FromBody] CreateJobCostRequest request)
    {
        try
        {
            if (!Guid.TryParse(request.JobId, out var jobGuid))
            {
                return BadRequest(new { message = "Invalid jobId" });
            }

            var cost = new JobCost
            {
                Id = Guid.NewGuid(),
                JobId = jobGuid,
                Amount = request.Amount,
                CostType = request.CostType ?? "other",
                Description = request.Description ?? "",
                CreatedAt = DateTime.UtcNow
            };

            _context.JobCosts.Add(cost);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJobCost), new { id = cost.Id.ToString() }, new
            {
                id = cost.Id.ToString(),
                jobId = cost.JobId.ToString(),
                amount = cost.Amount,
                costType = cost.CostType,
                message = "Job cost created successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating job cost");
            return StatusCode(500, new { message = "Error creating job cost" });
        }
    }

    /// <summary>
    /// Update a job cost
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateJobCost(string id, [FromBody] UpdateJobCostRequest request)
    {
        try
        {
            if (!Guid.TryParse(id, out var costGuid))
            {
                return BadRequest(new { message = "Invalid ID format" });
            }

            var cost = await _context.JobCosts.FindAsync(costGuid);
            if (cost == null)
            {
                return NotFound(new { message = "Job cost not found" });
            }

            if (request.Amount.HasValue)
                cost.Amount = request.Amount.Value;
            if (!string.IsNullOrEmpty(request.CostType))
                cost.CostType = request.CostType;
            if (!string.IsNullOrEmpty(request.Description))
                cost.Description = request.Description;

            _context.JobCosts.Update(cost);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Job cost updated successfully", id = cost.Id.ToString() });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating job cost");
            return StatusCode(500, new { message = "Error updating job cost" });
        }
    }

    /// <summary>
    /// Delete a job cost
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteJobCost(string id)
    {
        try
        {
            if (!Guid.TryParse(id, out var costGuid))
            {
                return BadRequest(new { message = "Invalid ID format" });
            }

            var cost = await _context.JobCosts.FindAsync(costGuid);
            if (cost == null)
            {
                return NotFound(new { message = "Job cost not found" });
            }

            _context.JobCosts.Remove(cost);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Job cost deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting job cost");
            return StatusCode(500, new { message = "Error deleting job cost" });
        }
    }

    /// <summary>
    /// Get cost analysis for a job
    /// </summary>
    [HttpGet("{jobId}/analysis")]
    public async Task<ActionResult<dynamic>> GetJobCostAnalysis(string jobId)
    {
        try
        {
            if (!Guid.TryParse(jobId, out var jobGuid))
            {
                return BadRequest(new { message = "Invalid jobId format" });
            }

            var costs = await _context.JobCosts
                .Where(jc => jc.JobId == jobGuid)
                .ToListAsync();

            var totalCost = costs.Sum(jc => jc.Amount);

            var byCostType = costs
                .GroupBy(jc => jc.CostType)
                .Select(g => new { type = g.Key, count = g.Count(), total = g.Sum(jc => jc.Amount) })
                .ToList();

            // Try to get associated invoice to calculate markup
            var job = await _context.Jobs.FindAsync(jobGuid);
            var invoice = job != null ? await _context.Invoices.FirstOrDefaultAsync(i => i.JobId == jobGuid) : null;
            var estimatedRevenue = invoice?.TotalAmount ?? (totalCost * 1.35m);
            var estimatedProfit = estimatedRevenue - totalCost;

            return Ok(new
            {
                totalCost = totalCost,
                costItems = costs.Count,
                estimatedRevenue = estimatedRevenue,
                estimatedProfit = estimatedProfit,
                profitMargin = totalCost > 0 ? (estimatedProfit / estimatedRevenue * 100) : 0,
                costBreakdown = byCostType
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching job cost analysis");
            return StatusCode(500, new { message = "Error fetching job cost analysis" });
        }
    }

    /// <summary>
    /// Get overall cost summary
    /// </summary>
    [HttpGet("summary/overview")]
    public async Task<ActionResult<dynamic>> GetCostSummary()
    {
        try
        {
            var allCosts = await _context.JobCosts.ToListAsync();

            var totalCost = allCosts.Sum(jc => jc.Amount);
            var totalJobs = allCosts.Select(jc => jc.JobId).Distinct().Count();

            var byCostType = allCosts
                .GroupBy(jc => jc.CostType)
                .Select(g => new { type = g.Key, count = g.Count(), total = g.Sum(jc => jc.Amount) })
                .ToList();

            return Ok(new
            {
                totalJobsWithCosts = totalJobs,
                totalCostItems = allCosts.Count,
                totalCost = totalCost,
                averageJobCost = totalJobs > 0 ? totalCost / totalJobs : 0,
                costBreakdown = byCostType
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching cost summary");
            return StatusCode(500, new { message = "Error fetching cost summary" });
        }
    }
}

public class CreateJobCostRequest
{
    public string JobId { get; set; } = "";
    public decimal Amount { get; set; }
    public string? CostType { get; set; } // labor, material, equipment, other
    public string? Description { get; set; }
}

public class UpdateJobCostRequest
{
    public decimal? Amount { get; set; }
    public string? CostType { get; set; }
    public string? Description { get; set; }
}
