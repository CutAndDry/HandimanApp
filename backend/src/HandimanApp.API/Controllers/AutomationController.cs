using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;
using System.Security.Claims;

namespace HandimanApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/automation")]
public class AutomationController : ControllerBase
{
    private readonly ILogger<AutomationController> _logger;
    private readonly ApplicationDbContext _context;

    public AutomationController(ILogger<AutomationController> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    // GET: api/automation/workflows
    [HttpGet("workflows")]
    public async Task<ActionResult<IEnumerable<object>>> GetWorkflows()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var workflows = new List<object>
            {
                new { id = Guid.NewGuid().ToString(), name = "Auto-assign jobs", description = "Automatically assign new jobs to available technicians", type = "assignment", enabled = true, lastRun = DateTime.UtcNow.AddHours(-2), runCount = 145 },
                new { id = Guid.NewGuid().ToString(), name = "Invoice on job completion", description = "Automatically create invoice when job is marked complete", type = "invoice", enabled = true, lastRun = DateTime.UtcNow.AddMinutes(-15), runCount = 89 },
                new { id = Guid.NewGuid().ToString(), name = "Send customer reminder", description = "Send reminder email 24 hours before scheduled job", type = "notification", enabled = true, lastRun = DateTime.UtcNow.AddDays(-1), runCount = 203 }
            };

            return Ok(workflows);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching workflows");
            return BadRequest("Error fetching workflows");
        }
    }

    // GET: api/automation/workflows/{id}
    [HttpGet("workflows/{id}")]
    public async Task<ActionResult<object>> GetWorkflow(string id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var workflow = new
            {
                id = id,
                name = "Auto-assign jobs",
                description = "Automatically assign new jobs to available technicians",
                type = "assignment",
                enabled = true,
                conditions = new object[]
                {
                    new { field = "jobStatus", @operator = "equals", value = "pending" },
                    new { field = "technicianAvailable", @operator = "equals", value = "true" }
                },
                actions = new object[]
                {
                    new { action = "assignTechnician", parameters = new { criteria = "nearest_available" } },
                    new { action = "sendNotification", parameters = new { type = "job_assigned" } }
                },
                schedule = "manual",
                lastRun = DateTime.UtcNow.AddHours(-2),
                runCount = 145
            };

            return Ok(workflow);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching workflow");
            return BadRequest("Error fetching workflow");
        }
    }

    // POST: api/automation/workflows
    [HttpPost("workflows")]
    public async Task<ActionResult<object>> CreateWorkflow([FromBody] CreateWorkflowRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            if (string.IsNullOrEmpty(request.Name))
                return BadRequest("Workflow name is required");

            var workflow = new
            {
                id = Guid.NewGuid().ToString(),
                name = request.Name,
                description = request.Description,
                type = request.Type,
                enabled = request.Enabled,
                conditions = request.Conditions,
                actions = request.Actions,
                schedule = request.Schedule,
                createdAt = DateTime.UtcNow,
                runCount = 0
            };

            return Created($"/api/automation/workflows/{workflow}", workflow);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating workflow");
            return BadRequest("Error creating workflow");
        }
    }

    // PUT: api/automation/workflows/{id}
    [HttpPut("workflows/{id}")]
    public async Task<IActionResult> UpdateWorkflow(string id, [FromBody] UpdateWorkflowRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            return Ok(new { message = "Workflow updated successfully", id = id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating workflow");
            return BadRequest("Error updating workflow");
        }
    }

    // DELETE: api/automation/workflows/{id}
    [HttpDelete("workflows/{id}")]
    public async Task<IActionResult> DeleteWorkflow(string id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            return Ok(new { message = "Workflow deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting workflow");
            return BadRequest("Error deleting workflow");
        }
    }

    // POST: api/automation/workflows/{id}/run
    [HttpPost("workflows/{id}/run")]
    public async Task<ActionResult<object>> RunWorkflow(string id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var result = new
            {
                success = true,
                message = "Workflow executed successfully",
                jobsProcessed = 12,
                executionTime = "2.3s",
                timestamp = DateTime.UtcNow
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error running workflow");
            return BadRequest("Error running workflow");
        }
    }

    // GET: api/automation/tasks
    [HttpGet("tasks")]
    public async Task<ActionResult<IEnumerable<object>>> GetScheduledTasks()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var tasks = new List<object>
            {
                new { id = Guid.NewGuid().ToString(), name = "Daily report generation", type = "report", schedule = "0 9 * * *", enabled = true, nextRun = DateTime.UtcNow.AddHours(8), lastRun = DateTime.UtcNow.AddDays(-1) },
                new { id = Guid.NewGuid().ToString(), name = "Backup database", type = "backup", schedule = "0 2 * * *", enabled = true, nextRun = DateTime.UtcNow.AddHours(2), lastRun = DateTime.UtcNow },
                new { id = Guid.NewGuid().ToString(), name = "Cleanup old invoices", type = "cleanup", schedule = "0 3 * * 0", enabled = true, nextRun = DateTime.UtcNow.AddDays(5), lastRun = DateTime.UtcNow.AddDays(-7) }
            };

            return Ok(tasks);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching scheduled tasks");
            return BadRequest("Error fetching scheduled tasks");
        }
    }

    // POST: api/automation/tasks
    [HttpPost("tasks")]
    public async Task<ActionResult<object>> CreateTask([FromBody] CreateTaskRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            if (string.IsNullOrEmpty(request.Name))
                return BadRequest("Task name is required");

            var task = new
            {
                id = Guid.NewGuid().ToString(),
                name = request.Name,
                type = request.Type,
                schedule = request.Schedule,
                enabled = request.Enabled,
                nextRun = DateTime.UtcNow,
                createdAt = DateTime.UtcNow
            };

            return Created($"/api/automation/tasks/{task}", task);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating task");
            return BadRequest("Error creating task");
        }
    }

    // GET: api/automation/statistics
    [HttpGet("statistics")]
    public async Task<ActionResult<object>> GetAutomationStats()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var stats = new
            {
                totalWorkflows = 3,
                activeWorkflows = 3,
                totalExecutions = 437,
                successfulExecutions = 418,
                failedExecutions = 19,
                successRate = 95.6,
                timesSaved = 156, // hours
                automatedJobsCount = 267,
                averageExecutionTime = "1.2s"
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching automation statistics");
            return BadRequest("Error fetching automation statistics");
        }
    }
}

public class CreateWorkflowRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public bool Enabled { get; set; } = true;
    public object? Conditions { get; set; }
    public object? Actions { get; set; }
    public string Schedule { get; set; } = "manual";
}

public class UpdateWorkflowRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public bool? Enabled { get; set; }
    public object? Conditions { get; set; }
    public object? Actions { get; set; }
}

public class CreateTaskRequest
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Schedule { get; set; } = string.Empty;
    public bool Enabled { get; set; } = true;
}
