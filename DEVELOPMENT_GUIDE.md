# HandimanApp - Comprehensive Development Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Schema & Setup](#database-schema--setup)
5. [Backend API Specification](#backend-api-specification)
6. [Frontend Architecture](#frontend-architecture)
7. [Feature Implementation Checklist](#feature-implementation-checklist)
8. [Setup Instructions](#setup-instructions)
9. [Development Workflow](#development-workflow)
10. [Docker Configuration](#docker-configuration)
11. [API Endpoints Reference](#api-endpoints-reference)
12. [Authentication & Security](#authentication--security)
13. [Testing Strategy](#testing-strategy)
14. [Deployment Guide](#deployment-guide)

---

## Project Overview

**Project Name:** HandimanApp  
**Description:** Mobile-first field service management platform for trades professionals  
**Target Users:** Solo electricians, plumbers, handymen, small-to-large service companies  
**Platform:** Web (mobile-responsive) + Native Mobile (future)  
**Database:** PostgreSQL  
**Backend:** ASP.NET Core 8+  
**Frontend:** React.js with TypeScript  
**Hosting:** Docker containers on cloud (AWS/Azure)  
**Timeline:** 12 months (4 phases)

---

## Technology Stack

### Backend
```
Language: C# (.NET 8)
Framework: ASP.NET Core 8.0
Database: PostgreSQL 15+
ORM: Entity Framework Core 8
API: REST with Swagger/OpenAPI
Authentication: JWT + OAuth2
Cache: Redis
Message Queue: RabbitMQ (Phase 3+)
Logging: Serilog
Testing: xUnit, Moq
```

### Frontend
```
Framework: React 18+
Language: TypeScript 5+
State Management: Redux Toolkit
HTTP Client: Axios
UI Library: Material-UI v5 or Tailwind CSS
Forms: React Hook Form + Zod validation
Mobile: React Native (Phase 4+)
Testing: Jest, React Testing Library
Build: Vite
Package Manager: npm or yarn
```

### DevOps & Infrastructure
```
Containerization: Docker
Orchestration: Docker Compose (dev), Kubernetes (prod)
CI/CD: GitHub Actions
Version Control: Git/GitHub
Cloud: AWS or Azure
Database Backup: Automated daily backups
Monitoring: Application Insights / Datadog
Logging: ELK Stack or CloudWatch
```

---

## Project Structure

```
HandimanApp/
├── backend/
│   ├── src/
│   │   ├── HandimanApp.API/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.cs
│   │   │   │   ├── JobsController.cs
│   │   │   │   ├── InvoicesController.cs
│   │   │   │   ├── CustomersController.cs
│   │   │   │   ├── UsersController.cs
│   │   │   │   ├── AccountsController.cs
│   │   │   │   ├── TeamController.cs
│   │   │   │   └── ReportsController.cs
│   │   │   ├── Middleware/
│   │   │   │   ├── ErrorHandlingMiddleware.cs
│   │   │   │   ├── AuthenticationMiddleware.cs
│   │   │   │   └── RequestLoggingMiddleware.cs
│   │   │   ├── Program.cs
│   │   │   ├── appsettings.json
│   │   │   └── appsettings.Development.json
│   │   ├── HandimanApp.Core/
│   │   │   ├── Entities/
│   │   │   │   ├── User.cs
│   │   │   │   ├── Account.cs
│   │   │   │   ├── Job.cs
│   │   │   │   ├── Invoice.cs
│   │   │   │   ├── Customer.cs
│   │   │   │   ├── Payment.cs
│   │   │   │   ├── TeamMember.cs
│   │   │   │   └── (other entities)
│   │   │   ├── DTOs/
│   │   │   │   ├── JobDTO.cs
│   │   │   │   ├── InvoiceDTO.cs
│   │   │   │   ├── UserDTO.cs
│   │   │   │   └── (other DTOs)
│   │   │   ├── Interfaces/
│   │   │   │   ├── IJobService.cs
│   │   │   │   ├── IInvoiceService.cs
│   │   │   │   ├── IAuthService.cs
│   │   │   │   ├── IEmailService.cs
│   │   │   │   └── (other interfaces)
│   │   │   ├── Constants/
│   │   │   │   └── AppConstants.cs
│   │   │   └── Enums/
│   │   │       ├── JobStatus.cs
│   │   │       ├── UserRole.cs
│   │   │       └── (other enums)
│   │   ├── HandimanApp.Infrastructure/
│   │   │   ├── Data/
│   │   │   │   ├── ApplicationDbContext.cs
│   │   │   │   └── Migrations/
│   │   │   │       └── (numbered migrations)
│   │   │   ├── Services/
│   │   │   │   ├── JobService.cs
│   │   │   │   ├── InvoiceService.cs
│   │   │   │   ├── AuthService.cs
│   │   │   │   ├── EmailService.cs
│   │   │   │   ├── PdfService.cs
│   │   │   │   └── (other services)
│   │   │   ├── Repositories/
│   │   │   │   ├── IRepository.cs
│   │   │   │   ├── JobRepository.cs
│   │   │   │   ├── InvoiceRepository.cs
│   │   │   │   └── (other repositories)
│   │   │   └── Integrations/
│   │   │       ├── StripeService.cs
│   │   │       ├── SmtpEmailService.cs
│   │   │       └── GoogleMapsService.cs
│   │   └── HandimanApp.Tests/
│   │       ├── Unit/
│   │       │   ├── Services/
│   │       │   └── Repositories/
│   │       ├── Integration/
│   │       │   ├── Controllers/
│   │       │   └── Services/
│   │       └── Common/
│   │           └── TestFixtures.cs
│   ├── HandimanApp.sln
│   ├── Dockerfile
│   ├── .dockerignore
│   └── docker-compose.yml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Card.tsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── SignupForm.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── DashboardMetrics.tsx
│   │   │   │   └── RevenueChart.tsx
│   │   │   ├── jobs/
│   │   │   │   ├── JobList.tsx
│   │   │   │   ├── JobDetail.tsx
│   │   │   │   ├── CreateJob.tsx
│   │   │   │   ├── JobForm.tsx
│   │   │   │   └── JobCard.tsx
│   │   │   ├── invoices/
│   │   │   │   ├── InvoiceList.tsx
│   │   │   │   ├── InvoiceDetail.tsx
│   │   │   │   ├── CreateInvoice.tsx
│   │   │   │   └── InvoicePreview.tsx
│   │   │   ├── calendar/
│   │   │   │   ├── Calendar.tsx
│   │   │   │   └── CalendarView.tsx
│   │   │   ├── team/
│   │   │   │   ├── TeamDashboard.tsx
│   │   │   │   ├── TeamMemberList.tsx
│   │   │   │   └── AddTeamMember.tsx
│   │   │   └── settings/
│   │   │       ├── AccountSettings.tsx
│   │   │       ├── BillingSettings.tsx
│   │   │       └── NotificationSettings.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── JobsPage.tsx
│   │   │   ├── CalendarPage.tsx
│   │   │   ├── InvoicesPage.tsx
│   │   │   ├── TeamPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts (Axios instance)
│   │   │   ├── authService.ts
│   │   │   ├── jobService.ts
│   │   │   ├── invoiceService.ts
│   │   │   ├── customerService.ts
│   │   │   └── reportService.ts
│   │   ├── store/
│   │   │   ├── store.ts (Redux store)
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.ts
│   │   │   │   ├── jobSlice.ts
│   │   │   │   ├── invoiceSlice.ts
│   │   │   │   ├── userSlice.ts
│   │   │   │   └── uiSlice.ts
│   │   │   └── hooks.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useFetch.ts
│   │   │   └── useForm.ts
│   │   ├── types/
│   │   │   ├── index.ts (Type definitions)
│   │   │   ├── api.ts
│   │   │   └── models.ts
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   ├── theme.ts
│   │   │   └── variables.css
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   ├── calculations.ts
│   │   │   └── constants.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.tsx
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── jest.config.js
│   └── .env.example
│
├── docker-compose.yml (root)
├── SPECIFICATION.md
├── USER_STORIES.md
├── DEVELOPMENT_GUIDE.md (this file)
├── README.md
└── .gitignore
```

---

## Database Schema & Setup

### PostgreSQL Setup

```sql
-- Create database
CREATE DATABASE handiman_app;

-- Connect to database
\c handiman_app;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable CITEXT extension (case-insensitive text)
CREATE EXTENSION IF NOT EXISTS citext;
```

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email CITEXT UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    profile_photo_url TEXT,
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

#### Accounts Table (Business Accounts)
```sql
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id),
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(50) NOT NULL, -- solo, team
    subscription_tier VARCHAR(50) DEFAULT 'free', -- free, team_basic, team_pro, enterprise
    max_team_members INT DEFAULT 1,
    current_team_members INT DEFAULT 1,
    hourly_rate DECIMAL(10, 2),
    tax_rate DECIMAL(5, 2) DEFAULT 8.00,
    business_address TEXT,
    business_city VARCHAR(100),
    business_state VARCHAR(50),
    business_postal_code VARCHAR(20),
    business_phone VARCHAR(20),
    default_invoice_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subscription_start_date TIMESTAMP,
    subscription_end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_accounts_owner_id ON accounts(owner_id);
CREATE INDEX idx_accounts_subscription_tier ON accounts(subscription_tier);
```

#### TeamMembers Table
```sql
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(50) NOT NULL, -- owner, admin, employee
    hourly_rate DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(account_id, user_id)
);

CREATE INDEX idx_team_members_account_id ON team_members(account_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
```

#### Customers Table
```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email CITEXT,
    phone_number VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'USA',
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_account_id ON customers(account_id);
CREATE INDEX idx_customers_email ON customers(email);
```

#### Jobs Table
```sql
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    customer_id UUID NOT NULL REFERENCES customers(id),
    assigned_to_id UUID REFERENCES team_members(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    job_type VARCHAR(50), -- new_work, repair, maintenance, emergency
    status VARCHAR(50) DEFAULT 'lead', -- lead, quoted, accepted, in_progress, completed, invoiced, paid
    scheduled_date DATE,
    scheduled_time TIME,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    estimated_labor_hours DECIMAL(10, 2),
    actual_labor_hours DECIMAL(10, 2),
    location TEXT,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_jobs_account_id ON jobs(account_id);
CREATE INDEX idx_jobs_customer_id ON jobs(customer_id);
CREATE INDEX idx_jobs_assigned_to_id ON jobs(assigned_to_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_scheduled_date ON jobs(scheduled_date);
```

#### JobMaterials Table
```sql
CREATE TABLE job_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    supplier_name VARCHAR(255),
    description VARCHAR(255) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    material_type VARCHAR(50), -- electrical, plumbing, general
    receipt_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_job_materials_job_id ON job_materials(job_id);
```

#### Invoices Table
```sql
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    job_id UUID NOT NULL REFERENCES jobs(id),
    customer_id UUID NOT NULL REFERENCES customers(id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    labor_hours DECIMAL(10, 2),
    hourly_rate DECIMAL(10, 2),
    labor_amount DECIMAL(10, 2) DEFAULT 0,
    material_cost DECIMAL(10, 2) DEFAULT 0,
    subtotal DECIMAL(10, 2),
    tax_rate DECIMAL(5, 2),
    tax_amount DECIMAL(10, 2),
    total_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft', -- draft, sent, viewed, accepted, paid, overdue
    sent_date TIMESTAMP,
    viewed_date TIMESTAMP,
    payment_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoices_account_id ON invoices(account_id);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_job_id ON invoices(job_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
```

#### Payments Table
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    customer_id UUID NOT NULL REFERENCES customers(id),
    account_id UUID NOT NULL REFERENCES accounts(id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50), -- cash, check, card, ach, other
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reference_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_customer_id ON payments(customer_id);
```

#### ExpenseLogs Table
```sql
CREATE TABLE expense_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    category VARCHAR(50), -- materials, tools, fuel, other
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    expense_date DATE NOT NULL,
    receipt_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expense_logs_account_id ON expense_logs(account_id);
CREATE INDEX idx_expense_logs_expense_date ON expense_logs(expense_date);
```

#### SubscriptionLogs Table
```sql
CREATE TABLE subscription_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    tier VARCHAR(50) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    team_members_count INT,
    monthly_cost DECIMAL(10, 2),
    renewal_date TIMESTAMP,
    status VARCHAR(50), -- active, cancelled, paused
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscription_logs_account_id ON subscription_logs(account_id);
```

### Entity Framework Core Migrations

In `HandimanApp.Infrastructure/Data/ApplicationDbContext.cs`:

```csharp
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Account> Accounts { get; set; }
    public DbSet<TeamMember> TeamMembers { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Job> Jobs { get; set; }
    public DbSet<JobMaterial> JobMaterials { get; set; }
    public DbSet<Invoice> Invoices { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<ExpenseLog> ExpenseLogs { get; set; }
    public DbSet<SubscriptionLog> SubscriptionLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure relationships, indexes, constraints
        // (See detailed DbContext configuration)
    }
}
```

Create migrations:
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## Backend API Specification

### Base URL
```
Development: http://localhost:5000
Production: https://api.handiman.app
```

### API Response Format
```json
{
    "success": true,
    "data": { /* response data */ },
    "error": null,
    "timestamp": "2026-01-12T10:30:00Z"
}
```

### Authentication
- **Type:** JWT Bearer Token
- **Header:** `Authorization: Bearer <token>`
- **Token Expiry:** 24 hours
- **Refresh Token:** 7 days

### Core API Endpoints

#### Authentication Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/me
```

#### User Endpoints

```
GET    /api/users/{id}
PUT    /api/users/{id}
DELETE /api/users/{id}
GET    /api/users/{id}/avatar
POST   /api/users/{id}/avatar
```

#### Account/Business Endpoints

```
GET    /api/accounts/current
PUT    /api/accounts/current
POST   /api/accounts/upgrade
GET    /api/accounts/{id}
POST   /api/accounts/{id}/logo
```

#### Job Endpoints

```
GET    /api/jobs
GET    /api/jobs/{id}
POST   /api/jobs
PUT    /api/jobs/{id}
DELETE /api/jobs/{id}
PATCH  /api/jobs/{id}/status
GET    /api/jobs/{id}/materials
POST   /api/jobs/{id}/materials
PUT    /api/jobs/{id}/materials/{materialId}
DELETE /api/jobs/{id}/materials/{materialId}
POST   /api/jobs/{id}/photos
GET    /api/jobs/{id}/timeline
```

#### Invoice Endpoints

```
GET    /api/invoices
GET    /api/invoices/{id}
POST   /api/invoices
PUT    /api/invoices/{id}
DELETE /api/invoices/{id}
PATCH  /api/invoices/{id}/status
POST   /api/invoices/{id}/send
GET    /api/invoices/{id}/pdf
POST   /api/invoices/{id}/void
```

#### Customer Endpoints

```
GET    /api/customers
GET    /api/customers/{id}
POST   /api/customers
PUT    /api/customers/{id}
DELETE /api/customers/{id}
GET    /api/customers/{id}/jobs
```

#### Team Endpoints

```
GET    /api/teams/members
GET    /api/teams/members/{id}
POST   /api/teams/members
PUT    /api/teams/members/{id}
DELETE /api/teams/members/{id}
GET    /api/teams/dashboard
POST   /api/teams/members/invite
```

#### Report/Analytics Endpoints

```
GET    /api/reports/dashboard
GET    /api/reports/monthly-summary
GET    /api/reports/revenue
GET    /api/reports/expenses
GET    /api/reports/team-performance
GET    /api/reports/customer-analysis
POST   /api/reports/export
```

---

## Frontend Architecture

### Key React Components Structure

#### Authentication Flow
```typescript
// App.tsx root level
<BrowserRouter>
  <ProtectedRoute>
    <Layout>
      <Routes>
        {/* Protected routes */}
      </Routes>
    </Layout>
  </ProtectedRoute>
</BrowserRouter>
```

#### State Management (Redux)
```typescript
// store/slices
- authSlice (user, token, isAuthenticated)
- jobSlice (jobs, selectedJob, filter)
- invoiceSlice (invoices, selectedInvoice)
- userSlice (currentUser, preferences)
- uiSlice (sidebarOpen, notifications, loading)
```

#### Component Organization
```
Pages (route-level)
  ↓
Containers (feature-level with Redux)
  ↓
Components (reusable UI)
  ↓
Sub-components (atomic components)
```

### Key Pages to Implement

**Phase 1 (MVP)**
- [ ] LoginPage
- [ ] SignupPage
- [ ] DashboardPage (solo)
- [ ] JobsPage
- [ ] JobDetailPage
- [ ] CreateJobPage
- [ ] InvoicesPage
- [ ] InvoiceDetailPage
- [ ] CalendarPage
- [ ] SettingsPage

**Phase 2 (Team)**
- [ ] TeamDashboardPage
- [ ] TeamMembersPage
- [ ] AddTeamMemberPage
- [ ] TeamAnalyticsPage

**Phase 3 (Advanced)**
- [ ] ReportsPage
- [ ] CustomerProfilePage
- [ ] PerformanceMetricsPage

---

## Feature Implementation Checklist

### Phase 1: MVP (Months 1-3)

#### Core Features
- [ ] User authentication (signup, login, logout)
- [ ] User profile management
- [ ] Solo account setup
- [ ] Create job ticket
- [ ] View job list
- [ ] Job detail page
- [ ] Update job status
- [ ] Add materials to job
- [ ] Log labor hours (manual & timer)
- [ ] Customer management (CRUD)
- [ ] Generate invoice from job
- [ ] Invoice list and detail
- [ ] Invoice PDF generation
- [ ] Invoice send via email (basic)
- [ ] Calendar view of jobs
- [ ] Dashboard with key metrics
- [ ] Monthly revenue/expense summary
- [ ] Basic reporting

#### Infrastructure
- [ ] PostgreSQL database schema
- [ ] ASP.NET Core API structure
- [ ] React frontend scaffold
- [ ] Authentication system
- [ ] API documentation (Swagger)
- [ ] Docker setup (dev)
- [ ] CI/CD basic pipeline
- [ ] Error handling & logging

### Phase 2: Team Features (Months 4-6)

#### Team Management
- [ ] Subscription upgrade flow
- [ ] Stripe integration for billing
- [ ] Add team members
- [ ] Role-based access control (RBAC)
- [ ] Job assignment to employees
- [ ] Employee job list
- [ ] Manager dashboard
- [ ] Team performance metrics
- [ ] Real-time job status updates

#### Enhanced Features
- [ ] Push notifications
- [ ] In-app messaging
- [ ] Advanced filtering
- [ ] Bulk operations
- [ ] Export to CSV/Excel
- [ ] Time tracking improvements

### Phase 3: Advanced Features (Months 7-9)

#### Integrations & Advanced
- [ ] QuickBooks integration
- [ ] Payment processor integration (Stripe)
- [ ] SMS notifications
- [ ] GPS job tracking (opt-in)
- [ ] Photo management
- [ ] Custom invoice templates
- [ ] Expense tracking
- [ ] Advanced analytics

#### Infrastructure
- [ ] Redis caching
- [ ] Message queue (RabbitMQ)
- [ ] Async job processing
- [ ] Performance optimization

### Phase 4: Scale & Mobile (Months 10-12)

- [ ] React Native mobile app
- [ ] Offline-first sync
- [ ] Advanced team features
- [ ] Enterprise features
- [ ] API marketplace
- [ ] Custom integrations

---

## Setup Instructions

### Prerequisites
```bash
# Install required software
- Git
- Docker & Docker Compose
- .NET 8 SDK
- Node.js 18+
- PostgreSQL 15+ (or use Docker)
```

### Clone & Initial Setup

```bash
# Clone repository
git clone https://github.com/yourusername/HandimanApp.git
cd HandimanApp

# Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Backend Setup

```bash
cd backend

# Restore NuGet packages
dotnet restore

# Create appsettings.Development.json
cat > src/HandimanApp.API/appsettings.Development.json << 'EOF'
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=handiman_app;Username=postgres;Password=postgres"
  },
  "Jwt": {
    "SecretKey": "your-secret-key-here-min-32-chars",
    "Issuer": "handiman-app",
    "Audience": "handiman-app-users",
    "ExpirationMinutes": 1440
  },
  "Logging": {
    "LogLevel": {
      "Default": "Debug"
    }
  }
}
EOF

# Create database and run migrations
dotnet ef database update -p src/HandimanApp.Infrastructure -s src/HandimanApp.API

# Run backend
dotnet run --project src/HandimanApp.API
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_ENV=development
EOF

# Run frontend
npm run dev
```

### Docker Compose Setup

```bash
# From root directory
docker-compose up -d

# Check services
docker-compose ps

# View logs
docker-compose logs -f
```

---

## Development Workflow

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/job-creation

# Make changes
git add .
git commit -m "feat: add job creation endpoint"

# Push to remote
git push origin feature/job-creation

# Create pull request on GitHub
```

### Backend Development

```bash
# Create new API endpoint
1. Create DTO in Core/DTOs/
2. Create Service method in Infrastructure/Services/
3. Create Repository method in Infrastructure/Repositories/
4. Create Controller action in API/Controllers/
5. Add route mapping
6. Create unit tests
7. Test with Postman/Swagger

# Create migration after model change
dotnet ef migrations add DescriptiveNameHere -p src/HandimanApp.Infrastructure -s src/HandimanApp.API
dotnet ef database update
```

### Frontend Development

```bash
# Create new feature
1. Create page component in src/pages/
2. Create container component in src/components/
3. Create Redux slice if needed (store/slices/)
4. Create service methods (src/services/)
5. Add types (src/types/)
6. Add routes (App.tsx)
7. Create component tests
8. Test in browser

# Test with mock API
npm run dev:mock  # Runs with mock API service
```

### Testing

```bash
# Backend tests
cd backend
dotnet test

# Frontend tests
cd frontend
npm test

# E2E tests (Cypress)
npm run test:e2e
```

---

## Docker Configuration

### Dockerfile (Backend)

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY ["src/HandimanApp.API/HandimanApp.API.csproj", "src/HandimanApp.API/"]
COPY ["src/HandimanApp.Core/HandimanApp.Core.csproj", "src/HandimanApp.Core/"]
COPY ["src/HandimanApp.Infrastructure/HandimanApp.Infrastructure.csproj", "src/HandimanApp.Infrastructure/"]

RUN dotnet restore "src/HandimanApp.API/HandimanApp.API.csproj"

COPY . .
RUN dotnet build "src/HandimanApp.API/HandimanApp.API.csproj" -c Release -o /app/build
RUN dotnet publish "src/HandimanApp.API/HandimanApp.API.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
EXPOSE 5000

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "HandimanApp.API.dll"]
```

### Dockerfile (Frontend)

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: handiman_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: handiman_app
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: handiman_cache
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: handiman_api
    environment:
      ConnectionStrings__DefaultConnection: "Host=postgres;Database=handiman_app;Username=postgres;Password=postgres"
      Jwt__SecretKey: "your-secret-key-change-in-production"
      Redis__ConnectionString: "redis:6379"
    ports:
      - "5000:5000"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./backend:/app

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: handiman_web
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_BASE_URL: "http://localhost:5000"
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
```

---

## API Endpoints Reference

### Complete Endpoint List

#### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
GET    /api/auth/me
```

#### Jobs
```
GET    /api/jobs?skip=0&take=10&status=lead&sort=date
GET    /api/jobs/{jobId}
POST   /api/jobs
PUT    /api/jobs/{jobId}
PATCH  /api/jobs/{jobId}/status (payload: {status: "in_progress"})
DELETE /api/jobs/{jobId}
```

#### Invoices
```
GET    /api/invoices?month=1&year=2026
GET    /api/invoices/{invoiceId}
POST   /api/invoices (payload: {jobId, customerDetails})
PUT    /api/invoices/{invoiceId}
PATCH  /api/invoices/{invoiceId}/status
POST   /api/invoices/{invoiceId}/send
GET    /api/invoices/{invoiceId}/pdf
```

#### Customers
```
GET    /api/customers
GET    /api/customers/{customerId}
POST   /api/customers
PUT    /api/customers/{customerId}
DELETE /api/customers/{customerId}
```

#### Team
```
GET    /api/team/members
POST   /api/team/members (payload: {email, name, role, hourlyRate})
PUT    /api/team/members/{memberId}
DELETE /api/team/members/{memberId}
```

#### Reports
```
GET    /api/reports/dashboard?month=1&year=2026
GET    /api/reports/monthly-summary?month=1&year=2026
GET    /api/reports/revenue?startDate=2026-01-01&endDate=2026-01-31
GET    /api/reports/expenses?startDate=2026-01-01&endDate=2026-01-31
```

---

## Authentication & Security

### JWT Implementation

```csharp
// TokenService.cs
public class TokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateAccessToken(User user)
    {
        var secretKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
        var signingCredentials = new SigningCredentials(
            secretKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("AccountId", user.AccountId?.ToString() ?? "")
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                int.Parse(_configuration["Jwt:ExpirationMinutes"])),
            signingCredentials: signingCredentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

### Password Security

```csharp
// Use BCrypt for password hashing
using BCrypt.Net;

public class PasswordService
{
    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyPassword(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}
```

### HTTPS & CORS

```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://handiman.app")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
```

---

## Testing Strategy

### Backend Testing

```csharp
// Tests/Unit/Services/JobServiceTests.cs
public class JobServiceTests
{
    private readonly Mock<IJobRepository> _jobRepositoryMock;
    private readonly JobService _jobService;

    public JobServiceTests()
    {
        _jobRepositoryMock = new Mock<IJobRepository>();
        _jobService = new JobService(_jobRepositoryMock.Object);
    }

    [Fact]
    public async Task CreateJob_WithValidData_ReturnsJobDTO()
    {
        // Arrange
        var createJobDTO = new CreateJobDTO { /* ... */ };
        var job = new Job { /* ... */ };

        _jobRepositoryMock.Setup(r => r.AddAsync(It.IsAny<Job>()))
            .ReturnsAsync(job);

        // Act
        var result = await _jobService.CreateJobAsync(createJobDTO);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(job.Id, result.Id);
        _jobRepositoryMock.Verify(r => r.AddAsync(It.IsAny<Job>()), Times.Once);
    }
}
```

### Frontend Testing

```typescript
// __tests__/JobForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { JobForm } from '../components/jobs/JobForm';

describe('JobForm Component', () => {
    it('should render job form with all fields', () => {
        render(<JobForm onSubmit={jest.fn()} />);

        expect(screen.getByLabelText(/Customer/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Job Type/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Estimated Hours/i)).toBeInTheDocument();
    });

    it('should submit form with valid data', () => {
        const handleSubmit = jest.fn();
        render(<JobForm onSubmit={handleSubmit} />);

        fireEvent.change(screen.getByLabelText(/Customer/i), {
            target: { value: 'John Doe' }
        });

        fireEvent.click(screen.getByRole('button', { name: /Create/i }));

        expect(handleSubmit).toHaveBeenCalled();
    });
});
```

### Integration Testing

```csharp
// Tests/Integration/Controllers/JobsControllerTests.cs
public class JobsControllerIntegrationTests : IAsyncLifetime
{
    private readonly WebApplicationFactory<Program> _factory;
    private HttpClient _client;

    public async Task InitializeAsync()
    {
        _factory = new WebApplicationFactory<Program>();
        _client = _factory.CreateClient();

        // Seed database with test data
        await SeedTestDataAsync();
    }

    [Fact]
    public async Task CreateJob_ReturnsCreatedAtActionResult()
    {
        // Arrange
        var createJobDTO = new CreateJobDTO { /* ... */ };
        var token = await GetAuthTokenAsync();
        _client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.PostAsJsonAsync("/api/jobs", createJobDTO);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    public async Task DisposeAsync()
    {
        _client?.Dispose();
        _factory?.Dispose();
    }
}
```

---

## Deployment Guide

### Production Deployment Checklist

```
[ ] Environment variables configured
    - JWT secret key
    - Database connection string
    - Stripe API keys
    - Email service credentials
    - OAuth credentials

[ ] Database
    - Backups configured
    - Connection pooling optimized
    - Indexes created
    - Query performance tested

[ ] Security
    - SSL/TLS certificates
    - CORS properly configured
    - Rate limiting enabled
    - Input validation on all endpoints
    - SQL injection prevention (EF parameterization)

[ ] Performance
    - Redis cache configured
    - CDN for static assets
    - Database query optimization
    - API response time < 200ms

[ ] Monitoring
    - Application logging
    - Error tracking (Sentry)
    - Performance monitoring
    - Uptime monitoring

[ ] CI/CD
    - Automated tests passing
    - Code coverage > 80%
    - Automated deployments
    - Rollback capability
```

### AWS Deployment Steps

```bash
# 1. Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier handiman-app-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --allocated-storage 20

# 2. Create ECR repositories
aws ecr create-repository --repository-name handiman-api
aws ecr create-repository --repository-name handiman-web

# 3. Build and push Docker images
docker build -t handiman-api:latest ./backend
aws ecr get-login-password | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag handiman-api:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/handiman-api:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/handiman-api:latest

# 4. Deploy to ECS/Fargate
aws ecs create-service \
  --cluster handiman-cluster \
  --service-name handiman-api \
  --task-definition handiman-api:1 \
  --desired-count 2

# 5. Configure Route 53 for DNS
# 6. Set up CloudFront CDN
# 7. Enable CloudWatch monitoring
```

### Health Check Endpoints

```csharp
// HealthController.cs
[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly IHealthCheckService _healthCheck;

    [HttpGet("liveness")]
    public IActionResult Liveness()
    {
        return Ok(new { status = "healthy" });
    }

    [HttpGet("readiness")]
    public async Task<IActionResult> Readiness()
    {
        var dbHealth = await _healthCheck.CheckDatabaseAsync();
        var redisHealth = await _healthCheck.CheckRedisAsync();

        if (dbHealth && redisHealth)
            return Ok(new { status = "ready" });

        return StatusCode(StatusCodes.Status503ServiceUnavailable);
    }
}
```

---

## Development Commands Reference

```bash
# Backend
cd backend
dotnet build
dotnet run
dotnet test
dotnet ef migrations add MigrationName
dotnet ef database update

# Frontend
cd frontend
npm install
npm run dev
npm test
npm run build
npm run preview

# Docker
docker-compose up -d
docker-compose down
docker-compose logs -f service-name
docker-compose exec backend dotnet ef database update

# Git
git clone <repo>
git checkout -b feature/name
git commit -m "message"
git push origin feature/name
```

---

## Monitoring & Logging

### Logging (Serilog)

```csharp
// Configure in Program.cs
builder.Host.UseSerilog((context, config) =>
{
    config
        .MinimumLevel.Debug()
        .WriteTo.Console()
        .WriteTo.File(
            "logs/log-.txt",
            rollingInterval: RollingInterval.Day,
            outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz}] [{Level:u3}] {Message:lj}{NewLine}{Exception}");
});
```

### Application Insights (Azure)

```csharp
builder.Services.AddApplicationInsightsTelemetry();
builder.Services.AddApplicationInsightsKubernetesEnricher();
```

### Performance Monitoring

```typescript
// Frontend - Google Analytics
import { useEffect } from 'react';
import { pageview } from './analytics';

export function usePageView() {
    useEffect(() => {
        pageview(window.location.pathname);
    }, []);
}
```

---

## Conclusion

This development guide provides a complete blueprint for building HandimanApp from scratch. The architecture is:

✅ **Scalable** - From solo user to enterprise  
✅ **Secure** - JWT auth, password hashing, CORS protection  
✅ **Modern** - .NET 8, React 18, PostgreSQL 15  
✅ **Testable** - Unit, integration, E2E test frameworks  
✅ **Deployable** - Docker-ready, cloud-agnostic  
✅ **Maintainable** - Clear structure, comprehensive documentation  

### Next Steps

1. **Set up development environment** (follow Setup Instructions)
2. **Create database schema** (PostgreSQL migrations)
3. **Implement Phase 1 features** (MVP)
4. **Build REST API** (ASP.NET Core controllers)
5. **Develop UI** (React components)
6. **Test thoroughly** (unit, integration, E2E)
7. **Deploy to Docker** (docker-compose)
8. **Monitor in production** (logging, alerts)
9. **Iterate based on feedback** (user testing)
10. **Scale to Phase 2+** (team features, integrations)

For detailed user requirements, refer to [USER_STORIES.md](USER_STORIES.md)  
For business requirements, refer to [SPECIFICATION.md](SPECIFICATION.md)

---

**Last Updated:** January 12, 2026  
**Version:** 1.0  
**Status:** Ready for Development
