using Microsoft.EntityFrameworkCore;
using HandimanApp.Core.Entities;

namespace HandimanApp.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Account> Accounts { get; set; } = null!;
    public DbSet<TeamMember> TeamMembers { get; set; } = null!;
    public DbSet<Customer> Customers { get; set; } = null!;
    public DbSet<Job> Jobs { get; set; } = null!;
    public DbSet<JobMaterial> JobMaterials { get; set; } = null!;
    public DbSet<Invoice> Invoices { get; set; } = null!;
    public DbSet<Payment> Payments { get; set; } = null!;

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
    }
}
