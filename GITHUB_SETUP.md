# GitHub Setup Instructions

## Steps to Push to GitHub

### 1. Create a New Repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `HandimanApp`
3. Description: "A comprehensive field service management platform for trades professionals"
4. Choose visibility: **Public** (for open source) or **Private** (for private development)
5. **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### 2. Link Local Repository to GitHub

After creating the repository on GitHub, you'll see instructions. Run these commands:

```bash
cd c:\Users\marku\HandimanApp

# Add remote origin (replace YOUR_USERNAME and REPO_URL)
git remote add origin https://github.com/YOUR_USERNAME/HandimanApp.git

# Verify remote was added
git remote -v

# Rename branch to main if needed
git branch -M main

# Push to GitHub
git push -u origin main
```

### 3. Alternative: Using SSH (Recommended for future pushes)

If you have SSH key configured:

```bash
git remote set-url origin git@github.com:YOUR_USERNAME/HandimanApp.git
git push -u origin main
```

### 4. Create Additional Branches for Development

```bash
# Create development branch
git checkout -b develop
git push -u origin develop

# Create feature branch
git checkout -b feature/phase-1-mvp
git push -u origin feature/phase-1-mvp
```

### 5. Set Up Branch Protection Rules (Optional)

1. Go to your GitHub repository
2. Settings → Branches
3. Add rule for `main` branch:
   - Require pull request reviews
   - Dismiss stale pull request approvals
   - Require status checks to pass

## Repository Structure on GitHub

```
HandimanApp/
├── README.md                 # Project overview
├── SPECIFICATION.md          # Product specification
├── USER_STORIES.md           # User flows and personas
├── DEVELOPMENT_GUIDE.md      # Technical implementation guide
├── .github/
│   └── workflows/            # CI/CD pipelines (to be added)
├── backend/                  # ASP.NET Core backend
├── frontend/                 # React frontend
├── docker-compose.yml        # Local development setup
└── .gitignore               # Git ignore rules
```

## GitHub Workflows to Add

### 1. Create `.github/workflows/backend-ci.yml`

```yaml
name: Backend CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: handiman_app
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: '8.0.x'
    
    - name: Restore dependencies
      run: dotnet restore backend
    
    - name: Build
      run: dotnet build backend --no-restore
    
    - name: Run tests
      run: dotnet test backend --no-build --verbosity normal
```

### 2. Create `.github/workflows/frontend-ci.yml`

```yaml
name: Frontend CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
    
    - name: Install dependencies
      run: cd frontend && npm ci
    
    - name: Lint
      run: cd frontend && npm run lint
    
    - name: Build
      run: cd frontend && npm run build
    
    - name: Run tests
      run: cd frontend && npm test
```

### 3. Create `.github/workflows/docker-build.yml`

```yaml
name: Docker Build

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Build backend image
      uses: docker/build-push-action@v4
      with:
        context: ./backend
        push: false
        tags: handiman-api:latest
    
    - name: Build frontend image
      uses: docker/build-push-action@v4
      with:
        context: ./frontend
        push: false
        tags: handiman-web:latest
```

## Pushing Updates

### Regular Development Workflow

```bash
# Make changes
# ... edit files ...

# Commit changes
git add .
git commit -m "feat: description of changes"

# Push to GitHub
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# - Go to https://github.com/YOUR_USERNAME/HandimanApp
# - Click "Compare & pull request"
# - Add description
# - Create PR
```

### Merging to Main

```bash
# After PR is approved and tests pass, merge to main
git checkout main
git pull origin main
git merge develop
git push origin main
```

## Issues and Project Management

### Create Issues

1. Go to "Issues" tab on GitHub
2. Click "New issue"
3. Use templates for:
   - Bug reports
   - Feature requests
   - Documentation

### Use Project Board

1. Go to "Projects" tab
2. Create "Phase 1 - MVP" project
3. Add cards for tasks
4. Link to issues

## Collaborating with Others

### Adding Collaborators

1. Settings → Collaborators
2. Add GitHub usernames or email addresses
3. Set permissions (push, maintain, admin)

### Team Guidelines

1. Create feature branches from `develop`
2. Use conventional commit messages:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `style:` - Code style
   - `refactor:` - Code refactoring
   - `test:` - Adding tests

3. All PRs require at least 1 review
4. All tests must pass before merging

## Remote Commands Reference

```bash
# View remote
git remote -v

# Add remote
git remote add origin https://github.com/USERNAME/HandimanApp.git

# Change remote URL
git remote set-url origin https://github.com/USERNAME/HandimanApp.git

# Remove remote
git remote remove origin

# Fetch from remote
git fetch origin

# Pull from remote
git pull origin main

# Push to remote
git push origin main

# Push specific branch
git push origin feature-branch

# Push all branches
git push origin --all

# Push with tags
git push origin main --tags
```

## Troubleshooting

### If you get "permission denied"

1. Check your SSH key setup:
   ```bash
   ssh -T git@github.com
   ```

2. Or use HTTPS with Personal Access Token:
   ```bash
   git remote set-url origin https://TOKEN@github.com/USERNAME/HandimanApp.git
   ```

### If commits don't show up

Make sure your git config matches your GitHub account:
```bash
git config user.email "YOUR_GITHUB_EMAIL"
git config user.name "YOUR_GITHUB_NAME"
```

### If branch is behind main

```bash
git fetch origin
git rebase origin/main
git push origin feature-branch --force-with-lease
```

## Repository Settings

### GitHub Pages (Optional - for documentation)

1. Settings → Pages
2. Source: `main` branch `/docs` folder
3. Choose theme
4. Your docs will be at `https://username.github.io/HandimanApp/`

### Enable Discussions (Optional)

1. Settings → Features
2. Check "Discussions"
3. Great for community questions

## Summary

Your HandimanApp is now ready for GitHub! 

**Repository:** `https://github.com/YOUR_USERNAME/HandimanApp`

Next steps:
1. [ ] Replace `YOUR_USERNAME` with actual GitHub username
2. [ ] Push to GitHub
3. [ ] Add collaborators
4. [ ] Create CI/CD workflows
5. [ ] Set up project board
6. [ ] Start Phase 1 development
