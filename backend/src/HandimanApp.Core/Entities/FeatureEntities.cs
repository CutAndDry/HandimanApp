using System;

namespace HandimanApp.Core.Entities;

// Phase 1: Lead Management & Online Booking
public class OnlineBooking
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public Guid? CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string ServiceType { get; set; } = string.Empty; // Type of service requested
    public string Description { get; set; } = string.Empty;
    public DateTime ScheduledDate { get; set; }
    public string Status { get; set; } = "pending"; // pending, confirmed, cancelled, completed
    public decimal? QuotedPrice { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? ZipCode { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public Account? Account { get; set; }
    public Customer? Customer { get; set; }
}

public class Lead
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public Guid? CustomerId { get; set; }
    public string LeadSource { get; set; } = string.Empty; // website, phone, referral, etc.
    public string Status { get; set; } = "new"; // new, contacted, quoted, won, lost
    public decimal? EstimatedValue { get; set; }
    public DateTime? FollowUpDate { get; set; }
    public string Notes { get; set; } = string.Empty;
    public Guid? AssignedToId { get; set; } // TeamMember
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public Account? Account { get; set; }
    public Customer? Customer { get; set; }
}

public class ServiceHistory
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public Guid JobId { get; set; }
    public string ServiceType { get; set; } = string.Empty;
    public decimal Cost { get; set; }
    public DateTime ServiceDate { get; set; }
    public string Notes { get; set; } = string.Empty;
    
    public Customer? Customer { get; set; }
    public Job? Job { get; set; }
}

public class NotificationTemplate
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // sms, email
    public string Template { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public Account? Account { get; set; }
}

// Phase 2: Scheduling & Technician Skills
public class TechnicianSkill
{
    public Guid Id { get; set; }
    public Guid TeamMemberId { get; set; }
    public string SkillName { get; set; } = string.Empty;
    public string Proficiency { get; set; } = "intermediate"; // beginner, intermediate, expert
    public string? Certification { get; set; }
    public DateTime? CertificationExpiry { get; set; }
    public bool IsActive { get; set; } = true;
    
    public TeamMember? TeamMember { get; set; }
}

public class JobTemplate
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int EstimatedDurationMinutes { get; set; }
    public decimal BasePrice { get; set; }
    public bool IsActive { get; set; } = true;
    
    public Account? Account { get; set; }
}

// Phase 3: Financial Features
public class RecurringService
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public string ServiceType { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Frequency { get; set; } = "monthly"; // weekly, biweekly, monthly, quarterly, annual
    public DateTime NextScheduledDate { get; set; }
    public DateTime? LastServiceDate { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public Customer? Customer { get; set; }
}

public class JobCost
{
    public Guid Id { get; set; }
    public Guid JobId { get; set; }
    public string CostType { get; set; } = string.Empty; // labor, material, equipment, other
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public Job? Job { get; set; }
}

public class Expense
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public Guid? TeamMemberId { get; set; }
    public string Category { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime ExpenseDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public Account? Account { get; set; }
    public TeamMember? TeamMember { get; set; }
}

// Phase 4: Customer Communication & Reviews
public class CustomerReview
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public Guid JobId { get; set; }
    public Guid? TechnicianId { get; set; }
    public int Rating { get; set; } // 1-5 stars
    public string Review { get; set; } = string.Empty;
    public bool IsPublished { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public Customer? Customer { get; set; }
    public Job? Job { get; set; }
    public TeamMember? Technician { get; set; }
}

public class ChatMessage
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public Guid? TeamMemberId { get; set; }
    public Guid JobId { get; set; }
    public string Message { get; set; } = string.Empty;
    public string SenderType { get; set; } = "customer"; // customer, technician, system
    public string? AttachmentUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public Customer? Customer { get; set; }
    public TeamMember? TeamMember { get; set; }
    public Job? Job { get; set; }
}

public class Notification
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public Guid JobId { get; set; }
    public string Type { get; set; } = string.Empty; // sms, email, in_app
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? SentAt { get; set; }
    
    public Customer? Customer { get; set; }
    public Job? Job { get; set; }
}

// Phase 5: Technician Productivity
public class JobPhoto
{
    public Guid Id { get; set; }
    public Guid JobId { get; set; }
    public string PhotoUrl { get; set; } = string.Empty;
    public string PhotoType { get; set; } = "before"; // before, during, after, damage, inspection
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public Job? Job { get; set; }
}

public class TimeEntry
{
    public Guid Id { get; set; }
    public Guid JobId { get; set; }
    public Guid TeamMemberId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public int DurationMinutes { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsBillable { get; set; } = true;
    
    public Job? Job { get; set; }
    public TeamMember? TeamMember { get; set; }
}

public class InventoryItem
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int QuantityOnHand { get; set; }
    public int ReorderLevel { get; set; }
    public string Unit { get; set; } = "pcs"; // piece, box, roll, etc.
    public string Category { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    
    public Account? Account { get; set; }
}

public class InventoryUsage
{
    public Guid Id { get; set; }
    public Guid JobId { get; set; }
    public Guid InventoryItemId { get; set; }
    public int QuantityUsed { get; set; }
    public DateTime UsedAt { get; set; }
    
    public Job? Job { get; set; }
    public InventoryItem? InventoryItem { get; set; }
}

// Phase 6: AI & Automation
public class AutomationRule
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Trigger { get; set; } = string.Empty; // job_created, job_completed, invoice_sent, payment_received
    public string Action { get; set; } = string.Empty; // send_notification, create_follow_up, update_status
    public string ActionData { get; set; } = string.Empty; // JSON config
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public Account? Account { get; set; }
}

public class PricingRule
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public string RuleType { get; set; } = string.Empty; // base_price, complexity_multiplier, distance_multiplier
    public string ServiceType { get; set; } = string.Empty;
    public decimal BaseAmount { get; set; }
    public string Conditions { get; set; } = string.Empty; // JSON conditions
    public bool IsActive { get; set; } = true;
    
    public Account? Account { get; set; }
}

// Phase 7: Team Management
public class TeamRole
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Permissions { get; set; } = string.Empty; // JSON array of permissions
    public bool IsActive { get; set; } = true;
    
    public Account? Account { get; set; }
}

public class Integration
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public string IntegrationType { get; set; } = string.Empty; // quickbooks, stripe, twilio, google_calendar, slack
    public string ApiKey { get; set; } = string.Empty;
    public string? ApiSecret { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastSyncedAt { get; set; }
    
    public Account? Account { get; set; }
}

public class ApiLog
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public string IntegrationName { get; set; } = string.Empty;
    public string Endpoint { get; set; } = string.Empty;
    public string Method { get; set; } = string.Empty;
    public int StatusCode { get; set; }
    public string RequestData { get; set; } = string.Empty;
    public string ResponseData { get; set; } = string.Empty;
    public bool Success { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public Account? Account { get; set; }
}

public class PaymentMethod
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public string Type { get; set; } = string.Empty; // credit_card, bank_account, paypal
    public string Token { get; set; } = string.Empty; // Stripe token, etc.
    public string? Last4 { get; set; }
    public bool IsDefault { get; set; } = false;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public Customer? Customer { get; set; }
}

// Phase 2: Service Areas (for map-based routing & service coverage)
public class ServiceArea
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public int Radius { get; set; } = 15; // miles
    public double Latitude { get; set; } = 0;
    public double Longitude { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public Account? Account { get; set; }
}
