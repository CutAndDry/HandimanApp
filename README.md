# HandimanApp

A comprehensive field service management platform designed for trades professionals (electricians, plumbers, handymen) to manage jobs, invoices, and team operations efficiently.

## Features

- **Job Management**: Create, track, and manage job tickets
- **Invoicing**: Generate professional invoices with labor and material costs
- **Calendar & Scheduling**: Manage jobs with calendar views
- **Team Management**: Manage employees and job assignments (Team plans)
- **Financial Tracking**: Monitor monthly revenue, expenses, and profit
- **Mobile-First**: Fully responsive design optimized for mobile devices
- **Offline Support**: Create jobs and updates even without internet (future)

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

- [x] Project initialization
- [ ] Phase 1 - MVP (Core features)
  - [ ] User authentication
  - [ ] Job management
  - [ ] Invoice generation
  - [ ] Basic dashboard
- [ ] Phase 2 - Team features
  - [ ] Multi-user management
  - [ ] Subscription system
  - [ ] Team dashboard
  - [ ] Job assignment
- [ ] Phase 3 - Advanced features
  - [ ] Integrations (QuickBooks, Stripe)
  - [ ] Advanced analytics
  - [ ] Mobile app
- [ ] Phase 4 - Enterprise
  - [ ] Custom features
  - [ ] API marketplace

## Authors

- **Mark** - Initial project setup and architecture

---

**Last Updated**: January 12, 2026  
**Version**: 0.1.0 (Early Development)  
**Status**: In Development
