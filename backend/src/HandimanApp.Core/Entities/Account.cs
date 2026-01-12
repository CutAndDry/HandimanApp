namespace HandimanApp.Core.Entities;

public class Account
{
    public Guid Id { get; set; }
    public Guid OwnerId { get; set; }
    public string BusinessName { get; set; } = string.Empty;
    public string BusinessType { get; set; } = "solo"; // solo, team
    public string SubscriptionTier { get; set; } = "free"; // free, team_basic, team_pro, enterprise
    public int MaxTeamMembers { get; set; } = 1;
    public int CurrentTeamMembers { get; set; } = 1;
    public decimal? HourlyRate { get; set; }
    public decimal TaxRate { get; set; } = 8.00m;
    public string? BusinessAddress { get; set; }
    public string? BusinessCity { get; set; }
    public string? BusinessState { get; set; }
    public string? BusinessPostalCode { get; set; }
    public string? BusinessPhone { get; set; }
    public string? DefaultInvoiceNotes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? SubscriptionStartDate { get; set; }
    public DateTime? SubscriptionEndDate { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual User? Owner { get; set; }
    public virtual ICollection<TeamMember> TeamMembers { get; set; } = new List<TeamMember>();
    public virtual ICollection<Customer> Customers { get; set; } = new List<Customer>();
    public virtual ICollection<Job> Jobs { get; set; } = new List<Job>();
    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
}
