using Microsoft.EntityFrameworkCore;
using HandimanApp.Core.Entities;

namespace HandimanApp.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Core entities
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Account> Accounts { get; set; } = null!;
    public DbSet<TeamMember> TeamMembers { get; set; } = null!;
    public DbSet<Customer> Customers { get; set; } = null!;
    public DbSet<Job> Jobs { get; set; } = null!;
    public DbSet<JobMaterial> JobMaterials { get; set; } = null!;
    public DbSet<Invoice> Invoices { get; set; } = null!;
    public DbSet<Payment> Payments { get; set; } = null!;

    // Phase 1: Booking & Lead Management
    public DbSet<OnlineBooking> OnlineBookings { get; set; } = null!;
    public DbSet<Lead> Leads { get; set; } = null!;
    public DbSet<ServiceHistory> ServiceHistories { get; set; } = null!;
    public DbSet<NotificationTemplate> NotificationTemplates { get; set; } = null!;

    // Phase 2: Scheduling & Skills
    public DbSet<TechnicianSkill> TechnicianSkills { get; set; } = null!;
    public DbSet<JobTemplate> JobTemplates { get; set; } = null!;

    // Phase 3: Financial
    public DbSet<RecurringService> RecurringServices { get; set; } = null!;
    public DbSet<JobCost> JobCosts { get; set; } = null!;
    public DbSet<Expense> Expenses { get; set; } = null!;

    // Phase 4: Communication & Reviews
    public DbSet<CustomerReview> CustomerReviews { get; set; } = null!;
    public DbSet<ChatMessage> ChatMessages { get; set; } = null!;
    public DbSet<Notification> Notifications { get; set; } = null!;

    // Phase 5: Productivity Tools
    public DbSet<JobPhoto> JobPhotos { get; set; } = null!;
    public DbSet<TimeEntry> TimeEntries { get; set; } = null!;
    public DbSet<InventoryItem> InventoryItems { get; set; } = null!;
    public DbSet<InventoryUsage> InventoryUsages { get; set; } = null!;

    // Phase 6: AI & Automation
    public DbSet<AutomationRule> AutomationRules { get; set; } = null!;
    public DbSet<PricingRule> PricingRules { get; set; } = null!;

    // Phase 7: Team & Integrations
    public DbSet<TeamRole> TeamRoles { get; set; } = null!;
    public DbSet<Integration> Integrations { get; set; } = null!;
    public DbSet<ApiLog> ApiLogs { get; set; } = null!;
    public DbSet<PaymentMethod> PaymentMethods { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Account configuration
        modelBuilder.Entity<Account>()
            .HasOne(a => a.Owner)
            .WithMany(u => u.Accounts)
            .HasForeignKey(a => a.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        // TeamMember configuration
        modelBuilder.Entity<TeamMember>()
            .HasIndex(tm => new { tm.AccountId, tm.UserId })
            .IsUnique();

        // Job configuration
        modelBuilder.Entity<Job>()
            .HasOne(j => j.Account)
            .WithMany(a => a.Jobs)
            .HasForeignKey(j => j.AccountId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Job>()
            .HasOne(j => j.Customer)
            .WithMany(c => c.Jobs)
            .HasForeignKey(j => j.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Job>()
            .HasOne(j => j.AssignedTo)
            .WithMany(tm => tm.AssignedJobs)
            .HasForeignKey(j => j.AssignedToId)
            .OnDelete(DeleteBehavior.SetNull);

        // JobMaterial configuration
        modelBuilder.Entity<JobMaterial>()
            .HasOne(jm => jm.Job)
            .WithMany(j => j.Materials)
            .HasForeignKey(jm => jm.JobId)
            .OnDelete(DeleteBehavior.Cascade);

        // Invoice configuration
        modelBuilder.Entity<Invoice>()
            .HasIndex(i => i.InvoiceNumber)
            .IsUnique();

        modelBuilder.Entity<Invoice>()
            .HasOne(i => i.Job)
            .WithMany(j => j.Invoices)
            .HasForeignKey(i => i.JobId)
            .OnDelete(DeleteBehavior.Restrict);

        // Payment configuration
        modelBuilder.Entity<Payment>()
            .HasOne(p => p.Invoice)
            .WithMany(i => i.Payments)
            .HasForeignKey(p => p.InvoiceId)
            .OnDelete(DeleteBehavior.Cascade);

        // Phase 1: Booking & Lead Management
        modelBuilder.Entity<OnlineBooking>()
            .HasOne(b => b.Account)
            .WithMany()
            .HasForeignKey(b => b.AccountId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OnlineBooking>()
            .HasOne(b => b.Customer)
            .WithMany()
            .HasForeignKey(b => b.CustomerId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Lead>()
            .HasOne(l => l.Account)
            .WithMany()
            .HasForeignKey(l => l.AccountId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Lead>()
            .HasOne(l => l.Customer)
            .WithMany()
            .HasForeignKey(l => l.CustomerId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<ServiceHistory>()
            .HasOne(sh => sh.Customer)
            .WithMany()
            .HasForeignKey(sh => sh.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ServiceHistory>()
            .HasOne(sh => sh.Job)
            .WithMany()
            .HasForeignKey(sh => sh.JobId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<NotificationTemplate>()
            .HasOne(nt => nt.Account)
            .WithMany()
            .HasForeignKey(nt => nt.AccountId)
            .OnDelete(DeleteBehavior.Cascade);

        // Phase 2: Scheduling & Skills
        modelBuilder.Entity<TechnicianSkill>()
            .HasOne(ts => ts.TeamMember)
            .WithMany()
            .HasForeignKey(ts => ts.TeamMemberId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<JobTemplate>()
            .HasOne(jt => jt.Account)
            .WithMany()
            .HasForeignKey(jt => jt.AccountId)
            .OnDelete(DeleteBehavior.Cascade);

        // Phase 3: Financial
        modelBuilder.Entity<RecurringService>()
            .HasOne(rs => rs.Customer)
            .WithMany()
            .HasForeignKey(rs => rs.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<JobCost>()
            .HasOne(jc => jc.Job)
            .WithMany()
            .HasForeignKey(jc => jc.JobId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Expense>()
            .HasOne(e => e.Account)
            .WithMany()
            .HasForeignKey(e => e.AccountId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Expense>()
            .HasOne(e => e.TeamMember)
            .WithMany()
            .HasForeignKey(e => e.TeamMemberId)
            .OnDelete(DeleteBehavior.SetNull);

        // Phase 4: Communication & Reviews
        modelBuilder.Entity<CustomerReview>()
            .HasOne(cr => cr.Customer)
            .WithMany()
            .HasForeignKey(cr => cr.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CustomerReview>()
            .HasOne(cr => cr.Job)
            .WithMany()
            .HasForeignKey(cr => cr.JobId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<CustomerReview>()
            .HasOne(cr => cr.Technician)
            .WithMany()
            .HasForeignKey(cr => cr.TechnicianId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<ChatMessage>()
            .HasOne(cm => cm.Customer)
            .WithMany()
            .HasForeignKey(cm => cm.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ChatMessage>()
            .HasOne(cm => cm.TeamMember)
            .WithMany()
            .HasForeignKey(cm => cm.TeamMemberId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<ChatMessage>()
            .HasOne(cm => cm.Job)
            .WithMany()
            .HasForeignKey(cm => cm.JobId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Notification>()
            .HasOne(n => n.Customer)
            .WithMany()
            .HasForeignKey(n => n.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Notification>()
            .HasOne(n => n.Job)
            .WithMany()
            .HasForeignKey(n => n.JobId)
            .OnDelete(DeleteBehavior.Cascade);

        // Phase 5: Productivity Tools
        modelBuilder.Entity<JobPhoto>()
            .HasOne(jp => jp.Job)
            .WithMany()
            .HasForeignKey(jp => jp.JobId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TimeEntry>()
            .HasOne(te => te.Job)
            .WithMany()
            .HasForeignKey(te => te.JobId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TimeEntry>()
            .HasOne(te => te.TeamMember)
            .WithMany()
            .HasForeignKey(te => te.TeamMemberId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<InventoryItem>()
            .HasOne(ii => ii.Account)
            .WithMany()
            .HasForeignKey(ii => ii.AccountId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<InventoryUsage>()
            .HasOne(iu => iu.Job)
            .WithMany()
            .HasForeignKey(iu => iu.JobId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<InventoryUsage>()
            .HasOne(iu => iu.InventoryItem)
            .WithMany()
            .HasForeignKey(iu => iu.InventoryItemId)
            .OnDelete(DeleteBehavior.Restrict);

        // Phase 6: AI & Automation
        modelBuilder.Entity<AutomationRule>()
            .HasOne(ar => ar.Account)
            .WithMany()
            .HasForeignKey(ar => ar.AccountId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PricingRule>()
            .HasOne(pr => pr.Account)
            .WithMany()
            .HasForeignKey(pr => pr.AccountId)
            .OnDelete(DeleteBehavior.Cascade);

        // Phase 7: Team & Integrations
        modelBuilder.Entity<TeamRole>()
            .HasOne(tr => tr.Account)
            .WithMany()
            .HasForeignKey(tr => tr.AccountId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Integration>()
            .HasOne(i => i.Account)
            .WithMany()
            .HasForeignKey(i => i.AccountId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ApiLog>()
            .HasOne(al => al.Account)
            .WithMany()
            .HasForeignKey(al => al.AccountId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PaymentMethod>()
            .HasOne(pm => pm.Customer)
            .WithMany()
            .HasForeignKey(pm => pm.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);

        // Create indexes
        modelBuilder.Entity<User>().HasIndex(u => u.CreatedAt);
        modelBuilder.Entity<Account>().HasIndex(a => a.OwnerId);
        modelBuilder.Entity<Account>().HasIndex(a => a.SubscriptionTier);
        modelBuilder.Entity<Customer>().HasIndex(c => c.AccountId);
        modelBuilder.Entity<Job>().HasIndex(j => j.AccountId);
        modelBuilder.Entity<Job>().HasIndex(j => j.Status);
        modelBuilder.Entity<Job>().HasIndex(j => j.ScheduledDate);
        modelBuilder.Entity<Invoice>().HasIndex(i => i.AccountId);
        modelBuilder.Entity<Invoice>().HasIndex(i => i.Status);

        // Phase 1 Indexes
        modelBuilder.Entity<OnlineBooking>().HasIndex(ob => ob.AccountId);
        modelBuilder.Entity<OnlineBooking>().HasIndex(ob => ob.Status);
        modelBuilder.Entity<Lead>().HasIndex(l => l.AccountId);
        modelBuilder.Entity<Lead>().HasIndex(l => l.Status);
        modelBuilder.Entity<ServiceHistory>().HasIndex(sh => sh.CustomerId);
        modelBuilder.Entity<NotificationTemplate>().HasIndex(nt => nt.AccountId);

        // Phase 2 Indexes
        modelBuilder.Entity<TechnicianSkill>().HasIndex(ts => ts.TeamMemberId);
        modelBuilder.Entity<JobTemplate>().HasIndex(jt => jt.AccountId);

        // Phase 3 Indexes
        modelBuilder.Entity<RecurringService>().HasIndex(rs => rs.CustomerId);
        modelBuilder.Entity<JobCost>().HasIndex(jc => jc.JobId);
        modelBuilder.Entity<Expense>().HasIndex(e => e.AccountId);

        // Phase 4 Indexes
        modelBuilder.Entity<CustomerReview>().HasIndex(cr => cr.CustomerId);
        modelBuilder.Entity<CustomerReview>().HasIndex(cr => cr.JobId);
        modelBuilder.Entity<ChatMessage>().HasIndex(cm => cm.JobId);
        modelBuilder.Entity<Notification>().HasIndex(n => n.CustomerId);
        modelBuilder.Entity<Notification>().HasIndex(n => n.JobId);

        // Phase 5 Indexes
        modelBuilder.Entity<JobPhoto>().HasIndex(jp => jp.JobId);
        modelBuilder.Entity<TimeEntry>().HasIndex(te => te.JobId);
        modelBuilder.Entity<TimeEntry>().HasIndex(te => te.TeamMemberId);
        modelBuilder.Entity<InventoryItem>().HasIndex(ii => ii.AccountId);
        modelBuilder.Entity<InventoryUsage>().HasIndex(iu => iu.JobId);

        // Phase 6 Indexes
        modelBuilder.Entity<AutomationRule>().HasIndex(ar => ar.AccountId);
        modelBuilder.Entity<PricingRule>().HasIndex(pr => pr.AccountId);

        // Phase 7 Indexes
        modelBuilder.Entity<TeamRole>().HasIndex(tr => tr.AccountId);
        modelBuilder.Entity<Integration>().HasIndex(i => i.AccountId);
        modelBuilder.Entity<ApiLog>().HasIndex(al => al.AccountId);
        modelBuilder.Entity<PaymentMethod>().HasIndex(pm => pm.CustomerId);
    }
}
