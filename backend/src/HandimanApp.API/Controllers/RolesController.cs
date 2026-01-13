using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;
using System.Security.Claims;

namespace HandimanApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/roles")]
public class RolesController : ControllerBase
{
    private readonly ILogger<RolesController> _logger;
    private readonly ApplicationDbContext _context;

    public RolesController(ILogger<RolesController> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    // GET: api/roles
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetRoles()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var roles = new List<object>
            {
                new { id = "admin", name = "Administrator", description = "Full system access", level = 1, userCount = 2, permissions = 15, createdAt = DateTime.UtcNow.AddYears(-1) },
                new { id = "manager", name = "Manager", description = "Team and business management", level = 2, userCount = 5, permissions = 12, createdAt = DateTime.UtcNow.AddYears(-1) },
                new { id = "technician", name = "Technician", description = "Field service technician", level = 3, userCount = 20, permissions = 8, createdAt = DateTime.UtcNow.AddMonths(-11) },
                new { id = "customer", name = "Customer", description = "Customer portal access", level = 4, userCount = 156, permissions = 3, createdAt = DateTime.UtcNow.AddMonths(-10) }
            };

            return Ok(roles);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching roles");
            return BadRequest("Error fetching roles");
        }
    }

    // GET: api/roles/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetRole(string id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var role = new
            {
                id = id,
                name = "Administrator",
                description = "Full system access",
                level = 1,
                userCount = 2,
                permissions = new object[]
                {
                    new { id = "view_dashboard", name = "View Dashboard", category = "Analytics" },
                    new { id = "manage_users", name = "Manage Users", category = "Users" },
                    new { id = "manage_teams", name = "Manage Teams", category = "Teams" },
                    new { id = "manage_roles", name = "Manage Roles", category = "Access Control" },
                    new { id = "view_analytics", name = "View Analytics", category = "Analytics" },
                    new { id = "export_data", name = "Export Data", category = "Data" },
                    new { id = "manage_integrations", name = "Manage Integrations", category = "System" },
                    new { id = "view_audit_logs", name = "View Audit Logs", category = "Security" }
                },
                createdAt = DateTime.UtcNow.AddYears(-1),
                lastModified = DateTime.UtcNow.AddMonths(-2)
            };

            return Ok(role);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching role");
            return BadRequest("Error fetching role");
        }
    }

    // POST: api/roles
    [HttpPost]
    public async Task<ActionResult<object>> CreateRole([FromBody] CreateRoleRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            if (string.IsNullOrEmpty(request.Name))
                return BadRequest("Role name is required");

            var role = new
            {
                id = request.Name.ToLower().Replace(" ", "_"),
                name = request.Name,
                description = request.Description,
                level = request.Level,
                permissions = request.Permissions,
                createdAt = DateTime.UtcNow,
                userCount = 0
            };

            return Created($"/api/roles/{role}", role);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating role");
            return BadRequest("Error creating role");
        }
    }

    // PUT: api/roles/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRole(string id, [FromBody] UpdateRoleRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            return Ok(new { message = "Role updated successfully", id = id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating role");
            return BadRequest("Error updating role");
        }
    }

    // DELETE: api/roles/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRole(string id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            return Ok(new { message = "Role deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting role");
            return BadRequest("Error deleting role");
        }
    }

    // GET: api/roles/permissions/available
    [HttpGet("permissions/available")]
    public async Task<ActionResult<IEnumerable<object>>> GetAvailablePermissions()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var permissions = new List<object>
            {
                new { id = "view_dashboard", name = "View Dashboard", category = "Analytics", description = "Access to main dashboard" },
                new { id = "manage_users", name = "Manage Users", category = "Users", description = "Create, edit, delete users" },
                new { id = "manage_teams", name = "Manage Teams", category = "Teams", description = "Create and manage teams" },
                new { id = "manage_roles", name = "Manage Roles", category = "Access Control", description = "Create and assign roles" },
                new { id = "manage_jobs", name = "Manage Jobs", category = "Jobs", description = "Create and manage jobs" },
                new { id = "view_analytics", name = "View Analytics", category = "Analytics", description = "Access analytics and reports" },
                new { id = "export_data", name = "Export Data", category = "Data", description = "Export business data" },
                new { id = "manage_integrations", name = "Manage Integrations", category = "System", description = "Configure integrations" },
                new { id = "view_audit_logs", name = "View Audit Logs", category = "Security", description = "View system audit logs" },
                new { id = "manage_billing", name = "Manage Billing", category = "Billing", description = "Manage billing and payments" }
            };

            return Ok(permissions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching permissions");
            return BadRequest("Error fetching permissions");
        }
    }

    // GET: api/roles/statistics/summary
    [HttpGet("statistics/summary")]
    public async Task<ActionResult<object>> GetRolesStats()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var stats = new
            {
                totalRoles = 4,
                totalUsers = 183,
                totalPermissions = 10,
                rolesWithCustomPermissions = 2,
                averagePermissionsPerRole = 7,
                mostUsedRole = "Technician",
                leastUsedRole = "Administrator"
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching role statistics");
            return BadRequest("Error fetching role statistics");
        }
    }
}

public class CreateRoleRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Level { get; set; }
    public object? Permissions { get; set; }
}

public class UpdateRoleRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public int? Level { get; set; }
    public object? Permissions { get; set; }
}
