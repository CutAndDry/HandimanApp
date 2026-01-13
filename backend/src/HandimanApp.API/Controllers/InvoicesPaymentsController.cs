using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;

namespace HandimanApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/invoices-payments")]
public class InvoicesPaymentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<InvoicesPaymentsController> _logger;

    public InvoicesPaymentsController(ApplicationDbContext context, ILogger<InvoicesPaymentsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all invoices for an account
    /// </summary>
    [HttpGet("invoices")]
    public async Task<ActionResult<IEnumerable<dynamic>>> GetInvoices(
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

            var invoices = await _context.Invoices
                .Where(i => i.AccountId == accountGuid)
                .OrderByDescending(i => i.InvoiceDate)
                .Skip(offset)
                .Take(limit)
                .Select(i => new
                {
                    id = i.Id.ToString(),
                    invoiceNumber = i.InvoiceNumber,
                    jobId = i.JobId.ToString(),
                    customerId = i.CustomerId.ToString(),
                    totalAmount = i.TotalAmount,
                    paidAmount = i.PaidAmount,
                    status = i.Status,
                    invoiceDate = i.InvoiceDate,
                    dueDate = i.DueDate,
                    createdAt = i.CreatedAt
                })
                .ToListAsync();

            return Ok(invoices);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching invoices");
            return StatusCode(500, new { message = "Error fetching invoices" });
        }
    }

    /// <summary>
    /// Get a specific invoice
    /// </summary>
    [HttpGet("invoices/{id}")]
    public async Task<ActionResult<dynamic>> GetInvoice(string id)
    {
        try
        {
            if (!Guid.TryParse(id, out var invoiceGuid))
            {
                return BadRequest(new { message = "Invalid ID format" });
            }

            var invoice = await _context.Invoices
                .Where(i => i.Id == invoiceGuid)
                .FirstOrDefaultAsync();

            if (invoice == null)
            {
                return NotFound(new { message = "Invoice not found" });
            }

            return Ok(new
            {
                id = invoice.Id.ToString(),
                invoiceNumber = invoice.InvoiceNumber,
                jobId = invoice.JobId.ToString(),
                customerId = invoice.CustomerId.ToString(),
                accountId = invoice.AccountId.ToString(),
                laborHours = invoice.LaborHours,
                hourlyRate = invoice.HourlyRate,
                laborAmount = invoice.LaborAmount,
                materialCost = invoice.MaterialCost,
                subtotal = invoice.Subtotal,
                taxRate = invoice.TaxRate,
                taxAmount = invoice.TaxAmount,
                totalAmount = invoice.TotalAmount,
                paidAmount = invoice.PaidAmount,
                status = invoice.Status,
                invoiceDate = invoice.InvoiceDate,
                dueDate = invoice.DueDate,
                sentDate = invoice.SentDate,
                paymentDate = invoice.PaymentDate,
                notes = invoice.Notes,
                createdAt = invoice.CreatedAt,
                updatedAt = invoice.UpdatedAt
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching invoice");
            return StatusCode(500, new { message = "Error fetching invoice" });
        }
    }

    /// <summary>
    /// Get all payments
    /// </summary>
    [HttpGet("payments")]
    public async Task<ActionResult<IEnumerable<dynamic>>> GetPayments(
        [FromQuery] string? accountId,
        [FromQuery] int limit = 50,
        [FromQuery] int offset = 0)
    {
        try
        {
            var query = _context.Payments.AsQueryable();

            if (!string.IsNullOrEmpty(accountId) && Guid.TryParse(accountId, out var accountGuid))
            {
                query = query.Where(p => p.AccountId == accountGuid);
            }

            var payments = await query
                .OrderByDescending(p => p.PaymentDate)
                .Skip(offset)
                .Take(limit)
                .Select(p => new
                {
                    id = p.Id.ToString(),
                    invoiceId = p.InvoiceId.ToString(),
                    customerId = p.CustomerId.ToString(),
                    amount = p.Amount,
                    method = p.PaymentMethod,
                    paymentDate = p.PaymentDate,
                    reference = p.ReferenceNumber,
                    createdAt = p.CreatedAt
                })
                .ToListAsync();

            return Ok(payments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching payments");
            return StatusCode(500, new { message = "Error fetching payments" });
        }
    }

    /// <summary>
    /// Get a specific payment
    /// </summary>
    [HttpGet("payments/{id}")]
    public async Task<ActionResult<dynamic>> GetPayment(string id)
    {
        try
        {
            if (!Guid.TryParse(id, out var paymentGuid))
            {
                return BadRequest(new { message = "Invalid ID format" });
            }

            var payment = await _context.Payments
                .Where(p => p.Id == paymentGuid)
                .FirstOrDefaultAsync();

            if (payment == null)
            {
                return NotFound(new { message = "Payment not found" });
            }

            return Ok(new
            {
                id = payment.Id.ToString(),
                invoiceId = payment.InvoiceId.ToString(),
                customerId = payment.CustomerId.ToString(),
                accountId = payment.AccountId.ToString(),
                amount = payment.Amount,
                method = payment.PaymentMethod,
                reference = payment.ReferenceNumber,
                notes = payment.Notes,
                paymentDate = payment.PaymentDate,
                createdAt = payment.CreatedAt
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching payment");
            return StatusCode(500, new { message = "Error fetching payment" });
        }
    }

    /// <summary>
    /// Create a payment for an invoice
    /// </summary>
    [HttpPost("payments")]
    public async Task<ActionResult<dynamic>> CreatePayment([FromBody] CreatePaymentRequest request)
    {
        try
        {
            if (!Guid.TryParse(request.InvoiceId, out var invoiceGuid))
            {
                return BadRequest(new { message = "Invalid invoiceId" });
            }

            var invoice = await _context.Invoices.FindAsync(invoiceGuid);
            if (invoice == null)
            {
                return NotFound(new { message = "Invoice not found" });
            }

            var payment = new Payment
            {
                Id = Guid.NewGuid(),
                InvoiceId = invoiceGuid,
                CustomerId = invoice.CustomerId,
                AccountId = invoice.AccountId,
                Amount = request.Amount,
                PaymentMethod = request.Method ?? "card",
                ReferenceNumber = $"PAY-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 6).ToUpper()}",
                Notes = request.Notes,
                PaymentDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            _context.Payments.Add(payment);

            // Update invoice
            invoice.Status = "paid";
            invoice.PaymentDate = DateTime.UtcNow;
            invoice.PaidAmount = request.Amount;
            _context.Invoices.Update(invoice);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPayment), new { id = payment.Id.ToString() }, new
            {
                id = payment.Id.ToString(),
                invoiceId = payment.InvoiceId.ToString(),
                amount = payment.Amount,
                reference = payment.ReferenceNumber,
                message = "Payment created successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating payment");
            return StatusCode(500, new { message = "Error creating payment" });
        }
    }

    /// <summary>
    /// Get financial summary
    /// </summary>
    [HttpGet("summary")]
    public async Task<ActionResult<dynamic>> GetSummary([FromQuery] string? accountId)
    {
        try
        {
            var invoicesQuery = _context.Invoices.AsQueryable();
            var paymentsQuery = _context.Payments.AsQueryable();

            if (!string.IsNullOrEmpty(accountId) && Guid.TryParse(accountId, out var accountGuid))
            {
                invoicesQuery = invoicesQuery.Where(i => i.AccountId == accountGuid);
                paymentsQuery = paymentsQuery.Where(p => p.AccountId == accountGuid);
            }

            var invoices = await invoicesQuery.ToListAsync();
            var payments = await paymentsQuery.ToListAsync();

            var totalInvoiced = invoices.Sum(i => i.TotalAmount);
            var totalCollected = payments.Sum(p => p.Amount);
            var totalOutstanding = totalInvoiced - totalCollected;
            var paidInvoices = invoices.Count(i => i.Status == "paid");
            var unpaidInvoices = invoices.Count(i => i.Status != "paid" && i.Status != "overdue");

            return Ok(new
            {
                totalInvoices = invoices.Count,
                totalInvoiced = totalInvoiced,
                totalCollected = totalCollected,
                totalOutstanding = totalOutstanding,
                paidInvoices = paidInvoices,
                unpaidInvoices = unpaidInvoices,
                collectionRate = totalInvoiced > 0 ? (totalCollected / totalInvoiced * 100) : 0,
                totalPayments = payments.Count,
                averagePayment = payments.Any() ? payments.Average(p => p.Amount) : 0
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching summary");
            return StatusCode(500, new { message = "Error fetching summary" });
        }
    }
}

public class CreatePaymentRequest
{
    public string InvoiceId { get; set; } = "";
    public decimal Amount { get; set; }
    public string? Method { get; set; }
    public string? Notes { get; set; }
}
