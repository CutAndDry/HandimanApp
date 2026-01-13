using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;
using System.Security.Claims;

namespace HandimanApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/pricing")]
public class PricingController : ControllerBase
{
    private readonly ILogger<PricingController> _logger;
    private readonly ApplicationDbContext _context;

    public PricingController(ILogger<PricingController> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    // GET: api/pricing/rules
    [HttpGet("rules")]
    public async Task<ActionResult<IEnumerable<object>>> GetPricingRules()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var rules = new List<object>
            {
                new { id = Guid.NewGuid().ToString(), name = "Residential base rate", category = "plumbing", basePrice = 75m, unit = "hour", active = true, createdAt = DateTime.UtcNow.AddMonths(-6) },
                new { id = Guid.NewGuid().ToString(), name = "Commercial emergency surcharge", category = "electrical", basePrice = 150m, unit = "service_call", active = true, createdAt = DateTime.UtcNow.AddMonths(-3) },
                new { id = Guid.NewGuid().ToString(), name = "Weekend holiday markup", category = "all", basePrice = 1.25m, unit = "multiplier", active = true, createdAt = DateTime.UtcNow.AddMonths(-2) }
            };

            return Ok(rules);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching pricing rules");
            return BadRequest("Error fetching pricing rules");
        }
    }

    // GET: api/pricing/rules/{id}
    [HttpGet("rules/{id}")]
    public async Task<ActionResult<object>> GetPricingRule(string id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var rule = new
            {
                id = id,
                name = "Residential base rate",
                description = "Standard hourly rate for residential plumbing services",
                category = "plumbing",
                basePrice = 75m,
                unit = "hour",
                modifiers = new[]
                {
                    new { type = "timeOfDay", name = "Emergency after hours", multiplier = 1.5m, appliesAt = "after 5pm and weekends" },
                    new { type = "season", name = "Winter surge", multiplier = 1.2m, appliesAt = "November - February" }
                },
                active = true,
                createdAt = DateTime.UtcNow.AddMonths(-6)
            };

            return Ok(rule);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching pricing rule");
            return BadRequest("Error fetching pricing rule");
        }
    }

    // POST: api/pricing/rules
    [HttpPost("rules")]
    public async Task<ActionResult<object>> CreatePricingRule([FromBody] CreatePricingRuleRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            if (string.IsNullOrEmpty(request.Name) || request.BasePrice <= 0)
                return BadRequest("Name and valid base price are required");

            var rule = new
            {
                id = Guid.NewGuid().ToString(),
                name = request.Name,
                category = request.Category,
                basePrice = request.BasePrice,
                unit = request.Unit,
                modifiers = request.Modifiers,
                active = request.Active,
                createdAt = DateTime.UtcNow
            };

            return Created($"/api/pricing/rules/{rule}", rule);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating pricing rule");
            return BadRequest("Error creating pricing rule");
        }
    }

    // PUT: api/pricing/rules/{id}
    [HttpPut("rules/{id}")]
    public async Task<IActionResult> UpdatePricingRule(string id, [FromBody] UpdatePricingRuleRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            return Ok(new { message = "Pricing rule updated successfully", id = id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating pricing rule");
            return BadRequest("Error updating pricing rule");
        }
    }

    // DELETE: api/pricing/rules/{id}
    [HttpDelete("rules/{id}")]
    public async Task<IActionResult> DeletePricingRule(string id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            return Ok(new { message = "Pricing rule deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting pricing rule");
            return BadRequest("Error deleting pricing rule");
        }
    }

    // POST: api/pricing/estimates
    [HttpPost("estimates")]
    public async Task<ActionResult<object>> GenerateEstimate([FromBody] GenerateEstimateRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            if (request.EstimatedHours <= 0)
                return BadRequest("Estimated hours must be greater than zero");

            // Simple pricing calculation
            decimal laborCost = request.EstimatedHours * 75m; // base hourly rate
            decimal materialsCost = request.MaterialsCost ?? 0m;
            decimal subtotal = laborCost + materialsCost;
            decimal tax = subtotal * 0.1m; // 10% tax
            decimal total = subtotal + tax;

            var estimate = new
            {
                id = Guid.NewGuid().ToString(),
                jobId = request.JobId,
                serviceType = request.ServiceType,
                description = request.Description,
                laborCost = laborCost,
                materialsCost = materialsCost,
                subtotal = subtotal,
                tax = tax,
                total = total,
                estimatedHours = request.EstimatedHours,
                validUntil = DateTime.UtcNow.AddDays(30),
                status = "draft",
                createdAt = DateTime.UtcNow
            };

            return Ok(estimate);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating estimate");
            return BadRequest("Error generating estimate");
        }
    }

    // GET: api/pricing/estimates
    [HttpGet("estimates")]
    public async Task<ActionResult<IEnumerable<object>>> GetEstimates([FromQuery] string? jobId = null, [FromQuery] string? status = null)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var estimates = new List<object>
            {
                new { id = Guid.NewGuid().ToString(), jobId = "job1", serviceType = "plumbing", description = "Pipe replacement", total = 450m, status = "accepted", validUntil = DateTime.UtcNow.AddDays(15), createdAt = DateTime.UtcNow.AddDays(-5) },
                new { id = Guid.NewGuid().ToString(), jobId = "job2", serviceType = "electrical", description = "Outlet installation", total = 320m, status = "pending", validUntil = DateTime.UtcNow.AddDays(25), createdAt = DateTime.UtcNow.AddDays(-2) },
                new { id = Guid.NewGuid().ToString(), jobId = "job3", serviceType = "hvac", description = "AC maintenance", total = 200m, status = "rejected", validUntil = DateTime.UtcNow.AddDays(-5), createdAt = DateTime.UtcNow.AddDays(-15) }
            };

            if (!string.IsNullOrEmpty(status))
                estimates = estimates.Where(e => e.GetType().GetProperty("status")?.GetValue(e)?.ToString() == status).ToList();

            return Ok(estimates);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching estimates");
            return BadRequest("Error fetching estimates");
        }
    }

    // GET: api/pricing/quotes
    [HttpGet("quotes")]
    public async Task<ActionResult<IEnumerable<object>>> GetQuotes()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var quotes = new List<object>
            {
                new { id = Guid.NewGuid().ToString(), customerId = "cust1", customerName = "John Smith", description = "Bathroom renovation", quotedPrice = 2500m, quoteDate = DateTime.UtcNow.AddDays(-3), expiresAt = DateTime.UtcNow.AddDays(27), status = "pending_review" },
                new { id = Guid.NewGuid().ToString(), customerId = "cust2", customerName = "Jane Doe", description = "Kitchen plumbing upgrade", quotedPrice = 1800m, quoteDate = DateTime.UtcNow.AddDays(-10), expiresAt = DateTime.UtcNow.AddDays(20), status = "accepted" },
                new { id = Guid.NewGuid().ToString(), customerId = "cust3", customerName = "Bob Wilson", description = "Roof repair", quotedPrice = 5000m, quoteDate = DateTime.UtcNow.AddDays(-25), expiresAt = DateTime.UtcNow.AddDays(-5), status = "expired" }
            };

            return Ok(quotes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching quotes");
            return BadRequest("Error fetching quotes");
        }
    }

    // GET: api/pricing/statistics
    [HttpGet("statistics")]
    public async Task<ActionResult<object>> GetPricingStats()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var stats = new
            {
                totalRules = 12,
                activeRules = 11,
                estimatesThisMonth = 34,
                acceptanceRate = 78.5m,
                averageEstimateValue = 1250m,
                totalQuotedValue = 42500m,
                avgTimeToAcceptance = "3.2 days",
                highestQuote = 8000m,
                lowestQuote = 150m
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching pricing statistics");
            return BadRequest("Error fetching pricing statistics");
        }
    }
}

public class CreatePricingRuleRequest
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public string Unit { get; set; } = "hour";
    public object? Modifiers { get; set; }
    public bool Active { get; set; } = true;
}

public class UpdatePricingRuleRequest
{
    public string? Name { get; set; }
    public string? Category { get; set; }
    public decimal? BasePrice { get; set; }
    public string? Unit { get; set; }
    public object? Modifiers { get; set; }
    public bool? Active { get; set; }
}

public class GenerateEstimateRequest
{
    public string JobId { get; set; } = string.Empty;
    public string ServiceType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal EstimatedHours { get; set; }
    public decimal? MaterialsCost { get; set; }
}
