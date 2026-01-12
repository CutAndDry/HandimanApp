namespace HandimanApp.Core.Entities;

public class Invoice
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public Guid JobId { get; set; }
    public Guid CustomerId { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;
    public DateTime DueDate { get; set; }
    public decimal? LaborHours { get; set; }
    public decimal? HourlyRate { get; set; }
    public decimal LaborAmount { get; set; } = 0;
    public decimal MaterialCost { get; set; } = 0;
    public decimal Subtotal { get; set; }
    public decimal TaxRate { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal PaidAmount { get; set; } = 0;
    public string Status { get; set; } = "draft"; // draft, sent, viewed, accepted, paid, overdue
    public DateTime? SentDate { get; set; }
    public DateTime? ViewedDate { get; set; }
    public DateTime? PaymentDate { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Account? Account { get; set; }
    public virtual Job? Job { get; set; }
    public virtual Customer? Customer { get; set; }
    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
