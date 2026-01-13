# HandimanApp - Developer Reference

## Architecture

### N-Tier Architecture

```
┌─────────────────────────────────────┐
│     React Frontend (localhost:3000) │
├─────────────────────────────────────┤
│      TypeScript / Tailwind CSS      │
│  ├─ Pages (7 components)            │
│  ├─ Services (6 API layers)         │
│  ├─ Redux Store (state mgmt)        │
│  └─ Components (reusable UI)        │
├─────────────────────────────────────┤
│   REST API (ASP.NET, localhost:5000) │
├─────────────────────────────────────┤
│  ├─ Controllers (6 API endpoints)    │
│  ├─ Services (Auth, Email, PDF)     │
│  ├─ EF Core DbContext               │
│  └─ Business Logic                  │
├─────────────────────────────────────┤
│   PostgreSQL Database               │
├─────────────────────────────────────┤
│  ├─ Users Table                     │
│  ├─ Accounts, Customers, Jobs       │
│  ├─ Invoices, Payments              │
│  └─ TeamMembers, JobMaterials       │
└─────────────────────────────────────┘
```

---

## Backend Structure

### Project Layout
```
backend/
├── src/
│   ├── HandimanApp.API/
│   │   ├── Controllers/
│   │   │   ├── AuthController.cs
│   │   │   ├── JobsController.cs
│   │   │   ├── InvoicesController.cs
│   │   │   ├── CustomersController.cs
│   │   │   ├── AccountsController.cs
│   │   │   ├── TeamController.cs
│   │   │   └── DashboardController.cs
│   │   ├── Program.cs (configuration)
│   │   ├── appsettings.json
│   │   └── appsettings.Development.json
│   │
│   ├── HandimanApp.Core/
│   │   ├── Entities/
│   │   │   ├── User.cs
│   │   │   ├── Account.cs
│   │   │   ├── Customer.cs
│   │   │   ├── Job.cs
│   │   │   ├── Invoice.cs
│   │   │   └── ... (other entities)
│   │   └── Interfaces/
│   │       ├── IAuthService.cs
│   │       ├── IEmailService.cs
│   │       └── IPdfService.cs
│   │
│   └── HandimanApp.Infrastructure/
│       ├── Services/
│       │   ├── AuthService.cs
│       │   ├── EmailService.cs
│       │   └── PdfService.cs
│       └── Data/
│           ├── ApplicationDbContext.cs
│           └── Migrations/
│
└── HandimanApp.sln
```

### Key Dependencies
- **Microsoft.EntityFrameworkCore** - ORM
- **Microsoft.AspNetCore.Authentication.JwtBearer** - JWT auth
- **Npgsql.EntityFrameworkCore.PostgreSQL** - PostgreSQL provider
- **Serilog** - Logging
- **Microsoft.OpenApi** - Swagger

---

## Frontend Structure

### Project Layout
```
frontend/
├── src/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── JobsPage.tsx
│   │   ├── JobDetailPage.tsx (NEW)
│   │   ├── CalendarPage.tsx (NEW)
│   │   ├── InvoicesPage.tsx
│   │   ├── CustomerPage.tsx (NEW)
│   │   ├── SettingsPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── SignupPage.tsx
│   │
│   ├── services/
│   │   ├── api.ts (Axios config)
│   │   ├── authService.ts
│   │   ├── jobService.ts
│   │   ├── customerService.ts
│   │   ├── invoiceService.ts
│   │   ├── accountService.ts
│   │   ├── teamService.ts
│   │   └── dashboardService.ts
│   │
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── auth/
│   │   │   └── ProtectedRoute.tsx
│   │   └── ... (other components)
│   │
│   ├── store/
│   │   ├── store.ts
│   │   ├── authSlice.ts
│   │   └── ... (other slices)
│   │
│   ├── types/
│   │   ├── index.ts
│   │   └── api.ts
│   │
│   ├── App.tsx
│   ├── index.tsx
│   └── ... (other files)
│
├── vite.config.ts
├── tsconfig.json
├── package.json
└── tailwind.config.js
```

### Key Dependencies
- **React** - UI framework
- **React Router** - Routing
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling

---

## API Design

### Request/Response Format

#### Successful Response (200-201)
```json
{
  "id": "guid",
  "title": "string",
  "status": "string",
  "createdAt": "datetime",
  ...
}
```

#### Error Response (4xx-5xx)
```json
{
  "message": "Error description",
  "error": "Detailed error info (dev only)"
}
```

### Authentication

**JWT Token Structure:**
```
Header: Authorization: Bearer <token>
Token Expiration: 24 hours
Secret Key: Configured in appsettings.json
```

**Getting a Token:**
```bash
POST /api/auth/login
{
  "email": "test@handiman.app",
  "password": "Test123!"
}

Response:
{
  "token": "eyJhbGc...",
  "expiresIn": 86400
}
```

### Pagination (if needed)

**Query Parameters:**
```
?skip=0&take=10
?sort=createdAt&order=desc
?filter=active
```

---

## Database Schema

### Key Relationships

```
User (1) ──────→ (1) Account
                    ├─ (Many) Customer
                    ├─ (Many) Job
                    │           ├─ (Many) Invoice
                    │           └─ (Many) JobMaterial
                    └─ (Many) TeamMember

Customer (1) ────→ (Many) Job
                    └─ (Many) Invoice

Job (1) ──────────→ (Many) Invoice
            └─ (Many) JobMaterial

Invoice (1) ───────→ (Many) Payment
```

### Important Fields

**User**
- Id (PK)
- Email (unique)
- PasswordHash
- FirstName, LastName
- CreatedAt, UpdatedAt

**Invoice**
- Id (PK)
- InvoiceNumber (unique per account)
- Status (draft, sent, viewed, paid)
- TotalAmount, PaidAmount
- DueDate, PaymentDate

**Job**
- Id (PK)
- Status (lead, pending, in_progress, completed)
- ScheduledDate
- LaborHours
- Location

---

## Service Layer Pattern

### AuthService
```csharp
public interface IAuthService
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string hash);
    string GenerateToken(User user);
}
```

### EmailService
```csharp
public interface IEmailService
{
    Task SendInvoiceAsync(string email, string name, 
                         string invoiceNumber, decimal amount);
    Task SendAsync(string to, string subject, string body);
}
```

### PdfService
```csharp
public interface IPdfService
{
    byte[] GenerateInvoicePdf(Invoice invoice);
}
```

---

## Configuration

### appsettings.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=handiman_app;..."
  },
  "Jwt": {
    "SecretKey": "your-secret-key-here",
    "Issuer": "handiman-app",
    "Audience": "handiman-app-users",
    "ExpirationMinutes": 1440
  },
  "Email": {
    "SmtpHost": "localhost",
    "SmtpPort": "587",
    "SmtpUsername": "",
    "SmtpPassword": "",
    "FromAddress": "noreply@handimanapp.com",
    "FromName": "HandimanApp"
  }
}
```

### Environment Variables
```bash
# Backend
ASPNETCORE_ENVIRONMENT=Development
DATABASE_URL=postgresql://localhost/handiman_app

# Frontend
VITE_API_BASE_URL=http://localhost:5000
```

---

## Development Workflow

### Adding a New Feature

1. **Backend**
   ```csharp
   // 1. Create Entity (Core/Entities)
   public class MyEntity { }
   
   // 2. Add DbSet (Infrastructure/Data)
   public DbSet<MyEntity> MyEntities { get; set; }
   
   // 3. Create Migration
   dotnet ef migrations add AddMyEntity
   
   // 4. Create Controller (API/Controllers)
   [ApiController]
   [Route("api/[controller]")]
   public class MyController : ControllerBase { }
   
   // 5. Register Services (Program.cs)
   builder.Services.AddScoped<IMyService, MyService>();
   ```

2. **Frontend**
   ```typescript
   // 1. Create Service (services)
   export const myService = { }
   
   // 2. Create Page (pages)
   export const MyPage: React.FC = () => { }
   
   // 3. Add Route (App.tsx)
   <Route path="/my" element={<MyPage />} />
   
   // 4. Add Navigation (Layout.tsx)
   <Link to="/my">My Feature</Link>
   ```

### Code Style

**C# Conventions**
- PascalCase for classes, methods, properties
- camelCase for private fields
- _fieldName for private fields with underscore
- Use async/await for I/O operations

**TypeScript Conventions**
- PascalCase for components
- camelCase for variables, functions
- Use interfaces for data types
- Use const for imports and exports
- Arrow functions for callbacks

---

## Testing

### Manual Testing Checklist
- [ ] Can create entities (jobs, invoices, etc.)
- [ ] Can read and update entities
- [ ] Can delete entities
- [ ] Pagination works
- [ ] Filtering works
- [ ] Auth token is required
- [ ] Validation works
- [ ] Error messages display

### API Testing
```bash
# Using curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@handiman.app","password":"Test123!"}'

# Using Swagger UI
Open http://localhost:5000/swagger
```

---

## Performance Tips

1. **Database Queries**
   - Use `.Include()` for related data (prevents N+1)
   - Use `.AsNoTracking()` for read-only queries
   - Create proper indexes on frequently filtered columns

2. **Frontend**
   - Use React.memo for components that don't change often
   - Lazy load pages with React.lazy()
   - Optimize images
   - Debounce search inputs

3. **API**
   - Implement caching (Redis)
   - Use pagination for large datasets
   - Compress responses with gzip
   - Use HTTP/2

---

## Security Checklist

- [ ] Validate all inputs (frontend & backend)
- [ ] Hash passwords with BCrypt
- [ ] Use HTTPS in production
- [ ] Implement CORS properly
- [ ] Use prepared statements (EF Core handles this)
- [ ] Limit request size
- [ ] Implement rate limiting
- [ ] Log security events
- [ ] Use environment variables for secrets
- [ ] Regular security updates

---

## Debugging

### Backend
```bash
# Enable debug logging
ASPNETCORE_ENVIRONMENT=Development

# View logs
tail -f logs/log-*.txt

# Use Visual Studio debugger
```

### Frontend
```javascript
// Browser DevTools
F12 → Console
F12 → Network (for API calls)
F12 → Application → LocalStorage (for tokens)

// Redux DevTools
Install browser extension
Check Redux store state
```

---

## Useful Commands

### Backend
```bash
# Build
dotnet build

# Run
dotnet run

# Tests
dotnet test

# Migrations
dotnet ef migrations add Migration Name
dotnet ef database update
dotnet ef database drop

# Watch mode
dotnet watch
```

### Frontend
```bash
# Install deps
npm install

# Dev server
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Type check
tsc --noEmit

# Lint
npm run lint
```

---

## Resources

- **ASP.NET Core Docs**: https://docs.microsoft.com/dotnet/core/
- **EF Core Docs**: https://docs.microsoft.com/ef/core/
- **React Docs**: https://react.dev/
- **TypeScript Docs**: https://www.typescriptlang.org/docs/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

## Troubleshooting

### Common Issues

**Migration Errors**
```bash
# Reset database
dotnet ef database drop -f
dotnet ef migrations add InitialCreate
dotnet ef database update
```

**CORS Issues**
- Check appsettings.json CORS policy
- Add origin to AllowedOrigins list
- Preflight requests should return 204

**JWT Token Expired**
- Check token expiration in appsettings.json
- Refresh token by logging in again
- LocalStorage contains token, clear if needed

**Database Connection**
- Ensure PostgreSQL is running
- Check connection string in appsettings.json
- Verify database exists

---

**Happy coding! 🚀**

