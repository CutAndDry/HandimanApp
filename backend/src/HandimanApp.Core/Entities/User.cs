namespace HandimanApp.Core.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? ProfilePhotoUrl { get; set; }
    public UserRole Role { get; set; } = UserRole.Employee;
    public Guid? AccountId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAt { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();
    public virtual ICollection<TeamMember> TeamMembers { get; set; } = new List<TeamMember>();
}

public enum UserRole
{
    Admin = 1,      // Account owner - full access
    Manager = 2,    // Can manage team and view financials
    Employee = 3    // Can only view assigned jobs
}
