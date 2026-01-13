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
public class LeadsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LeadsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetLeads(
        [FromQuery] string? status = null,
        [FromQuery] string? search = null,
        [FromQuery] Guid? accountId = null,
        [FromQuery] int limit = 20,
        [FromQuery] int offset = 0)
    {
        var query = _context.Leads.AsQueryable();

        if (accountId.HasValue)
        {
            query = query.Where(l => l.AccountId == accountId.Value);
        }

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(l => l.Status == status);
        }

        if (!string.IsNullOrEmpty(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(l =>
                l.Customer != null && (l.Customer.FirstName.ToLower().Contains(searchLower) ||
                l.Customer.LastName.ToLower().Contains(searchLower) ||
                l.LeadSource.ToLower().Contains(searchLower)));
        }

        var leads = await query
            .Include(l => l.Customer)
            .OrderByDescending(l => l.CreatedAt)
            .Skip(offset)
            .Take(limit)
            .Select(l => new
            {
                l.Id,
                CustomerName = l.Customer != null ? $"{l.Customer.FirstName} {l.Customer.LastName}" : "Unknown",
                l.LeadSource,
                l.Status,
                l.EstimatedValue,
                l.FollowUpDate,
                l.CreatedAt
            })
            .ToListAsync();

        return Ok(leads);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetLead(Guid id)
    {
        var lead = await _context.Leads
            .Include(l => l.Customer)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (lead == null)
        {
            return NotFound();
        }

        return Ok(new
        {
            lead.Id,
            CustomerName = lead.Customer != null ? $"{lead.Customer.FirstName} {lead.Customer.LastName}" : "Unknown",
            lead.LeadSource,
            lead.Status,
            lead.EstimatedValue,
            lead.FollowUpDate,
            lead.Notes,
            lead.CreatedAt,
            lead.UpdatedAt
        });
    }

    [HttpPost]
    public async Task<ActionResult<object>> CreateLead([FromBody] CreateLeadRequest request)
    {
        var lead = new Lead
        {
            Id = Guid.NewGuid(),
            AccountId = request.AccountId,
            CustomerId = request.CustomerId,
            LeadSource = request.LeadSource ?? "other",
            Status = "new",
            EstimatedValue = request.EstimatedValue,
            Notes = request.Notes ?? string.Empty,
            CreatedAt = DateTime.UtcNow
        };

        _context.Leads.Add(lead);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetLead), new { id = lead.Id }, new
        {
            lead.Id,
            lead.LeadSource,
            lead.Status,
            lead.CreatedAt
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLead(Guid id, [FromBody] UpdateLeadRequest request)
    {
        var lead = await _context.Leads.FindAsync(id);
        if (lead == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            lead.Status = request.Status;
        }

        if (request.FollowUpDate.HasValue)
        {
            lead.FollowUpDate = request.FollowUpDate.Value;
        }

        if (!string.IsNullOrWhiteSpace(request.Notes))
        {
            lead.Notes = request.Notes;
        }

        if (request.EstimatedValue.HasValue)
        {
            lead.EstimatedValue = request.EstimatedValue.Value;
        }

        lead.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Lead updated successfully" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLead(Guid id)
    {
        var lead = await _context.Leads.FindAsync(id);
        if (lead == null)
        {
            return NotFound();
        }

        _context.Leads.Remove(lead);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Lead deleted successfully" });
    }

    [HttpGet("dashboard/summary")]
    public async Task<ActionResult<object>> GetLeadDashboardSummary([FromQuery] Guid accountId)
    {
        var leads = await _context.Leads
            .Where(l => l.AccountId == accountId)
            .ToListAsync();

        var summary = new
        {
            total = leads.Count,
            new_leads = leads.Count(l => l.Status == "new"),
            contacted = leads.Count(l => l.Status == "contacted"),
            quoted = leads.Count(l => l.Status == "quoted"),
            won = leads.Count(l => l.Status == "won"),
            lost = leads.Count(l => l.Status == "lost"),
            total_value = leads.Where(l => l.EstimatedValue.HasValue).Sum(l => l.EstimatedValue.Value)
        };

        return Ok(summary);
    }
}

public class CreateLeadRequest
{
    public Guid AccountId { get; set; }
    public Guid? CustomerId { get; set; }
    public string? LeadSource { get; set; }
    public decimal? EstimatedValue { get; set; }
    public string? Notes { get; set; }
}

public class UpdateLeadRequest
{
    public string? Status { get; set; }
    public DateTime? FollowUpDate { get; set; }
    public string? Notes { get; set; }
    public decimal? EstimatedValue { get; set; }
}
