# HandimanApp - Specification Document

## 1. Executive Summary

**Product Name:** HandimanApp  
**Target Users:** Individual trades professionals (electricians, plumbers, handymen) and small-to-large service companies  
**Platform:** Mobile-first web application with desktop web access  
**Primary Database:** PostgreSQL  
**Technology Stack:** C# (.NET/ASP.NET Core)  
**Business Model:** Freemium (Free for single users, paid per-seat for team management)

HandimanApp is a comprehensive field service management platform designed to help trades professionals manage their work efficiently, from job creation and quote management to invoicing and financial reporting. The platform scales from independent contractors to companies managing multiple employees.

---

## 2. Problem Statement & Market Context

### Current Market Landscape
The field service management (FSM) space is dominated by established players including:
- **Housecall Pro** - Comprehensive FSM with 200K+ users
- **Jobber** - 300K+ home service pros, strong mobile experience
- **ServiceTitan** - Enterprise-focused with 70+ integrations
- **Tradify** - Smaller provider with project-centric approach

### Key Gaps HandimanApp Addresses
1. **Affordability** - Free tier for solo operators, eliminating cost barriers
2. **Simplicity** - Streamlined UX vs. bloated competitors
3. **Trade-Specific** - Optimized for multiple trades (electrical, plumbing, HVAC, handyman, etc.)
4. **Flexible Scaling** - Seamless transition from solo to multi-employee teams
5. **Quick Invoice Generation** - Fast quoting and invoicing workflow

---

## 3. Core Feature Set

### 3.1 Mobile-First Application (Primary Interface)

#### Job Management
- **Create Job Tickets**
  - Quick job creation with customer details
  - Job status tracking: Lead → In Progress → Complete → Paid
  - Job type categorization (new work, repair, maintenance, emergency)
  - Job location and scheduling
  - Notes and photo attachments
  
- **Material Cost Management**
  - Add line items from supplier quotes
  - Import costs from electrical/plumbing supply shop receipts (manual entry + QR/camera integration potential)
  - Track supplier information per item
  - Update material costs in real-time
  - Categorize materials by type (electrical, plumbing, general)

- **Hourly Rate & Labor Tracking**
  - Set hourly rates per job or globally
  - Track time spent on jobs (manual entry or stopwatch timer)
  - Overtime calculations
  - Multiple rate types (standard, premium, flat-rate override)

#### Invoice Generation
- **One-Click Invoice Creation**
  - Combine labor hours × hourly rate + material costs
  - Automatic tax calculations
  - Multiple invoice templates
  - Email/SMS direct to customer
  - Digital signature capability for acceptance
  - Payment terms and due date options

#### Calendar & Scheduling
- **Calendar View**
  - Month/week/day view
  - Drag-and-drop job scheduling
  - Color-coded by job status
  - Show/hide completed jobs
  - Quick job filtering by type, customer, status

#### Dashboard & Analytics
- **Personal Dashboard (Solo Users)**
  - Current month income vs. target
  - Total material costs this month
  - Profit margin calculation
  - Jobs completed (count & revenue)
  - Pending invoices and overdue payments
  - Top customers and repeat job frequency
  - Quick access to active jobs

- **Monthly Financial Report**
  - Income by source (hourly labor, materials, flat-rate)
  - Expense breakdown
  - Profit/loss summary
  - Monthly comparison (trend analysis)
  - Tax-ready report generation

#### Job Status Tracking
- **Kanban Board / Status Pipeline**
  - Leads / Quotes Sent
  - Accepted / In Progress
  - Completed / Awaiting Payment
  - Paid / Closed
  - Customizable status workflow per account

---

### 3.2 Desktop/Web Application

Same features as mobile app with enhanced views:
- Larger screens for better data visibility
- Bulk operations on jobs
- Advanced reporting and analytics
- Team management dashboard
- Account and subscription settings
- Document management and archives

---

## 4. Multi-Tenant & Team Management Features

### 4.1 Business Structure
- **Single User Account (Free Tier)**
  - Individual can use all features for free
  - Unlimited job tracking, invoices, customers
  - No team collaboration features

- **Team Account (Paid - Per Seat Pricing)**
  - Main account holder (Admin/Owner)
  - Additional team members (Employees)
  - Each additional seat = monthly fee (e.g., $15-25/month per seat)

### 4.2 Admin/Owner Capabilities
- Create and assign job tickets to employees
- Set hourly rates per employee (override personal rates)
- View real-time job progress and location (with GPS tracking)
- Approve/edit invoices before sending to customers
- Access all employee job histories and performance
- Set job priorities and reassign tasks
- View team-wide analytics and revenue

### 4.3 Employee Capabilities
- View assigned jobs only
- Update job status and progress
- Log hours and materials
- View draft invoices (approval workflow)
- Cannot create jobs (owner/admin assigns)
- Cannot access team financials (except their own summary)
- Limited to their own job assignments

### 4.4 Team Analytics Dashboard
- Total revenue and expenses across team
- Per-employee productivity metrics
- Job completion rates
- Profitability analysis
- Employee payroll integration points
- Customer satisfaction tracking

---

## 5. Database Architecture (PostgreSQL)

### 5.1 Core Tables

```
Users Table
- user_id (PK)
- email
- password_hash
- first_name
- last_name
- phone
- created_at
- updated_at
- account_type (solo/team)

Accounts Table
- account_id (PK)
- owner_id (FK to Users)
- business_name
- subscription_tier (free/team_basic/team_pro)
- max_team_members
- created_at
- subscription_end_date

TeamMembers Table
- member_id (PK)
- account_id (FK)
- user_id (FK)
- role (owner/admin/employee)
- hourly_rate
- created_at
- is_active

Customers Table
- customer_id (PK)
- account_id (FK)
- name
- email
- phone
- address
- city
- state
- postal_code
- notes
- created_at

Jobs Table
- job_id (PK)
- account_id (FK)
- customer_id (FK)
- assigned_to (FK to TeamMembers)
- title
- description
- job_type (new_work/repair/maintenance/emergency)
- status (lead/quoted/accepted/in_progress/completed/invoiced/paid)
- scheduled_date
- scheduled_time
- start_time
- end_time
- labor_hours (decimal)
- estimated_labor_hours
- location
- notes
- created_at
- updated_at

JobMaterials Table
- material_id (PK)
- job_id (FK)
- supplier
- description
- quantity
- unit_price
- total_cost
- material_type (electrical/plumbing/general)
- receipt_date
- created_at

Quotes Table
- quote_id (PK)
- job_id (FK)
- quote_number
- labor_hours
- hourly_rate
- labor_subtotal
- material_cost
- tax_rate
- tax_amount
- total_amount
- quote_date
- valid_until
- status (draft/sent/accepted/rejected)
- created_at

Invoices Table
- invoice_id (PK)
- job_id (FK)
- customer_id (FK)
- account_id (FK)
- invoice_number
- invoice_date
- due_date
- labor_hours
- hourly_rate
- labor_amount
- material_cost
- subtotal
- tax_amount
- total_amount
- paid_amount
- payment_status (draft/sent/viewed/accepted/paid/overdue)
- payment_date
- payment_method
- notes
- created_at

Payments Table
- payment_id (PK)
- invoice_id (FK)
- customer_id (FK)
- amount
- payment_method (cash/check/card/ach/other)
- payment_date
- reference_number
- created_at

ExpenseLogs Table
- expense_id (PK)
- account_id (FK)
- category (materials/tools/fuel/other)
- description
- amount
- date
- receipt_image_url
- created_at

SubscriptionLogs Table
- subscription_id (PK)
- account_id (FK)
- tier
- start_date
- end_date
- team_members_count
- monthly_cost
- renewal_date
- status (active/cancelled/paused)
```

---

## 6. User Interface & Experience Design

### 6.1 Mobile App Design Principles
- **Bottom Navigation** - Quick access to: Home, Calendar, Jobs, Invoices, Profile
- **Floating Action Button** - "+" for creating new jobs
- **Minimal Friction** - 2-3 taps maximum for common actions
- **Offline-First** - Work offline, sync when connected
- **Real-Time Notifications** - Job updates, payment received, invoice viewed

### 6.2 Key Screens

**Mobile Screens:**
1. Dashboard Home
   - Today's jobs
   - Monthly income/costs
   - Pending invoices
   - Quick stats

2. Job List
   - Filtered view (status, date)
   - Swipe actions (edit, complete, message)
   - Job card with customer, time, status

3. Create/Edit Job
   - Customer selection or quick add
   - Job title, description
   - Scheduled date/time
   - Materials quick-add
   - Labor hours estimate

4. Calendar
   - Month/week view
   - Tap to see job details
   - Drag to reschedule
   - Color-coded status

5. Invoice Creation
   - Auto-populate from job
   - Edit materials/hours
   - Preview
   - Send (email/SMS)

6. Analytics/Dashboard
   - Income vs. expenses
   - Monthly comparison
   - Jobs completed trend
   - Top customers

7. Team Management (Owner Only)
   - List of team members
   - Add/remove employees
   - Set rates
   - View member's jobs/productivity

**Desktop Enhancements:**
- Larger forms with more data
- Bulk operations
- Advanced filtering
- Comprehensive reporting
- Document management

---

## 7. Business Model & Pricing

### 7.1 Pricing Tiers

**Free Tier (Solo Users)**
- Unlimited jobs, invoices, customers
- Basic dashboard
- Calendar and job management
- Invoice generation and sending
- No team features
- No advanced analytics
- Community support only

**Team Basic - $99/month + $15/seat**
- Everything in Free tier
- Up to 5 employees
- Employee management
- Job assignment and tracking
- Team dashboard
- Email/phone support
- Additional seats at $15/month each

**Team Professional - $299/month + $15/seat**
- Everything in Team Basic
- Up to 25 employees
- Advanced reporting and analytics
- Custom invoice templates
- Integration with accounting software
- Priority support (chat, phone)
- Additional seats at $15/month each

**Team Enterprise - Custom pricing**
- Unlimited employees
- Custom features and integrations
- Dedicated account manager
- On-premise deployment option
- SLA guarantees
- Phone/video support

### 7.2 Revenue Model
- Monthly subscription for team accounts
- Per-seat pricing encourages scaling
- Free tier enables user acquisition (conversion funnel)
- Optional add-ons (integrations, premium templates, etc.)

### 7.3 Payment Processing
- Stripe/Razorpay for subscription billing
- Integration with payment processors for customer invoicing
- Automatic billing and renewal
- Invoice history and receipt generation

---

## 8. Integration Points

### 8.1 Required Integrations
1. **Payment Processing**
   - Stripe, Square, PayPal for customer payments
   
2. **Accounting Software**
   - QuickBooks Online
   - Xero
   - Wave (free accounting)
   
3. **Communication**
   - SMS API (Twilio) for job updates and reminders
   - Email service (SendGrid, AWS SES)
   
4. **Cloud Storage**
   - AWS S3 or Azure Blob for documents, photos
   - Invoice PDF generation and storage

5. **Maps & Location**
   - Google Maps for job location and navigation
   - Geofencing for job arrival verification

### 8.2 Future Integrations
- Supplier APIs (Home Depot, Lowe's, local supply shops)
- CRM systems
- Project management tools
- Time tracking integrations
- Insurance and permit management

---

## 9. Technical Architecture

### 9.1 Backend
- **Framework:** ASP.NET Core 8+
- **Database:** PostgreSQL 15+
- **API:** RESTful API with OpenAPI/Swagger documentation
- **Authentication:** JWT tokens with OAuth2 options
- **Hosting:** Cloud-agnostic (AWS, Azure, or self-hosted)
- **Cache:** Redis for session management and real-time data

### 9.2 Mobile Frontend
- **Framework:** React Native or Flutter (cross-platform iOS/Android)
- **State Management:** Redux or Riverpod
- **Offline Sync:** Local SQLite + cloud sync engine
- **Maps:** Google Maps integration

### 9.3 Web Frontend
- **Framework:** React.js or Angular
- **UI Library:** Material-UI or Tailwind CSS
- **Responsive:** Mobile-first responsive design
- **PWA:** Progressive Web App for installable experience

### 9.4 DevOps & Infrastructure
- **Version Control:** Git (GitHub/GitLab)
- **CI/CD:** GitHub Actions or GitLab CI
- **Containerization:** Docker
- **Orchestration:** Kubernetes or Docker Compose
- **Monitoring:** Application Insights, Datadog, or ELK stack
- **Logging:** Structured logging with correlation IDs

---

## 10. Security & Compliance

### 10.1 Data Security
- End-to-end encryption for sensitive data (customer info, payment data)
- HTTPS/TLS 1.2+ for all communications
- Password hashing with bcrypt (salt rounds ≥ 12)
- API rate limiting and DDoS protection
- Regular security audits and penetration testing

### 10.2 Compliance
- **GDPR** - Data privacy for EU users
- **CCPA** - California consumer privacy
- **PCI-DSS** - For payment processing (via Stripe/third-party)
- **SOC 2 Type II** - Security and availability compliance
- **HIPAA** - If handling any health-related data
- Regular data backups with disaster recovery plan

### 10.3 Access Control
- Role-based access control (RBAC)
- Multi-factor authentication (MFA) for accounts
- Audit logging for all admin actions
- Session management and timeout policies
- API key management for integrations

---

## 11. Performance & Scalability

### 11.1 Performance Targets
- **API Response Time:** < 200ms for 95th percentile
- **Mobile App Load:** < 3 seconds for initial screen
- **Database Query Time:** < 100ms for typical operations
- **Uptime:** 99.9% SLA

### 11.2 Scalability Strategy
- Horizontal scaling for API servers (stateless)
- Database replication and read replicas
- CDN for static assets
- Async job processing for heavy operations (report generation, file processing)
- Message queue (RabbitMQ/Azure Service Bus) for event-driven architecture

### 11.3 Caching Strategy
- Redis for session management
- Cache common queries (customers, rates, templates)
- CDN caching for static assets and media
- Browser caching with proper cache headers

---

## 12. Feature Roadmap

### Phase 1: MVP (Months 1-3)
- Core job management
- Simple invoice generation
- Single-user functionality
- Mobile-responsive web interface
- Basic dashboard
- PostgreSQL database
- User authentication

### Phase 2: Team Features (Months 4-6)
- Multi-user/team management
- Job assignment system
- Team dashboard
- Employee roles and permissions
- Subscription and billing system

### Phase 3: Advanced Features (Months 7-9)
- Advanced reporting and analytics
- Payment processing integration
- Expense tracking
- Supplier integration (quotes and materials)
- Custom invoice templates
- GPS job tracking

### Phase 4: Enterprise & Integrations (Months 10-12)
- QuickBooks/Xero integration
- Advanced analytics and forecasting
- Custom branding for team accounts
- API for third-party integrations
- Bulk operations and imports
- Premium support tiers

### Phase 5: Future Features
- AI-powered pricing recommendations
- Automated follow-up and reminder system
- Customer portal for job tracking
- Mobile app (iOS/Android native)
- Field photo documentation with AI analysis
- Predictive maintenance recommendations
- Marketplace for add-ons and integrations

---

## 13. Success Metrics & KPIs

### 13.1 Product Metrics
- **User Acquisition:** Target 1,000 free users in Year 1
- **Conversion Rate:** 5-10% of free users → paid plan
- **Monthly Recurring Revenue (MRR):** Target $50K by end of Year 1
- **Customer Lifetime Value (CLV):** Target $2,500+ for team accounts
- **Churn Rate:** Target < 5% monthly churn
- **Net Promoter Score (NPS):** Target > 50

### 13.2 Usage Metrics
- **Active Users:** Monthly and daily active users
- **Jobs Tracked:** Average jobs per user per month
- **Invoice Volume:** Total invoices generated
- **Revenue Through Platform:** Revenue from jobs tracked
- **Feature Adoption:** Percentage using advanced features

### 13.3 Business Metrics
- **Customer Acquisition Cost (CAC):** < $50 per free user
- **Payback Period:** < 2 months for team accounts
- **Gross Margin:** Target > 70% (SaaS standard)
- **Operating Margin:** Path to profitability by Month 24

---

## 14. Competitive Analysis

### Housecall Pro Strengths
✓ Comprehensive ecosystem  
✓ AI features (CSI AI for call handling)  
✓ 200K+ user base  
✗ Higher pricing ($99-499+/month)  
✗ Complex interface  

### Jobber Strengths
✓ Strong mobile experience  
✓ 300K+ users  
✓ Good marketing tools  
✗ Starts at $59/month  
✗ Complex for solo users  

### HandimanApp Advantages
✓ FREE for solo users (lowest barrier to entry)  
✓ Simple, intuitive interface  
✓ Transparent per-seat pricing  
✓ Trade-agnostic but optimized  
✓ Modern mobile-first design  
✓ Quick onboarding (< 5 minutes)  

---

## 15. Risk & Mitigation

### 15.1 Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|------------|-----------|
| Slow user adoption | Revenue delay | Medium | Freemium model, targeted marketing, partnerships with trade associations |
| Competition response | Market share loss | High | Focus on simplicity, superior UX, community building |
| Data breach | Legal liability, reputation | Low | Regular security audits, encryption, SOC 2 compliance, insurance |
| Key employee departure | Development delay | Medium | Knowledge documentation, cross-training, competitive compensation |
| Payment processor issues | Revenue interruption | Low | Multiple payment processor integrations, fallback options |
| Database scaling issues | Performance degradation | Low | Proper database design, monitoring, replication strategy |

### 15.2 Mitigation Strategies
- Regular security audits and penetration testing
- Comprehensive automated testing (unit, integration, E2E)
- Disaster recovery and backup procedures
- Documentation and knowledge sharing
- Community feedback loops for rapid iterations
- Gradual feature rollouts with canary deployments

---

## 16. Go-To-Market Strategy

### 16.1 Launch Phase
1. **Free Tier Launch** - Attract solo electricians, plumbers, handymen
2. **Trade-Specific Marketing** - Target Facebook groups, Reddit communities, trade forums
3. **Influencer Partnerships** - Work with trade YouTube channels and podcasts
4. **Free Trial Period** - 30-day trial for team features

### 16.2 Growth Phase
1. **Referral Program** - Incentivize users to refer others
2. **Content Marketing** - Blog posts, guides for trades professionals
3. **API/Integration Partners** - Ecosystem expansion
4. **Trade Show Presence** - HVAC, electrical, plumbing conferences
5. **Local Partnerships** - Collaboration with supplier shops

### 16.3 Messaging
- "Manage Your Trades Business - Free"
- "Focus on the work, not the paperwork"
- "From solo to scale - your toolkit grows with you"
- "Simple enough for one person, powerful enough for a team"

---

## 17. User Onboarding Flow

### First-Time User (Mobile)
1. Sign up with email/password (< 30 seconds)
2. Select trade/industry
3. Set hourly rate
4. Create first job (guided flow)
5. Generate first invoice (automated, 2 clicks)
6. Start using app

### Team Account Activation
1. Upgrade to team plan (choose seat count)
2. Add team members (email invites)
3. Set individual rates per member
4. Assign jobs to team
5. View team dashboard

---

## 18. Success Stories & Use Cases

### Use Case 1: Solo Electrician
- Joe is an independent electrician
- Creates job when called for a job
- Logs time spent and materials used
- Generates invoice at job completion
- Gets paid - all without leaving job site
- Monthly savings on manual paperwork: 8 hours

### Use Case 2: Growing Plumbing Company
- Sarah started with 1 employee, now has 4
- Uses HandimanApp to dispatch jobs
- Tracks employee performance and productivity
- Reviews job costs and profitability
- Scales team pricing based on demand
- Plans to hire 2 more based on capacity visibility

### Use Case 3: HVAC Service Manager
- Manages 8 technicians
- Uses dashboard to monitor daily progress
- Identifies high-margin vs. low-margin jobs
- Reassigns jobs in real-time
- Provides customers with real-time updates
- Reduced invoice time from 2 hours to 15 minutes per week

---

## 19. Appendix: Technical Specifications

### 19.1 System Requirements
- **Mobile:** iOS 13+, Android 8+
- **Web:** Chrome, Firefox, Safari, Edge (latest versions)
- **Database:** PostgreSQL 13+
- **Server:** 2+ CPU cores, 4GB RAM minimum

### 19.2 Data Storage Estimates (Year 1)
- 10,000 users
- 100,000 jobs
- 200,000 invoices
- Database size: ~10-20 GB

### 19.3 Infrastructure Costs
- Cloud hosting (AWS/Azure): $2,000-5,000/month
- Database management: $500-1,000/month
- Payment processing fees: 2.9% + $0.30 per transaction
- CDN and storage: $500-1,000/month
- Monitoring and logging: $500-1,000/month

---

## 20. Conclusion

HandimanApp addresses a significant gap in the field service management market by providing a free, simple, and scalable solution for trades professionals. By starting with a strong freemium model and building upward, the platform can achieve rapid user acquisition while maintaining a clear path to revenue through per-seat team pricing.

The combination of mobile-first design, PostgreSQL reliability, C# development efficiency, and focused feature set positions HandimanApp for success in the $10+ billion home services market.

**Next Steps:**
1. Validate market demand through user interviews
2. Build MVP with core job, invoice, and dashboard features
3. Launch closed beta with 100 trades professionals
4. Gather feedback and iterate
5. Public launch with marketing campaign targeting solo operators
6. Monitor KPIs and scale based on user feedback
