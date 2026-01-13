namespace HandimanApp.Core.Entities;

public class TeamMember
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public Guid UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Employee;
    public decimal HourlyRate { get; set; }
    public string? InviteToken { get; set; }
    public bool IsInviteAccepted { get; set; } = false;
    public DateTime? InviteAcceptedAt { get; set; }
    public DateTime InviteSentAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAt { get; set; }

    // Navigation properties
    public virtual Account? Account { get; set; }
    public virtual User? User { get; set; }
    public virtual ICollection<Job> AssignedJobs { get; set; } = new List<Job>();
}
