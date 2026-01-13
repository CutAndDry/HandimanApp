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
public class BookingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BookingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetBookings(
        [FromQuery] string? status = null,
        [FromQuery] string? search = null,
        [FromQuery] int limit = 20,
        [FromQuery] int offset = 0)
    {
        var query = _context.OnlineBookings.AsQueryable();

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(b => b.Status == status);
        }

        if (!string.IsNullOrEmpty(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(b =>
                b.CustomerName.ToLower().Contains(searchLower) ||
                b.CustomerEmail.ToLower().Contains(searchLower) ||
                b.ServiceType.ToLower().Contains(searchLower));
        }

        var bookings = await query
            .OrderByDescending(b => b.CreatedAt)
            .Skip(offset)
            .Take(limit)
            .Select(b => new
            {
                b.Id,
                b.CustomerName,
                b.CustomerEmail,
                b.CustomerPhone,
                b.ServiceType,
                b.Description,
                b.ScheduledDate,
                b.Status,
                b.QuotedPrice,
                b.CreatedAt
            })
            .ToListAsync();

        return Ok(bookings);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetBooking(Guid id)
    {
        var booking = await _context.OnlineBookings.FindAsync(id);
        if (booking == null)
        {
            return NotFound();
        }

        return Ok(new
        {
            booking.Id,
            booking.CustomerName,
            booking.CustomerEmail,
            booking.CustomerPhone,
            booking.ServiceType,
            booking.Description,
            booking.ScheduledDate,
            booking.Status,
            booking.QuotedPrice,
            booking.Address,
            booking.City,
            booking.State,
            booking.ZipCode,
            booking.CreatedAt,
            booking.UpdatedAt
        });
    }

    [HttpPost]
    public async Task<ActionResult<object>> CreateBooking([FromBody] CreateBookingRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CustomerName) ||
            string.IsNullOrWhiteSpace(request.CustomerEmail))
        {
            return BadRequest("Customer name and email are required");
        }

        var booking = new OnlineBooking
        {
            Id = Guid.NewGuid(),
            AccountId = request.AccountId,
            CustomerId = request.CustomerId,
            CustomerName = request.CustomerName,
            CustomerEmail = request.CustomerEmail,
            CustomerPhone = request.CustomerPhone ?? string.Empty,
            ServiceType = request.ServiceType ?? string.Empty,
            Description = request.Description ?? string.Empty,
            ScheduledDate = request.ScheduledDate,
            Status = "pending",
            QuotedPrice = request.QuotedPrice,
            Address = request.Address,
            City = request.City,
            State = request.State,
            ZipCode = request.ZipCode,
            CreatedAt = DateTime.UtcNow
        };

        _context.OnlineBookings.Add(booking);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, new
        {
            booking.Id,
            booking.CustomerName,
            booking.CustomerEmail,
            booking.Status,
            booking.CreatedAt
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBooking(Guid id, [FromBody] UpdateBookingRequest request)
    {
        var booking = await _context.OnlineBookings.FindAsync(id);
        if (booking == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            booking.Status = request.Status;
        }

        if (request.QuotedPrice.HasValue)
        {
            booking.QuotedPrice = request.QuotedPrice.Value;
        }

        booking.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Booking updated successfully" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBooking(Guid id)
    {
        var booking = await _context.OnlineBookings.FindAsync(id);
        if (booking == null)
        {
            return NotFound();
        }

        _context.OnlineBookings.Remove(booking);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Booking deleted successfully" });
    }
}

public class CreateBookingRequest
{
    public Guid AccountId { get; set; }
    public Guid? CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string? CustomerPhone { get; set; }
    public string? ServiceType { get; set; }
    public string? Description { get; set; }
    public DateTime ScheduledDate { get; set; }
    public decimal? QuotedPrice { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? ZipCode { get; set; }
}

public class UpdateBookingRequest
{
    public string? Status { get; set; }
    public decimal? QuotedPrice { get; set; }
}
