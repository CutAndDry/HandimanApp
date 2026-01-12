namespace HandimanApp.Core.Entities;

public class Payment
{
    public Guid Id { get; set; }
    public Guid InvoiceId { get; set; }
    public Guid CustomerId { get; set; }
    public Guid AccountId { get; set; }
    public decimal Amount { get; set; }
    public string? PaymentMethod { get; set; } // cash, check, card, ach, other
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    public string? ReferenceNumber { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Invoice? Invoice { get; set; }
}
