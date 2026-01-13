using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HandimanApp.Infrastructure.Data;

namespace HandimanApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<DashboardStats>> GetStats([FromQuery] Guid? accountId)
        {
            var jobsQuery = _context.Jobs.AsQueryable();
            var invoicesQuery = _context.Invoices.AsQueryable();

            if (accountId.HasValue)
            {
                jobsQuery = jobsQuery.Where(j => j.AccountId == accountId);
                invoicesQuery = invoicesQuery.Where(i => i.AccountId == accountId);
            }

            var totalJobs = await jobsQuery.CountAsync();
            var completedJobs = await jobsQuery.CountAsync(j => j.Status == "completed");
            var inProgressJobs = await jobsQuery.CountAsync(j => j.Status == "in_progress");
            
            var totalRevenue = await invoicesQuery
                .Where(i => i.Status == "paid")
                .SumAsync(i => (decimal?)i.TotalAmount) ?? 0m;

            var pendingInvoices = await invoicesQuery
                .CountAsync(i => i.Status != "paid");

            return Ok(new DashboardStats
            {
                TotalJobs = totalJobs,
                CompletedJobs = completedJobs,
                InProgressJobs = inProgressJobs,
                TotalRevenue = totalRevenue,
                PendingInvoices = pendingInvoices
            });
        }

        [HttpGet("recent-jobs")]
        public async Task<ActionResult<IEnumerable<object>>> GetRecentJobs([FromQuery] Guid? accountId, [FromQuery] int limit = 5)
        {
            var query = _context.Jobs
                .Include(j => j.Customer)
                .AsQueryable();

            if (accountId.HasValue)
                query = query.Where(j => j.AccountId == accountId);

            var jobs = await query
                .OrderByDescending(j => j.CreatedAt)
                .Take(limit)
                .Select(j => new
                {
                    j.Id,
                    j.Title,
                    CustomerName = j.Customer != null ? $"{j.Customer.FirstName} {j.Customer.LastName}" : "Unknown",
                    j.Status,
                    j.ScheduledDate,
                    j.CreatedAt
                })
                .ToListAsync();

            return Ok(jobs);
        }

        [HttpGet("pending-invoices")]
        public async Task<ActionResult<IEnumerable<object>>> GetPendingInvoices([FromQuery] Guid? accountId)
        {
            var query = _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Job)
                .AsQueryable();

            if (accountId.HasValue)
                query = query.Where(i => i.AccountId == accountId);

            var invoices = await query
                .Where(i => i.Status != "paid")
                .OrderBy(i => i.DueDate)
                .Select(i => new
                {
                    i.Id,
                    i.InvoiceNumber,
                    CustomerName = i.Customer != null ? $"{i.Customer.FirstName} {i.Customer.LastName}" : "Unknown",
                    i.TotalAmount,
                    i.PaidAmount,
                    AmountDue = i.TotalAmount - i.PaidAmount,
                    i.DueDate,
                    i.Status
                })
                .ToListAsync();

            return Ok(invoices);
        }
    }

    public class DashboardStats
    {
        public int TotalJobs { get; set; }
        public int CompletedJobs { get; set; }
        public int InProgressJobs { get; set; }
        public decimal TotalRevenue { get; set; }
        public int PendingInvoices { get; set; }
    }
}
