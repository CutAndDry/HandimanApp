using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;
using System.Security.Claims;

namespace HandimanApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/analytics")]
public class AnalyticsController : ControllerBase
{
    private readonly ILogger<AnalyticsController> _logger;
    private readonly ApplicationDbContext _context;

    public AnalyticsController(ILogger<AnalyticsController> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    // GET: api/analytics/dashboard
    [HttpGet("dashboard")]
    public async Task<ActionResult<object>> GetDashboardMetrics([FromQuery] string period = "month")
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var metrics = new
            {
                period = period,
                totalRevenue = 45000m,
                totalJobs = 127,
                completedJobs = 118,
                completionRate = 92.9m,
                averageJobValue = 354m,
                totalHoursWorked = 234,
                averageHourlyRate = 125m,
                customerSatisfaction = 4.7m,
                repeatCustomerRate = 68.5m,
                outstandingPayments = 3500m,
                techniciansActive = 8
            };

            return Ok(metrics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching dashboard metrics");
            return BadRequest("Error fetching dashboard metrics");
        }
    }

    // GET: api/analytics/revenue
    [HttpGet("revenue")]
    public async Task<ActionResult<object>> GetRevenueAnalytics([FromQuery] string period = "month")
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var revenueData = new
            {
                period = period,
                totalRevenue = 45000m,
                breakdown = new
                {
                    byService = new[]
                    {
                        new { service = "Plumbing", revenue = 18000m, percentage = 40m, jobCount = 52 },
                        new { service = "Electrical", revenue = 14500m, percentage = 32.2m, jobCount = 38 },
                        new { service = "HVAC", revenue = 9200m, percentage = 20.4m, jobCount = 25 },
                        new { service = "General", revenue = 3300m, percentage = 7.3m, jobCount = 12 }
                    },
                    byCustomerType = new[]
                    {
                        new { type = "Residential", revenue = 32000m, percentage = 71.1m, jobCount = 89 },
                        new { type = "Commercial", revenue = 13000m, percentage = 28.9m, jobCount = 38 }
                    },
                    byPaymentStatus = new[]
                    {
                        new { status = "Paid", revenue = 41500m, percentage = 92.2m },
                        new { status = "Pending", revenue = 3500m, percentage = 7.8m }
                    }
                },
                trends = new[]
                {
                    new { month = "Jan", revenue = 38000m, jobCount = 112 },
                    new { month = "Feb", revenue = 42000m, jobCount = 118 },
                    new { month = "Mar", revenue = 45000m, jobCount = 127 }
                }
            };

            return Ok(revenueData);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching revenue analytics");
            return BadRequest("Error fetching revenue analytics");
        }
    }

    // GET: api/analytics/technician-performance
    [HttpGet("technician-performance")]
    public async Task<ActionResult<IEnumerable<object>>> GetTechnicianPerformance([FromQuery] string period = "month")
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var performance = new List<object>
            {
                new
                {
                    technicianId = "tech1",
                    name = "Mike Johnson",
                    jobsCompleted = 28,
                    jobsInProgress = 2,
                    totalRevenue = 12500m,
                    averageJobValue = 446m,
                    hoursWorked = 78.5m,
                    avgHourlyRate = 159m,
                    customerSatisfaction = 4.8m,
                    specialization = "Plumbing",
                    onTimePercentage = 96.4m,
                    rework = 1.2m
                },
                new
                {
                    technicianId = "tech2",
                    name = "Sarah Williams",
                    jobsCompleted = 24,
                    jobsInProgress = 1,
                    totalRevenue = 10800m,
                    averageJobValue = 450m,
                    hoursWorked = 72m,
                    avgHourlyRate = 150m,
                    customerSatisfaction = 4.6m,
                    specialization = "Electrical",
                    onTimePercentage = 91.7m,
                    rework = 2.1m
                },
                new
                {
                    technicianId = "tech3",
                    name = "Robert Chen",
                    jobsCompleted = 22,
                    jobsInProgress = 3,
                    totalRevenue = 9100m,
                    averageJobValue = 414m,
                    hoursWorked = 68.2m,
                    avgHourlyRate = 133m,
                    customerSatisfaction = 4.5m,
                    specialization = "HVAC",
                    onTimePercentage = 86.4m,
                    rework = 4.5m
                }
            };

            return Ok(performance);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching technician performance");
            return BadRequest("Error fetching technician performance");
        }
    }

    // GET: api/analytics/customer-metrics
    [HttpGet("customer-metrics")]
    public async Task<ActionResult<object>> GetCustomerMetrics()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var customerMetrics = new
            {
                totalCustomers = 156,
                newCustomersThisMonth = 12,
                activeCustomers = 89,
                churned = 4,
                repeatCustomers = 56,
                repeatRate = 68.5m,
                averageCustomerLifetimeValue = 3200m,
                satisfactionScore = 4.7m,
                nps = 58,
                bySegment = new[]
                {
                    new { segment = "High Value", count = 23, avgLifetimeValue = 8500m, satisfaction = 4.8m },
                    new { segment = "Regular", count = 45, avgLifetimeValue = 2300m, satisfaction = 4.6m },
                    new { segment = "One-time", count = 88, avgLifetimeValue = 450m, satisfaction = 4.3m }
                }
            };

            return Ok(customerMetrics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching customer metrics");
            return BadRequest("Error fetching customer metrics");
        }
    }

    // GET: api/analytics/job-metrics
    [HttpGet("job-metrics")]
    public async Task<ActionResult<object>> GetJobMetrics()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var jobMetrics = new
            {
                totalJobs = 127,
                completedJobs = 118,
                inProgressJobs = 7,
                quotedJobs = 2,
                completionRate = 92.9m,
                averageJobDuration = 1.84m, // days
                averageJobValue = 354m,
                byStatus = new[]
                {
                    new { status = "Completed", count = 118, percentage = 92.9m, avgValue = 365m },
                    new { status = "In Progress", count = 7, percentage = 5.5m, avgValue = 420m },
                    new { status = "Quoted", count = 2, percentage = 1.6m, avgValue = 1500m }
                },
                byType = new[]
                {
                    new { type = "Routine Maintenance", count = 45, percentage = 35.4m, avgValue = 280m },
                    new { type = "Repair", count = 52, percentage = 40.9m, avgValue = 380m },
                    new { type = "Installation", count = 20, percentage = 15.7m, avgValue = 520m },
                    new { type = "Emergency", count = 10, percentage = 7.9m, avgValue = 750m }
                }
            };

            return Ok(jobMetrics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching job metrics");
            return BadRequest("Error fetching job metrics");
        }
    }

    // GET: api/analytics/financial-report
    [HttpGet("financial-report")]
    public async Task<ActionResult<object>> GetFinancialReport([FromQuery] string period = "month")
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var report = new
            {
                period = period,
                income = new
                {
                    grossRevenue = 45000m,
                    discounts = 1200m,
                    netRevenue = 43800m
                },
                expenses = new
                {
                    laborCosts = 18500m,
                    materialsCosts = 8200m,
                    operatingExpenses = 5300m,
                    totalExpenses = 32000m
                },
                profitability = new
                {
                    grossProfit = 43800m,
                    netProfit = 11800m,
                    profitMargin = 27m,
                    operatingMargin = 26.8m,
                    roi = 36.9m
                },
                cashFlow = new
                {
                    collected = 41500m,
                    outstanding = 3500m,
                    collectionRate = 94.9m
                }
            };

            return Ok(report);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching financial report");
            return BadRequest("Error fetching financial report");
        }
    }

    // GET: api/analytics/reports
    [HttpGet("reports")]
    public async Task<ActionResult<IEnumerable<object>>> GetAvailableReports()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var reports = new List<object>
            {
                new { id = "monthly-revenue", name = "Monthly Revenue Report", description = "Detailed revenue breakdown by service type", lastGenerated = DateTime.UtcNow.AddDays(-1), frequency = "monthly" },
                new { id = "technician-productivity", name = "Technician Productivity Report", description = "Performance metrics for all technicians", lastGenerated = DateTime.UtcNow, frequency = "weekly" },
                new { id = "customer-satisfaction", name = "Customer Satisfaction Report", description = "NPS and review analytics", lastGenerated = DateTime.UtcNow.AddDays(-3), frequency = "monthly" },
                new { id = "financial-summary", name = "Financial Summary Report", description = "P&L, cash flow, and profitability metrics", lastGenerated = DateTime.UtcNow.AddDays(-5), frequency = "monthly" },
                new { id = "job-analysis", name = "Job Analysis Report", description = "Completion rates and job metrics", lastGenerated = DateTime.UtcNow.AddHours(-6), frequency = "weekly" }
            };

            return Ok(reports);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching reports");
            return BadRequest("Error fetching reports");
        }
    }

    // POST: api/analytics/reports/{id}/generate
    [HttpPost("reports/{id}/generate")]
    public async Task<ActionResult<object>> GenerateReport(string id, [FromQuery] string period = "month")
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var report = new
            {
                id = id,
                generatedAt = DateTime.UtcNow,
                period = period,
                status = "generated",
                format = "pdf",
                size = "2.3 MB",
                downloadUrl = $"/api/analytics/reports/{id}/download"
            };

            return Ok(report);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating report");
            return BadRequest("Error generating report");
        }
    }
}
