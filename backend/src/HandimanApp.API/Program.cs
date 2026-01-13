using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Text;
using HandimanApp.Infrastructure.Data;
using HandimanApp.Infrastructure.Services;
using HandimanApp.Core.Entities;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<IAuthService, AuthService>();
// PDF and Email services commented out temporarily due to dependency issues
// builder.Services.AddScoped<IPdfService, PdfService>();
// builder.Services.AddScoped<IEmailService, EmailService>();

// Add DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = Encoding.ASCII.GetBytes(jwtSettings["SecretKey"] ?? "change-this-to-a-real-secret-key-minimum-32-characters");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(secretKey),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "http://localhost:3173",
            "http://localhost:5173",
            "https://handiman.app"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

// Add Swagger/OpenAPI
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "HandimanApp API",
        Version = "v1",
        Description = "Field Service Management API for Trades Professionals"
    });

    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "JWT Authentication",
        Description = "Enter a valid token",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    };

    c.AddSecurityDefinition("Bearer", securityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { securityScheme, Array.Empty<string>() }
    });
});

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "HandimanApp API V1");
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

// Root endpoint
app.MapGet("/", () => new { 
    message = "HandimanApp API", 
    version = "1.0",
    docs = "/swagger",
    status = "running"
});

// Health check
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));

app.MapControllers();

// Database migration
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var authService = scope.ServiceProvider.GetRequiredService<IAuthService>();
    
    dbContext.Database.Migrate();
    Log.Information("Database migrated successfully");

    // Seed test user if it doesn't exist
    if (!dbContext.Users.Any(u => u.Email == "test@handiman.app"))
    {
        var testUser = new User
        {
            FirstName = "Test",
            LastName = "User",
            Email = "test@handiman.app",
            PasswordHash = authService.HashPassword("Test123!"),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        dbContext.Users.Add(testUser);
        dbContext.SaveChanges();
        Log.Information("Test user created: test@handiman.app / Test123!");

        // Create account for test user
        var testAccount = new Account
        {
            OwnerId = testUser.Id,
            BusinessName = "Test Business",
            BusinessType = "team",
            BusinessPhone = "555-1234",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        dbContext.Accounts.Add(testAccount);
        dbContext.SaveChanges();
        Log.Information("Test account created for test user");

        // Seed sample customers if none exist
        if (!dbContext.Customers.Any())
        {
            var customers = new[]
            {
                new Customer
                {
                    AccountId = testAccount.Id,
                    FirstName = "Jane",
                    LastName = "Smith",
                    Email = "jane.smith@example.com",
                    PhoneNumber = "555-2222",
                    Address = "123 Oak St",
                    City = "New York",
                    State = "NY",
                    PostalCode = "10001",
                    Country = "USA",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Customer
                {
                    AccountId = testAccount.Id,
                    FirstName = "Mike",
                    LastName = "Johnson",
                    Email = "mike.j@example.com",
                    PhoneNumber = "555-3333",
                    Address = "456 Pine Ave",
                    City = "Boston",
                    State = "MA",
                    PostalCode = "02101",
                    Country = "USA",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };
            dbContext.Customers.AddRange(customers);
            dbContext.SaveChanges();
            Log.Information("Sample customers seeded");

            // Seed sample jobs
            var jobs = new[]
            {
                new Job
                {
                    AccountId = testAccount.Id,
                    CustomerId = customers[0].Id,
                    Title = "Fix Broken Pipe",
                    Description = "Repair burst water pipe in kitchen",
                    Status = "completed",
                    EstimatedLaborHours = 2,
                    ActualLaborHours = 1.5m,
                    Location = "123 Oak St, New York, NY",
                    ScheduledDate = DateTime.UtcNow.AddDays(-5),
                    CompletedAt = DateTime.UtcNow.AddDays(-4),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Job
                {
                    AccountId = testAccount.Id,
                    CustomerId = customers[1].Id,
                    Title = "Install New Toilet",
                    Description = "Install new toilet in upstairs bathroom",
                    Status = "in_progress",
                    EstimatedLaborHours = 3,
                    Location = "456 Pine Ave, Boston, MA",
                    ScheduledDate = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Job
                {
                    AccountId = testAccount.Id,
                    CustomerId = customers[0].Id,
                    Title = "Drain Cleaning Service",
                    Description = "Clean and unclog main drain line",
                    Status = "lead",
                    EstimatedLaborHours = 1.5m,
                    Location = "123 Oak St, New York, NY",
                    ScheduledDate = DateTime.UtcNow.AddDays(2),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };
            dbContext.Jobs.AddRange(jobs);
            dbContext.SaveChanges();
            Log.Information("Sample jobs seeded");

            // Seed sample invoices
            var invoices = new[]
            {
                new Invoice
                {
                    AccountId = testAccount.Id,
                    JobId = jobs[0].Id,
                    CustomerId = customers[0].Id,
                    InvoiceNumber = $"INV-{DateTime.Now:yyyyMMdd}-0001",
                    InvoiceDate = DateTime.UtcNow.AddDays(-4),
                    DueDate = DateTime.UtcNow.AddDays(26),
                    LaborHours = 1.5m,
                    HourlyRate = 85,
                    LaborAmount = 127.50m,
                    MaterialCost = 45,
                    Subtotal = 172.50m,
                    TaxRate = 0.08m,
                    TaxAmount = 13.80m,
                    TotalAmount = 186.30m,
                    PaidAmount = 186.30m,
                    Status = "paid",
                    CreatedAt = DateTime.UtcNow.AddDays(-4),
                    UpdatedAt = DateTime.UtcNow.AddDays(-4)
                },
                new Invoice
                {
                    AccountId = testAccount.Id,
                    JobId = jobs[1].Id,
                    CustomerId = customers[1].Id,
                    InvoiceNumber = $"INV-{DateTime.Now:yyyyMMdd}-0002",
                    InvoiceDate = DateTime.UtcNow,
                    DueDate = DateTime.UtcNow.AddDays(30),
                    LaborHours = 3,
                    HourlyRate = 85,
                    LaborAmount = 255,
                    MaterialCost = 120,
                    Subtotal = 375,
                    TaxRate = 0.08m,
                    TaxAmount = 30,
                    TotalAmount = 405,
                    PaidAmount = 0,
                    Status = "sent",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };
            dbContext.Invoices.AddRange(invoices);
            dbContext.SaveChanges();
            Log.Information("Sample invoices seeded");
        }
    }
}

app.Run();
