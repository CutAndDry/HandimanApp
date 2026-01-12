namespace HandimanApp.Core.Entities;

public class Job
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public Guid CustomerId { get; set; }
    public Guid? AssignedToId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? JobType { get; set; } // new_work, repair, maintenance, emergency
    public string Status { get; set; } = "lead"; // lead, quoted, accepted, in_progress, completed, invoiced, paid
    public DateTime? ScheduledDate { get; set; }
    public TimeOnly? ScheduledTime { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public decimal? EstimatedLaborHours { get; set; }
    public decimal? ActualLaborHours { get; set; }
    public string? Location { get; set; }
    public string? LocationLat { get; set; }
    public string? LocationLng { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    // Navigation properties
    public virtual Account? Account { get; set; }
    public virtual Customer? Customer { get; set; }
    public virtual TeamMember? AssignedTo { get; set; }
    public virtual ICollection<JobMaterial> Materials { get; set; } = new List<JobMaterial>();
    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
}
