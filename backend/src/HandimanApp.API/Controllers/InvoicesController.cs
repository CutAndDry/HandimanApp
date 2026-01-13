using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;
using HandimanApp.Infrastructure.Services;

namespace HandimanApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InvoicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IPdfService _pdfService;
        private readonly IEmailService _emailService;

        public InvoicesController(ApplicationDbContext context, IPdfService pdfService, IEmailService emailService)
        {
            _context = context;
            _pdfService = pdfService;
            _emailService = emailService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Invoice>>> GetInvoices([FromQuery] Guid? accountId, [FromQuery] string? status)
        {
            var query = _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Job)
                .AsQueryable();

            if (accountId.HasValue)
                query = query.Where(i => i.AccountId == accountId);

            if (!string.IsNullOrEmpty(status))
                query = query.Where(i => i.Status == status);

            return Ok(await query.OrderByDescending(i => i.InvoiceDate).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Invoice>> GetInvoice(Guid id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Job)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (invoice == null)
                return NotFound();
            return Ok(invoice);
        }

        [HttpPost]
        public async Task<ActionResult<Invoice>> CreateInvoice(CreateInvoiceRequest request)
        {
            var invoice = new Invoice
            {
                AccountId = request.AccountId,
                JobId = request.JobId,
                CustomerId = request.CustomerId,
                InvoiceNumber = $"INV-{DateTime.Now:yyyyMMdd}-{new Random().Next(1000)}",
                InvoiceDate = DateTime.UtcNow,
                DueDate = DateTime.UtcNow.AddDays(30),
                LaborHours = request.LaborHours,
                HourlyRate = request.HourlyRate,
                LaborAmount = (request.LaborHours ?? 0m) * (request.HourlyRate ?? 0m),
                MaterialCost = request.MaterialCost ?? 0m,
                Subtotal = ((request.LaborHours ?? 0m) * (request.HourlyRate ?? 0m)) + (request.MaterialCost ?? 0m),
                TaxRate = request.TaxRate ?? 0.08m,
                Status = "draft",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Calculate tax and total
            invoice.TaxAmount = invoice.Subtotal * invoice.TaxRate;
            invoice.TotalAmount = invoice.Subtotal + invoice.TaxAmount;
            invoice.PaidAmount = 0;

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id }, invoice);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInvoice(Guid id, UpdateInvoiceRequest request)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null)
                return NotFound();

            invoice.Status = request.Status ?? invoice.Status;
            invoice.LaborHours = request.LaborHours ?? invoice.LaborHours;
            invoice.MaterialCost = request.MaterialCost ?? invoice.MaterialCost;
            invoice.UpdatedAt = DateTime.UtcNow;

            // Recalculate amounts
            var laborAmount = ((invoice.LaborHours ?? 0m) * (invoice.HourlyRate ?? 0m));
            invoice.LaborAmount = laborAmount;
            invoice.Subtotal = invoice.LaborAmount + invoice.MaterialCost;
            invoice.TaxAmount = invoice.Subtotal * invoice.TaxRate;
            invoice.TotalAmount = invoice.Subtotal + invoice.TaxAmount;

            await _context.SaveChangesAsync();
            return Ok(invoice);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(Guid id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null)
                return NotFound();

            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{id}/send")]
        public async Task<IActionResult> SendInvoice(Guid id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null)
                return NotFound();

            invoice.Status = "sent";
            invoice.SentDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Invoice sent", invoice });
        }

        [HttpPost("{id}/payment")]
        public async Task<IActionResult> RecordPayment(Guid id, RecordPaymentRequest request)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null)
                return NotFound();

            var payment = new Payment
            {
                InvoiceId = id,
                CustomerId = invoice.CustomerId,
                AccountId = invoice.AccountId,
                Amount = request.Amount,
                PaymentMethod = request.PaymentMethod,
                PaymentDate = DateTime.UtcNow,
                ReferenceNumber = request.ReferenceNumber,
                Notes = request.Notes,
                CreatedAt = DateTime.UtcNow
            };

            invoice.PaidAmount += request.Amount;
            if (invoice.PaidAmount >= invoice.TotalAmount)
                invoice.Status = "paid";

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Payment recorded", payment });
        }

        [HttpGet("{id}/pdf")]
        public async Task<IActionResult> GetInvoicePdf(Guid id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Job)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (invoice == null)
                return NotFound("Invoice not found");

            var pdfBytes = _pdfService.GenerateInvoicePdf(invoice);
            return File(pdfBytes, "application/pdf", $"invoice_{invoice.InvoiceNumber}.pdf");
        }

        [HttpPost("{id}/email")]
        public async Task<IActionResult> SendInvoiceEmail(Guid id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Customer)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (invoice == null)
                return NotFound("Invoice not found");

            if (string.IsNullOrEmpty(invoice.Customer?.Email))
                return BadRequest("Customer email not found");

            try
            {
                await _emailService.SendInvoiceAsync(
                    invoice.Customer.Email,
                    $"{invoice.Customer.FirstName} {invoice.Customer.LastName}",
                    invoice.InvoiceNumber,
                    invoice.TotalAmount
                );

                invoice.Status = "sent";
                await _context.SaveChangesAsync();

                return Ok(new { message = "Invoice sent successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to send email", error = ex.Message });
            }
        }
    }

    public class CreateInvoiceRequest
    {
        public Guid AccountId { get; set; }
        public Guid JobId { get; set; }
        public Guid CustomerId { get; set; }
        public decimal? LaborHours { get; set; }
        public decimal? HourlyRate { get; set; }
        public decimal? MaterialCost { get; set; }
        public decimal? TaxRate { get; set; }
    }

    public class UpdateInvoiceRequest
    {
        public string? Status { get; set; }
        public decimal? LaborHours { get; set; }
        public decimal? MaterialCost { get; set; }
    }

    public class RecordPaymentRequest
    {
        public decimal Amount { get; set; }
        public string? PaymentMethod { get; set; }
        public string? ReferenceNumber { get; set; }
        public string? Notes { get; set; }
    }
}
