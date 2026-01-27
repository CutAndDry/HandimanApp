# HandimanApp

A comprehensive field service management platform designed for trades professionals (electricians, plumbers, handymen) to manage jobs, invoices, and team operations efficiently.

## Features

- **Job Management**: Create, track, and manage job tickets with status updates
- **Invoicing**: Generate professional invoices with labor and material costs, PDF download, and email delivery
- **Calendar & Scheduling**: Manage jobs with calendar views and filtering
- **Team Management**: Manage employees and job assignments
- **Financial Tracking**: Real-time dashboard with revenue, expenses, and profit monitoring
- **Customer Management**: Full CRUD operations for customer contact details
- **Labor Tracking**: Built-in timer for tracking labor hours per job
- **Data Export**: Export jobs and invoices to CSV format
- **Mobile-First**: Fully responsive design optimized for mobile devices
- **PDF & Email**: Invoice PDF generation and email delivery integration


<img width="600" height="848" alt="Screenshot 2026-01-27 111311" src="https://github.com/user-attachments/assets/83e1a616-1d36-4376-b0b0-3e3d042174f2" />
<img width="1868" height="860" alt="image" src="https://github.com/user-attachments/assets/b9c26ea8-da29-4ae4-a01b-24b0c98b5a00" />
<img width="1910" height="781" alt="Screenshot 2026-01-27 111503" src="https://github.com/user-attachments/assets/b3e684b6-04aa-41e7-bbdc-73ede9d616e6" />
<img width="544" height="846" alt="Screenshot 2026-01-27 111531" src="https://github.com/user-attachments/assets/e7862422-3998-4bff-a22f-57e408ca896a" />
<img width="532" height="821" alt="Screenshot 2026-01-27 111545" src="https://github.com/user-attachments/assets/f1a57bed-9be5-4d40-98b3-5ead2311078f" />
<img width="511" height="822" alt="Screenshot 2026-01-27 111606" src="https://github.com/user-attachments/assets/eb81c501-23bf-4e01-8dbe-4819ea7d4285" />



## Tech Stack

### Backend
- **Framework**: ASP.NET Core 8.0
- **Database**: PostgreSQL 15+
- **ORM**: Entity Framework Core
- **Language**: C#
- **Authentication**: JWT

### Frontend
- **Framework**: React 18+
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS / Material-UI
- **Build Tool**: Vite

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Version Control**: Git
- **CI/CD**: GitHub Actions (configured)

## Quick Start

### Prerequisites
- .NET 8 SDK
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose
- Git

### Using Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/yourusername/HandimanApp.git
cd HandimanApp

# Start services
docker-compose up -d

# Services will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000
# - API Docs: http://localhost:5000/swagger
# - Database: localhost:5432
```

### Manual Setup

#### Backend Setup

```bash
cd backend

# Create environment file
cp .env.example .env

# Restore packages
dotnet restore

# Create and update database
dotnet ef database update -p src/HandimanApp.Infrastructure -s src/HandimanApp.API

# Run the API
dotnet run --project src/HandimanApp.API
```

Backend will be available at `http://localhost:5000`

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173` or `http://localhost:3000`

## Project Structure

```
HandimanApp/
├── backend/
│   ├── src/
│   │   ├── HandimanApp.API/          # ASP.NET Core API
│   │   ├── HandimanApp.Core/         # Business logic & entities
│   │   └── HandimanApp.Infrastructure/ # Data access & services
│   ├── tests/                         # Unit & integration tests
│   ├── Dockerfile
│   └── docker-compose.yml
├── frontend/
│   ├── src/
│   │   ├── components/                # React components
│   │   ├── pages/                     # Page components
│   │   ├── services/                  # API services
│   │   ├── store/                     # Redux store
│   │   ├── types/                     # TypeScript types
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
├── SPECIFICATION.md                    # Product specification
├── USER_STORIES.md                     # User flows & personas
├── DEVELOPMENT_GUIDE.md                # Technical guide
└── README.md                           # This file
```

## Documentation

- **[SPECIFICATION.md](SPECIFICATION.md)** - Complete product specification, features, and business model
- **[USER_STORIES.md](USER_STORIES.md)** - User personas, workflows, and application flows
- **[DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)** - Technical implementation guide and architecture

## API Documentation

Once the backend is running, visit `http://localhost:5000/swagger` for interactive API documentation.

## Development

### Running Tests

```bash
# Backend tests
cd backend
dotnet test

# Frontend tests
cd frontend
npm test
```

### Database Migrations

```bash
cd backend

# Create a new migration
dotnet ef migrations add MigrationName -p src/HandimanApp.Infrastructure -s src/HandimanApp.API

# Apply migrations
dotnet ef database update -p src/HandimanApp.Infrastructure -s src/HandimanApp.API
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: description of changes"

# Push to remote
git push origin feature/feature-name

# Create pull request on GitHub
```

## Deployment

### Docker Deployment

```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d

# View logs
docker-compose logs -f
```

### Cloud Deployment (AWS/Azure)

See [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md#deployment-guide) for detailed deployment instructions.

## Environment Variables

### Backend (.env)
```
ASPNETCORE_ENVIRONMENT=Development
ConnectionStrings__DefaultConnection=Host=localhost;Database=handiman_app;Username=postgres;Password=postgres
Jwt__SecretKey=your-secret-key-min-32-characters
Jwt__Issuer=handiman-app
Jwt__Audience=handiman-app-users
Jwt__ExpirationMinutes=1440
```

### Frontend (.env)
```
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_ENV=development
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact support@handiman.app.

## Roadmap

- [x] Project initialization and architecture
- [x] **Phase 1 - MVP (Core features) - COMPLETE**
  - [x] User authentication (JWT)
  - [x] Job management (CRUD, status tracking, filtering)
  - [x] Invoice generation (PDF, email delivery)
  - [x] Customer management
  - [x] Comprehensive dashboard
  - [x] Calendar view
  - [x] Labor hour tracking
  - [x] Data export (CSV)
  - [x] Mobile-responsive UI
  - [x] Responsive design (all screen sizes)
- [ ] Phase 2 - Advanced features
  - [ ] Third-party integrations (QuickBooks, Stripe)
  - [ ] Advanced analytics and reporting
  - [ ] Automated scheduling
  - [ ] Payment processing
- [ ] Phase 3 - Enterprise
  - [ ] Custom branding
  - [ ] Advanced access controls
  - [ ] API marketplace
  - [ ] Mobile native apps

## Authors

- **Mark** - Full-stack development, architecture, and implementation

---

**Last Updated**: January 14, 2026  
**Version**: 1.0.0 (MVP Complete - Production Ready)  
**Status**: ✅ Fully Implemented and Tested
