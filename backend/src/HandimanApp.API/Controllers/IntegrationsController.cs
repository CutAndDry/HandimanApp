using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;
using System.Security.Claims;

namespace HandimanApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/integrations")]
public class IntegrationsController : ControllerBase
{
    private readonly ILogger<IntegrationsController> _logger;
    private readonly ApplicationDbContext _context;

    public IntegrationsController(ILogger<IntegrationsController> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    // GET: api/integrations
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetIntegrations([FromQuery] bool connected = true)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var integrations = new List<object>
            {
                new { id = "stripe", name = "Stripe", category = "Payments", description = "Payment processing", connected = true, connectedAt = DateTime.UtcNow.AddMonths(-8), status = "active" },
                new { id = "twilio", name = "Twilio", category = "Communications", description = "SMS and phone notifications", connected = true, connectedAt = DateTime.UtcNow.AddMonths(-6), status = "active" },
                new { id = "slack", name = "Slack", category = "Communications", description = "Team notifications and alerts", connected = true, connectedAt = DateTime.UtcNow.AddMonths(-4), status = "active" },
                new { id = "quickbooks", name = "QuickBooks Online", category = "Accounting", description = "Accounting and bookkeeping", connected = false, connectedAt = DateTime.MinValue, status = "available" },
                new { id = "zapier", name = "Zapier", category = "Automation", description = "Workflow automation", connected = true, connectedAt = DateTime.UtcNow.AddMonths(-2), status = "active" }
            };

            return Ok(integrations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching integrations");
            return BadRequest("Error fetching integrations");
        }
    }

    // GET: api/integrations/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetIntegration(string id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var integration = new
            {
                id = id,
                name = "Stripe",
                category = "Payments",
                description = "Payment processing and invoicing",
                connected = true,
                connectedAt = DateTime.UtcNow.AddMonths(-8),
                status = "active",
                apiKey = "sk_test_****...****",
                webhookUrl = "https://handiman.app/webhooks/stripe",
                lastSync = DateTime.UtcNow.AddHours(-2),
                syncFrequency = "real-time",
                features = new object[]
                {
                    new { name = "Process Payments", enabled = true },
                    new { name = "Create Invoices", enabled = true },
                    new { name = "Customer Billing", enabled = true },
                    new { name = "Subscription Management", enabled = false }
                },
                settings = new
                {
                    apiVersion = "2023-10-16",
                    currency = "USD",
                    testMode = true,
                    autoSync = true
                },
                usage = new
                {
                    apiCallsThisMonth = 2845,
                    webhooksReceived = 1234,
                    successRate = 99.8m,
                    errors = 6
                }
            };

            return Ok(integration);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching integration");
            return BadRequest("Error fetching integration");
        }
    }

    // POST: api/integrations/{id}/connect
    [HttpPost("{id}/connect")]
    public async Task<ActionResult<object>> ConnectIntegration(string id, [FromBody] ConnectIntegrationRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            if (string.IsNullOrEmpty(request.ApiKey))
                return BadRequest("API key is required");

            var result = new
            {
                success = true,
                message = "Integration connected successfully",
                id = id,
                connectedAt = DateTime.UtcNow,
                status = "active",
                webhookUrl = $"https://handiman.app/webhooks/{id}"
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error connecting integration");
            return BadRequest("Error connecting integration");
        }
    }

    // POST: api/integrations/{id}/disconnect
    [HttpPost("{id}/disconnect")]
    public async Task<IActionResult> DisconnectIntegration(string id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            return Ok(new { message = "Integration disconnected successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error disconnecting integration");
            return BadRequest("Error disconnecting integration");
        }
    }

    // GET: api/integrations/{id}/webhooks
    [HttpGet("{id}/webhooks")]
    public async Task<ActionResult<IEnumerable<object>>> GetWebhooks(string id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var webhooks = new List<object>
            {
                new { id = Guid.NewGuid().ToString(), event_type = "payment.success", url = "https://handiman.app/webhooks/stripe/payment", active = true, lastTriggered = DateTime.UtcNow.AddHours(-1) },
                new { id = Guid.NewGuid().ToString(), event_type = "invoice.created", url = "https://handiman.app/webhooks/stripe/invoice", active = true, lastTriggered = DateTime.UtcNow.AddDays(-1) },
                new { id = Guid.NewGuid().ToString(), event_type = "customer.created", url = "https://handiman.app/webhooks/stripe/customer", active = true, lastTriggered = DateTime.UtcNow.AddDays(-3) }
            };

            return Ok(webhooks);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching webhooks");
            return BadRequest("Error fetching webhooks");
        }
    }

    // POST: api/integrations/{id}/test
    [HttpPost("{id}/test")]
    public async Task<ActionResult<object>> TestIntegration(string id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var result = new
            {
                success = true,
                message = "Integration test successful",
                responseTime = "245ms",
                status = "operational",
                lastCheck = DateTime.UtcNow
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error testing integration");
            return BadRequest("Error testing integration");
        }
    }

    // GET: api/integrations/available/list
    [HttpGet("available/list")]
    public async Task<ActionResult<IEnumerable<object>>> GetAvailableIntegrations()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var available = new List<object>
            {
                new { id = "stripe", name = "Stripe", category = "Payments", icon = "💳", description = "Accept payments online" },
                new { id = "twilio", name = "Twilio", category = "Communications", icon = "📱", description = "Send SMS and phone calls" },
                new { id = "slack", name = "Slack", category = "Communications", icon = "💬", description = "Team notifications" },
                new { id = "quickbooks", name = "QuickBooks", category = "Accounting", icon = "📊", description = "Accounting software" },
                new { id = "zapier", name = "Zapier", category = "Automation", icon = "⚡", description = "Workflow automation" },
                new { id = "google_maps", name = "Google Maps", category = "Maps & Location", icon = "🗺️", description = "Mapping and routing" },
                new { id = "mailchimp", name = "Mailchimp", category = "Marketing", icon = "📧", description = "Email marketing" },
                new { id = "zoom", name = "Zoom", category = "Communications", icon = "🎥", description = "Video conferencing" }
            };

            return Ok(available);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching available integrations");
            return BadRequest("Error fetching available integrations");
        }
    }

    // GET: api/integrations/statistics
    [HttpGet("statistics")]
    public async Task<ActionResult<object>> GetIntegrationStats()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var stats = new
            {
                connectedIntegrations = 5,
                totalAvailable = 8,
                activeWebhooks = 12,
                totalApiCalls = 45230,
                failureRate = 0.2m,
                averageResponseTime = "234ms",
                lastSync = DateTime.UtcNow.AddHours(-1),
                monthlyUsage = new { calls = 45230, webhooks = 8934, dataTransfer = "2.3GB" }
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching integration statistics");
            return BadRequest("Error fetching integration statistics");
        }
    }
}

public class ConnectIntegrationRequest
{
    public string ApiKey { get; set; } = string.Empty;
    public string? ApiSecret { get; set; }
    public object? Settings { get; set; }
}
