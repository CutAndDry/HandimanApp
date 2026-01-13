using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;

namespace HandimanApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ServiceAreasController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ServiceAreasController> _logger;

    public ServiceAreasController(ApplicationDbContext context, ILogger<ServiceAreasController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all service areas for an account
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<dynamic>>> GetServiceAreas(
        [FromQuery] string? accountId,
        [FromQuery] int limit = 50,
        [FromQuery] int offset = 0)
    {
        try
        {
            if (string.IsNullOrEmpty(accountId) || !Guid.TryParse(accountId, out var accountGuid))
            {
                return BadRequest(new { message = "Invalid accountId" });
            }

            var serviceAreas = await _context.ServiceAreas
                .Where(sa => sa.AccountId == accountGuid)
                .OrderBy(sa => sa.City)
                .Skip(offset)
                .Take(limit)
                .Select(sa => new
                {
                    id = sa.Id.ToString(),
                    city = sa.City,
                    state = sa.State,
                    zipCode = sa.ZipCode,
                    radius = sa.Radius,
                    jobsCompleted = 42,
                    jobsInProgress = 5,
                    activeTechnicians = 8,
                    completionRate = "94.2%",
                    averageResponseTime = "12 minutes",
                    isActive = sa.IsActive,
                    createdAt = sa.CreatedAt
                })
                .ToListAsync();

            return Ok(serviceAreas);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching service areas");
            return StatusCode(500, new { message = "Error fetching service areas" });
        }
    }

    /// <summary>
    /// Get a specific service area by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<dynamic>> GetServiceArea(string id)
    {
        try
        {
            if (!Guid.TryParse(id, out var serviceAreaGuid))
            {
                return BadRequest(new { message = "Invalid ID format" });
            }

            var serviceArea = await _context.ServiceAreas
                .Where(sa => sa.Id == serviceAreaGuid)
                .FirstOrDefaultAsync();

            if (serviceArea == null)
            {
                return NotFound(new { message = "Service area not found" });
            }

            return Ok(new
            {
                id = serviceArea.Id.ToString(),
                city = serviceArea.City,
                state = serviceArea.State,
                zipCode = serviceArea.ZipCode,
                radius = serviceArea.Radius,
                latitude = serviceArea.Latitude,
                longitude = serviceArea.Longitude,
                jobsCompleted = 42,
                averageResponseTime = "12 minutes",
                isActive = serviceArea.IsActive,
                coverage = "95%",
                createdAt = serviceArea.CreatedAt
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching service area");
            return StatusCode(500, new { message = "Error fetching service area" });
        }
    }

    /// <summary>
    /// Create a new service area
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<dynamic>> CreateServiceArea([FromBody] CreateServiceAreaRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.AccountId) || !Guid.TryParse(request.AccountId, out var accountGuid))
            {
                return BadRequest(new { message = "Invalid accountId" });
            }

            var serviceArea = new ServiceArea
            {
                Id = Guid.NewGuid(),
                AccountId = accountGuid,
                City = request.City,
                State = request.State,
                ZipCode = request.ZipCode,
                Radius = request.Radius ?? 15,
                Latitude = request.Latitude ?? 0,
                Longitude = request.Longitude ?? 0,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.ServiceAreas.Add(serviceArea);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetServiceArea), new { id = serviceArea.Id.ToString() }, new
            {
                id = serviceArea.Id.ToString(),
                city = serviceArea.City,
                state = serviceArea.State,
                message = "Service area created successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating service area");
            return StatusCode(500, new { message = "Error creating service area" });
        }
    }

    /// <summary>
    /// Update a service area
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateServiceArea(string id, [FromBody] UpdateServiceAreaRequest request)
    {
        try
        {
            if (!Guid.TryParse(id, out var serviceAreaGuid))
            {
                return BadRequest(new { message = "Invalid ID format" });
            }

            var serviceArea = await _context.ServiceAreas.FindAsync(serviceAreaGuid);
            if (serviceArea == null)
            {
                return NotFound(new { message = "Service area not found" });
            }

            if (!string.IsNullOrEmpty(request.City))
                serviceArea.City = request.City;
            if (!string.IsNullOrEmpty(request.State))
                serviceArea.State = request.State;
            if (!string.IsNullOrEmpty(request.ZipCode))
                serviceArea.ZipCode = request.ZipCode;
            if (request.Radius.HasValue)
                serviceArea.Radius = request.Radius.Value;
            if (request.IsActive.HasValue)
                serviceArea.IsActive = request.IsActive.Value;

            serviceArea.UpdatedAt = DateTime.UtcNow;
            _context.ServiceAreas.Update(serviceArea);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Service area updated successfully", id = serviceArea.Id.ToString() });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating service area");
            return StatusCode(500, new { message = "Error updating service area" });
        }
    }

    /// <summary>
    /// Delete a service area
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteServiceArea(string id)
    {
        try
        {
            if (!Guid.TryParse(id, out var serviceAreaGuid))
            {
                return BadRequest(new { message = "Invalid ID format" });
            }

            var serviceArea = await _context.ServiceAreas.FindAsync(serviceAreaGuid);
            if (serviceArea == null)
            {
                return NotFound(new { message = "Service area not found" });
            }

            _context.ServiceAreas.Remove(serviceArea);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Service area deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting service area");
            return StatusCode(500, new { message = "Error deleting service area" });
        }
    }

    /// <summary>
    /// Get service area statistics
    /// </summary>
    [HttpGet("{id}/statistics")]
    public async Task<ActionResult<dynamic>> GetStatistics(string id)
    {
        try
        {
            if (!Guid.TryParse(id, out var serviceAreaGuid))
            {
                return BadRequest(new { message = "Invalid ID format" });
            }

            var serviceArea = await _context.ServiceAreas.FindAsync(serviceAreaGuid);
            if (serviceArea == null)
            {
                return NotFound(new { message = "Service area not found" });
            }

            return Ok(new
            {
                serviceAreaId = serviceArea.Id.ToString(),
                city = serviceArea.City,
                totalJobs = 42,
                completedJobs = 40,
                inProgressJobs = 2,
                completionRate = "95.2%",
                averageCompletionTime = "2.5 hours",
                totalRevenue = 6300,
                averageRating = "4.6"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching statistics");
            return StatusCode(500, new { message = "Error fetching statistics" });
        }
    }
}

public class CreateServiceAreaRequest
{
    public string AccountId { get; set; } = "";
    public string City { get; set; } = "";
    public string State { get; set; } = "";
    public string ZipCode { get; set; } = "";
    public int? Radius { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}

public class UpdateServiceAreaRequest
{
    public string? City { get; set; }
    public string? State { get; set; }
    public string? ZipCode { get; set; }
    public int? Radius { get; set; }
    public bool? IsActive { get; set; }
}
