namespace HandimanApp.Core.Entities;

public class JobMaterial
{
    public Guid Id { get; set; }
    public Guid JobId { get; set; }
    public string? SupplierName { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Quantity { get; set; } = 1;
    public decimal UnitPrice { get; set; }
    public decimal TotalCost { get; set; }
    public string? MaterialType { get; set; } // electrical, plumbing, general
    public string? ReceiptImageUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Job? Job { get; set; }
}
