using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HandimanApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomerPortalController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CustomerPortalController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("customer/{customerId}/overview")]
    public async Task<ActionResult<object>> GetCustomerPortalOverview(Guid customerId)
    {
        var customer = await _context.Customers
            .Include(c => c.Jobs)
            .Include(c => c.Invoices)
            .FirstOrDefaultAsync(c => c.Id == customerId);

        if (customer == null)
        {
            return NotFound("Customer not found");
        }

        var activeJobs = await _context.Jobs
            .Where(j => j.CustomerId == customerId && (j.Status == "scheduled" || j.Status == "in-progress"))
            .Select(j => new { j.Id, j.Title, j.Status, j.ScheduledDate })
            .ToListAsync();

        var recentInvoices = await _context.Invoices
            .Where(i => i.CustomerId == customerId)
            .OrderByDescending(i => i.CreatedAt)
            .Take(5)
            .Select(i => new { i.Id, i.InvoiceNumber, i.TotalAmount, i.Status, i.CreatedAt })
            .ToListAsync();

        var serviceHistory = await _context.ServiceHistories
            .Where(sh => sh.CustomerId == customerId)
            .OrderByDescending(sh => sh.ServiceDate)
            .Take(5)
            .Select(sh => new { sh.ServiceType, sh.Cost, sh.ServiceDate })
            .ToListAsync();

        var bookings = await _context.OnlineBookings
            .Where(b => b.CustomerId == customerId)
            .OrderByDescending(b => b.CreatedAt)
            .Take(5)
            .Select(b => new { b.ServiceType, b.ScheduledDate, b.Status, b.CreatedAt })
            .ToListAsync();

        return Ok(new
        {
            customer = new
            {
                customer.Id,
                customer.FirstName,
                customer.LastName,
                customer.Email,
                customer.PhoneNumber
            },
            activeJobs,
            recentInvoices,
            serviceHistory,
            bookings,
            statistics = new
            {
                totalJobs = customer.Jobs.Count,
                totalInvoiced = customer.Invoices.Sum(i => i.TotalAmount),
                pendingInvoices = customer.Invoices.Count(i => i.Status != "paid")
            }
        });
    }

    [HttpGet("customer/{customerId}/jobs")]
    public async Task<ActionResult<IEnumerable<object>>> GetCustomerJobs(
        Guid customerId,
        [FromQuery] string? status = null,
        [FromQuery] int limit = 20,
        [FromQuery] int offset = 0)
    {
        var query = _context.Jobs.Where(j => j.CustomerId == customerId);

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(j => j.Status == status);
        }

        var jobs = await query
            .OrderByDescending(j => j.CreatedAt)
            .Skip(offset)
            .Take(limit)
            .Select(j => new
            {
                j.Id,
                j.Title,
                j.Description,
                j.Status,
                j.ScheduledDate,
                j.CompletedAt,
                j.CreatedAt
            })
            .ToListAsync();

        return Ok(jobs);
    }

    [HttpGet("customer/{customerId}/invoices")]
    public async Task<ActionResult<IEnumerable<object>>> GetCustomerInvoices(
        Guid customerId,
        [FromQuery] string? status = null,
        [FromQuery] int limit = 20,
        [FromQuery] int offset = 0)
    {
        var query = _context.Invoices.Where(i => i.CustomerId == customerId);

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(i => i.Status == status);
        }

        var invoices = await query
            .OrderByDescending(i => i.CreatedAt)
            .Skip(offset)
            .Take(limit)
            .Select(i => new
            {
                i.Id,
                i.InvoiceNumber,
                i.TotalAmount,
                i.PaidAmount,
                i.Status,
                i.DueDate,
                i.CreatedAt
            })
            .ToListAsync();

        return Ok(invoices);
    }

    [HttpGet("customer/{customerId}/service-history")]
    public async Task<ActionResult<IEnumerable<object>>> GetServiceHistory(
        Guid customerId,
        [FromQuery] int limit = 20,
        [FromQuery] int offset = 0)
    {
        var history = await _context.ServiceHistories
            .Where(sh => sh.CustomerId == customerId)
            .OrderByDescending(sh => sh.ServiceDate)
            .Skip(offset)
            .Take(limit)
            .Select(sh => new
            {
                sh.ServiceType,
                sh.Cost,
                sh.ServiceDate,
                sh.Notes
            })
            .ToListAsync();

        return Ok(history);
    }

    [HttpPost("customer/{customerId}/book-service")]
    public async Task<ActionResult<object>> BookService(Guid customerId, [FromBody] BookServiceRequest request)
    {
        var customer = await _context.Customers.FindAsync(customerId);
        if (customer == null)
        {
            return NotFound("Customer not found");
        }

        var booking = new OnlineBooking
        {
            Id = Guid.NewGuid(),
            AccountId = request.AccountId,
            CustomerId = customerId,
            CustomerName = $"{customer.FirstName} {customer.LastName}",
            CustomerEmail = customer.Email ?? string.Empty,
            CustomerPhone = customer.PhoneNumber ?? string.Empty,
            ServiceType = request.ServiceType ?? string.Empty,
            Description = request.Description ?? string.Empty,
            ScheduledDate = request.ScheduledDate,
            Status = "pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.OnlineBookings.Add(booking);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetBooking", "Bookings", new { id = booking.Id }, new
        {
            booking.Id,
            booking.Status,
            message = "Service booking request submitted successfully"
        });
    }

    [HttpGet("customer/{customerId}/reviews")]
    public async Task<ActionResult<IEnumerable<object>>> GetCustomerReviews(Guid customerId)
    {
        var reviews = await _context.CustomerReviews
            .Where(r => r.CustomerId == customerId && r.IsPublished)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new
            {
                r.Id,
                r.Rating,
                r.Review,
                r.CreatedAt
            })
            .ToListAsync();

        return Ok(reviews);
    }

    [HttpPost("customer/{customerId}/submit-review")]
    public async Task<ActionResult<object>> SubmitReview(Guid customerId, [FromBody] SubmitReviewRequest request)
    {
        var job = await _context.Jobs.FindAsync(request.JobId);
        if (job == null || job.CustomerId != customerId)
        {
            return BadRequest("Invalid job");
        }

        var review = new CustomerReview
        {
            Id = Guid.NewGuid(),
            CustomerId = customerId,
            JobId = request.JobId,
            TechnicianId = request.TechnicianId,
            Rating = request.Rating,
            Review = request.ReviewText ?? string.Empty,
            IsPublished = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.CustomerReviews.Add(review);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCustomerReviews), new { customerId }, new
        {
            review.Id,
            message = "Review submitted successfully"
        });
    }
}

public class BookServiceRequest
{
    public Guid AccountId { get; set; }
    public string? ServiceType { get; set; }
    public string? Description { get; set; }
    public DateTime ScheduledDate { get; set; }
}

public class SubmitReviewRequest
{
    public Guid JobId { get; set; }
    public Guid? TechnicianId { get; set; }
    public int Rating { get; set; }
    public string? ReviewText { get; set; }
}
