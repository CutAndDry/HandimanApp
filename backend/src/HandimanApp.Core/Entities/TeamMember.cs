namespace HandimanApp.Core.Entities;

public class TeamMember
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public Guid UserId { get; set; }
    public string Role { get; set; } = "employee"; // owner, admin, employee
    public decimal HourlyRate { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Account? Account { get; set; }
    public virtual User? User { get; set; }
    public virtual ICollection<Job> AssignedJobs { get; set; } = new List<Job>();
}
