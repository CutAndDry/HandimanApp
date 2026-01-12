# HandimanApp - User Stories & Application Flow

## Table of Contents
1. [User Personas](#user-personas)
2. [User Stories by Persona](#user-stories-by-persona)
3. [Application Flow Diagrams](#application-flow-diagrams)
4. [Core Workflows](#core-workflows)
5. [Mobile App Navigation](#mobile-app-navigation)
6. [Desktop App Navigation](#desktop-app-navigation)

---

## User Personas

### Persona 1: Solo Joe (Independent Electrician)
- **Age:** 35
- **Experience:** 12 years in electrical work
- **Tech Level:** Basic (smartphone user, minimal admin)
- **Pain Points:** 
  - Manually tracking jobs on notepad
  - Creating invoices in Excel
  - Forgetting to add material costs
  - No visibility into monthly income
- **Goals:**
  - Spend less time on paperwork
  - Get paid faster
  - Track monthly profit
  - Work from phone on-site

### Persona 2: Sarah (Small Plumbing Company Owner)
- **Age:** 42
- **Experience:** 15 years, now manages 3 employees
- **Tech Level:** Intermediate (comfortable with software)
- **Pain Points:**
  - Difficulty tracking multiple employee jobs
  - Miscommunication about job status
  - Struggling to verify employee hours
  - No visibility into team profitability
- **Goals:**
  - Manage team efficiently
  - Ensure quality work on all jobs
  - Monitor employee productivity
  - Scale to 5+ employees
  - Improve profit margins

### Persona 3: Mike (HVAC Technician - Employee)
- **Age:** 28
- **Experience:** 5 years in HVAC
- **Tech Level:** High (tech-savvy millennial)
- **Pain Points:**
  - Receives jobs via text (disorganized)
  - No visibility into schedule
  - Can't update job status on-site
  - Confused about which materials to charge
- **Goals:**
  - Know assigned jobs for the day
  - Update job status easily
  - Track own performance
  - Get paid correctly

### Persona 4: Kevin (Handyman Startup)
- **Age:** 48
- **Experience:** 8 years (just went independent)
- **Tech Level:** Low (prefers simplicity)
- **Pain Points:**
  - Never used business software
  - Worried about complexity
  - Can't afford expensive solutions
  - Needs quick learning curve
- **Goals:**
  - Simple, no-nonsense tool
  - Free or very cheap
  - Learn as he goes
  - Be professional with customers

---

## User Stories by Persona

## SOLO OPERATOR WORKFLOWS

### Story 1.1: Solo Joe Creates First Job (On-Site)

**As a** Solo Joe (independent electrician)  
**I want to** quickly create a job ticket while on-site at customer's location  
**So that** I have a record of the job and can generate an invoice later  

**Acceptance Criteria:**
- [ ] Can create job with 3 taps from home screen
- [ ] Can add customer name (quick add if new)
- [ ] Can set estimated labor hours
- [ ] Can add materials (empty initially)
- [ ] Job shows in calendar immediately
- [ ] Works offline and syncs when connected

**Flow:**
```
Home Screen → Tap "+" FAB → Quick Create Job Form
├─ Customer: "John Smith" (or select from list)
├─ Job Type: "Electrical Repair"
├─ Location: "123 Main St, Springfield"
├─ Estimated Hours: "2.5 hours"
├─ Notes: "Replace circuit breaker"
└─ Save → Job created, appears in calendar
```

**Implementation Notes:**
- Use phone's camera for quick capture of address
- Autocomplete for frequent customers
- Default to today's date

---

### Story 1.2: Solo Joe Adds Materials from Supply Shop Quote

**As a** Solo Joe  
**I want to** add materials I bought from the electrical supply shop  
**So that** I can include actual costs in the invoice  

**Acceptance Criteria:**
- [ ] Can manually add multiple materials to a job
- [ ] Can enter quantity, unit price, and total
- [ ] Can specify supplier name
- [ ] Can take photo of receipt (future: OCR to auto-extract)
- [ ] Materials persist with job
- [ ] Can edit materials before invoice

**Flow:**
```
Job Detail Screen → "Materials" Section
├─ "Add Material" button
├─ Supplier: "Home Depot"
├─ Description: "14/2 Romex Wire 250ft"
├─ Quantity: "1"
├─ Unit Price: "$45.99"
├─ Total: "$45.99"
├─ Optional: Take photo of receipt
└─ Add → Material added to job
   → Repeat for additional items
```

**Implementation Notes:**
- Calculate running total automatically
- Show total materials cost on job card
- Material type categorization for future reporting

---

### Story 1.3: Solo Joe Logs Time on Active Job

**As a** Solo Joe  
**I want to** log the time I spent working on a job  
**So that** the invoice calculates correct labor charges  

**Acceptance Criteria:**
- [ ] Can manually enter hours worked
- [ ] Can use timer to track time in real-time
- [ ] Can pause and resume timer
- [ ] Can edit hours after job completion
- [ ] Hours stored with job
- [ ] Display hours in invoice preview

**Flow Option A: Manual Entry**
```
Job Detail Screen → "Labor" Section
├─ Estimated Hours: "2.5" (read-only)
├─ Actual Hours: [Input field]
├─ Enter: "2.75"
└─ Save → Updated in job
```

**Flow Option B: Timer**
```
Job Detail Screen → "Start Timer" button
├─ Timer starts, shows elapsed time
├─ "Pause" button visible during work
├─ "Stop" button when done
└─ Confirm hours → Saved to job
```

**Implementation Notes:**
- Allow both manual and timer methods
- Show running total on job card
- Warn if actual >> estimated hours

---

### Story 1.4: Solo Joe Generates Invoice for Customer

**As a** Solo Joe  
**I want to** quickly generate an invoice combining labor hours + materials  
**So that** I can send it to customer and get paid  

**Acceptance Criteria:**
- [ ] Invoice auto-populates from job data
- [ ] Shows labor hours × hourly rate
- [ ] Shows all materials and costs
- [ ] Calculates subtotal and tax
- [ ] Can preview before sending
- [ ] Can send via email or SMS
- [ ] Customer can view invoice (link)
- [ ] Can mark as paid when received

**Flow:**
```
Job Detail Screen → "Generate Invoice" button
├─ Invoice Preview Screen
│  ├─ Customer: "John Smith"
│  ├─ Job Description: "Electrical Repair"
│  ├─ Labor: 2.75 hours × $65/hr = $178.75
│  ├─ Materials: $45.99
│  ├─ Subtotal: $224.74
│  ├─ Tax (8%): $17.98
│  └─ Total: $242.72
├─ "Edit" options (optional)
├─ "Send Invoice" button
│  ├─ Via Email
│  ├─ Via SMS
│  └─ Share Link (optional)
└─ Invoice sent → Job status: "Invoiced"
   → Customer receives via email
```

**Implementation Notes:**
- Pre-populate hourly rate (customizable globally)
- Auto-calculate tax based on state/region
- Generate unique invoice number
- PDF preview with professional template

---

### Story 1.5: Solo Joe Tracks Monthly Income & Expenses

**As a** Solo Joe  
**I want to** see how much I made this month vs. expenses  
**So that** I know my profit and can plan for taxes  

**Acceptance Criteria:**
- [ ] Dashboard shows current month at a glance
- [ ] Shows total income (sum of paid invoices)
- [ ] Shows total material costs
- [ ] Calculates net profit
- [ ] Shows trend vs. previous months
- [ ] Can filter by custom date range
- [ ] Provides export for tax filing

**Flow:**
```
Dashboard Screen (Home)
├─ Month Selector: "January 2026"
├─ Income Card
│  ├─ Total Revenue: "$4,250"
│  ├─ Invoices Paid: 8
│  └─ Avg per job: "$531"
├─ Expenses Card
│  ├─ Materials: "$1,200"
│  ├─ Gas/Travel: "$150"
│  └─ Other: "$50"
├─ Profit Summary
│  ├─ Gross Profit: "$2,850"
│  ├─ Profit Margin: 67%
│  └─ Comparison: "+15% vs last month"
├─ Recent Invoices (paid/pending)
└─ "Generate Report" → PDF/Excel export
```

**Implementation Notes:**
- Show pending vs. paid separately
- Color-code profit metrics
- Include year-to-date summary
- Provide tax preparation report

---

### Story 1.6: Solo Joe Views Calendar & Manages Schedule

**As a** Solo Joe  
**I want to** see my jobs in a calendar  
**So that** I can plan my week and not miss appointments  

**Acceptance Criteria:**
- [ ] Calendar shows all jobs with dates
- [ ] Color-coded by status (lead/in-progress/complete)
- [ ] Can tap job to see details
- [ ] Can drag job to reschedule
- [ ] Shows alerts for upcoming jobs
- [ ] Can hide completed jobs
- [ ] Can filter by job type

**Flow:**
```
Calendar Screen
├─ Month View (default)
│  ├─ January 2026
│  ├─ Jobs shown as colored dots/blocks
│  └─ Tap date → day view
├─ Week View (swipe to change)
│  ├─ Time slots
│  ├─ Job blocks with customer name
│  ├─ Drag to reschedule
│  └─ Tap for details
├─ Day View
│  ├─ Chronological list
│  ├─ Status badge
│  └─ Quick actions
└─ Filters
   ├─ Status (lead/in-progress/complete)
   ├─ Job type
   └─ Completed (show/hide)
```

**Implementation Notes:**
- Send reminder notifications 1 day before
- Show weather for scheduled day
- Highlight overdue jobs
- Mobile default: week view

---

## TEAM OWNER WORKFLOWS

### Story 2.1: Sarah Upgrades to Team Plan

**As a** Sarah (small business owner)  
**I want to** upgrade from free plan to team plan  
**So that** I can manage my 3 employees and track their jobs  

**Acceptance Criteria:**
- [ ] Can upgrade from settings screen
- [ ] Shows team plan options (Basic/Pro)
- [ ] Can select number of initial seats
- [ ] Payment processed smoothly
- [ ] Upgrade takes effect immediately
- [ ] Can add employees after upgrade

**Flow:**
```
Settings Screen → Account Settings
├─ Current Plan: "Free (Solo)"
├─ "Upgrade to Team" button
├─ Plan Selection
│  ├─ Team Basic: $99/mo + $15/seat
│  │  └─ Team Pro: $299/mo + $15/seat
├─ Seat Count: 3 employees
├─ Total: $99 + $45 = $144/month
├─ Enter Payment Info
│  └─ Stripe payment form
└─ Upgrade Complete → Redirects to team settings
```

**Implementation Notes:**
- Show ROI message (1 employee often pays for itself)
- Free trial period for team features (7-14 days)
- Easy downgrade option in settings

---

### Story 2.2: Sarah Adds Team Members

**As a** Sarah  
**I want to** add my employees to the team account  
**So that** they can see their assigned jobs and update status  

**Acceptance Criteria:**
- [ ] Can invite employees via email
- [ ] Employees receive onboarding email
- [ ] Can set individual hourly rates
- [ ] Can deactivate employees (not delete)
- [ ] Can view all team members
- [ ] Can see member status (active/inactive)

**Flow:**
```
Team Settings Screen
├─ "Team Members" section
├─ Current Members: (Sarah, Owner)
├─ "Add Team Member" button
├─ Add Member Form
│  ├─ Email: "mike@example.com"
│  ├─ Name: "Mike Johnson"
│  ├─ Trade: "HVAC Technician"
│  ├─ Hourly Rate: "$55"
│  ├─ Role: (Employee/Admin)
│  └─ Send Invite
├─ Email sent to Mike
│  ├─ Invite link
│  ├─ Join button
│  └─ Creates login account
└─ Mike appears in team member list
```

**Implementation Notes:**
- Auto-fill rate suggestions by trade
- Allow bulk employee import (CSV)
- Track date member was added (for billing)

---

### Story 2.3: Sarah Assigns Jobs to Technicians

**As a** Sarah  
**I want to** create a job and assign it to a specific employee  
**So that** they know what work needs to be done and when  

**Acceptance Criteria:**
- [ ] Can select employee when creating job
- [ ] Can reassign jobs to different employees
- [ ] Employee receives notification
- [ ] Job appears in employee's "My Jobs" list
- [ ] Manager can see all jobs + who's assigned
- [ ] Can view unassigned jobs

**Flow:**
```
Create Job Screen (Manager View)
├─ Customer: "ABC Manufacturing"
├─ Job Type: "HVAC Maintenance"
├─ Scheduled Date: "Jan 15, 2026"
├─ Assign To: [Dropdown: Mike, David, Lisa]
│  └─ Select "Mike"
├─ Estimated Hours: "3"
├─ Notes: "Annual service, replace filters"
└─ Save → Job created and assigned

Mike's Mobile App:
├─ Dashboard shows new job notification
├─ "New job assigned: ABC Manufacturing"
├─ Job appears in "My Jobs" list
└─ Marked as "Assigned" (not started)
```

**Implementation Notes:**
- Smart assignment suggestions (distance, workload)
- Show technician's current workload
- Push notifications for new assignments

---

### Story 2.4: Sarah Views Team Dashboard

**As a** Sarah  
**I want to** see overall team performance and revenue  
**So that** I can manage the business and identify trends  

**Acceptance Criteria:**
- [ ] Dashboard shows total team revenue
- [ ] Shows jobs completed by team
- [ ] Shows revenue per employee
- [ ] Shows profitability
- [ ] Can filter by date range
- [ ] Highlights high-performing employees
- [ ] Shows pending invoices

**Flow:**
```
Team Dashboard Screen
├─ Month Selector: "January 2026"
├─ Key Metrics Cards
│  ├─ Total Revenue: $12,450
│  ├─ Jobs Completed: 24
│  ├─ Avg Job Value: $519
│  └─ Profit Margin: 65%
├─ Team Performance
│  ├─ Mike: 8 jobs, $4,250
│  ├─ David: 9 jobs, $4,100
│  ├─ Lisa: 7 jobs, $4,100
│  └─ (Ranked by revenue)
├─ Financial Breakdown
│  ├─ Revenue by type (labor/materials)
│  ├─ Expenses: $4,350
│  └─ Net Profit: $8,100
├─ Pending Actions
│  ├─ Unpaid Invoices: 3 ($1,850)
│  ├─ In Progress Jobs: 5
│  └─ Overdue Jobs: 1
└─ Export Report → PDF
```

**Implementation Notes:**
- Use charts (line, bar, pie)
- Show trends vs. previous period
- Highlight anomalies (very high/low revenue)
- Comparison with industry benchmarks

---

### Story 2.5: Sarah Monitors In-Progress Jobs

**As a** Sarah  
**I want to** see real-time status of jobs my team is working on  
**So that** I can manage customer expectations and catch delays  

**Acceptance Criteria:**
- [ ] List of in-progress jobs
- [ ] Shows assigned employee
- [ ] Shows elapsed time
- [ ] Shows estimated vs. actual progress
- [ ] Can see job photos (if uploaded)
- [ ] Can send message to technician
- [ ] Can mark job complete (override)

**Flow:**
```
In-Progress Jobs Screen
├─ Active Jobs List
│  ├─ ABC Manufacturing - Mike (2.5 hrs elapsed, est 3 hrs)
│  │  ├─ Status: "Half Done"
│  │  ├─ Photos: [Tap to view]
│  │  ├─ Message button
│  │  └─ Mark Complete button
│  ├─ XYZ Corp - David (1.2 hrs, est 2.5 hrs)
│  └─ (More jobs...)
├─ Map View (optional)
│  ├─ Real-time technician locations
│  ├─ Tap pin → job details
│  └─ Shows ETA to next job
└─ Filter: By employee, by job type, by priority
```

**Implementation Notes:**
- Push notifications if job exceeds estimated time
- GPS tracking with privacy controls
- Photo uploads for job progress
- In-app messaging system

---

### Story 2.6: Sarah Reviews Employee Performance

**As a** Sarah  
**I want to** see each employee's productivity, quality, and consistency  
**So that** I can give feedback, identify training needs, and reward top performers  

**Acceptance Criteria:**
- [ ] Can view employee summary metrics
- [ ] Shows jobs completed per month
- [ ] Shows average job value
- [ ] Shows on-time completion rate
- [ ] Shows customer ratings (future)
- [ ] Can see employee's job history
- [ ] Can generate performance reports

**Flow:**
```
Team Performance Screen → Click Employee "Mike"
├─ Employee Overview
│  ├─ Name: Mike Johnson
│  ├─ Role: HVAC Technician
│  ├─ Hourly Rate: $55
│  ├─ Jobs This Month: 8
│  ├─ Revenue Generated: $4,250
│  ├─ Avg Job Value: $531
│  └─ On-Time Completion: 87%
├─ Monthly Breakdown (chart)
│  ├─ Jan: 8 jobs / $4,250
│  ├─ Dec: 7 jobs / $3,850
│  └─ Trend: +2% growth
├─ Recent Jobs
│  ├─ ABC Manufacturing - Complete - 3 hrs
│  ├─ XYZ Corp - Complete - 2.5 hrs
│  └─ (Job list)
└─ Actions
   ├─ Message employee
   ├─ View detailed report
   └─ Adjust hourly rate
```

**Implementation Notes:**
- Gamify performance (badges, achievements)
- Allow custom performance metrics
- Export performance reviews
- Benchmark against team average

---

## EMPLOYEE WORKFLOWS

### Story 3.1: Mike Views Assigned Jobs for Today

**As a** Mike (HVAC technician, employee)  
**I want to** see all jobs assigned to me for today  
**So that** I know where to go and what to do  

**Acceptance Criteria:**
- [ ] Home screen shows today's jobs
- [ ] Jobs listed in chronological order
- [ ] Shows customer name and address
- [ ] Shows estimated hours
- [ ] Can tap for full job details
- [ ] Map shows job locations

**Flow:**
```
Employee Home Screen
├─ Today's Jobs (Jan 15, 2026)
├─ Job 1: "ABC Manufacturing"
│  ├─ 9:00 AM - Est 3 hours
│  ├─ Address: "123 Industrial Blvd"
│  ├─ Directions button [→ Opens Maps]
│  ├─ Customer: "John Smith"
│  ├─ Phone button [→ Call]
│  └─ Tap to expand
├─ Job 2: "XYZ Corp"
│  ├─ 1:00 PM - Est 2.5 hours
│  └─ (Similar details)
├─ Job 3: "Quick Repair"
│  └─ (As needed)
└─ Map View → Shows all job locations for the day
```

**Implementation Notes:**
- Geofence notification when arriving at job
- Sort by time or distance
- Show traffic/drive time
- One-tap to call customer

---

### Story 3.2: Mike Updates Job Status on Site

**As a** Mike  
**I want to** mark a job as "Started", "In Progress", and "Complete"  
**So that** my manager knows what I'm doing and customer knows when I'll be done  

**Acceptance Criteria:**
- [ ] Can update status with one tap
- [ ] Can add notes about the work
- [ ] Can upload photos of work
- [ ] Status shows in manager's dashboard immediately
- [ ] Customer receives status update (SMS/notification)
- [ ] Can mark complete even if offline

**Flow:**
```
Job Detail Screen (Employee)
├─ Job: "ABC Manufacturing - HVAC Service"
├─ Current Status: "Assigned"
├─ Status Update Options
│  ├─ "Start Work" button
│  │  └─ Status changes to "In Progress"
│  │     Timestamp recorded
│  ├─ Add Notes button
│  │  ├─ Type notes about work
│  │  └─ Save
│  ├─ Take Photo button
│  │  ├─ Photo uploaded
│  │  └─ Shows in gallery
│  └─ "Mark Complete" button
│     ├─ Final notes (optional)
│     ├─ Confirm completion
│     └─ Status: "Complete"
│        Manager notified
└─ Return to Today's Jobs list
```

**Implementation Notes:**
- Auto-timestamp status changes
- Require confirmation for completion
- Allow photo batch uploads
- Sync when connection available

---

### Story 3.3: Mike Views His Assigned Materials

**As a** Mike  
**I want to** see what materials are included for the job  
**So that** I know what supplies the customer is paying for  

**Acceptance Criteria:**
- [ ] Can view all materials on job detail
- [ ] Shows description, quantity, cost
- [ ] Can mark materials as "used" or "not used"
- [ ] Can add additional materials on-site
- [ ] Manager can edit before invoicing

**Flow:**
```
Job Detail Screen → "Materials" Tab
├─ Materials for This Job
├─ ✓ 14/2 Romex Wire - 250ft - $45.99
├─ ✓ Circuit Breaker - 1 - $25.00
├─ ✓ Outlet Covers - 3 - $12.00
├─ Total Materials: $82.99
├─ "Add Material" button (employee view, limited)
│  ├─ Select from manager's list or
│  ├─ Quick add (requires approval)
│  └─ Submit
└─ Mark all as "Used" (bulk action)
```

**Implementation Notes:**
- Show per-unit cost
- Lock materials list (only manager can add)
- Allow override in field with notes
- Require approval before invoicing

---

### Story 3.4: Mike Logs Time on Job

**As a** Mike  
**I want to** log the hours I spent on this job  
**So that** I get paid correctly  

**Acceptance Criteria:**
- [ ] Can enter actual hours worked
- [ ] Can use timer to track time
- [ ] Can pause timer between tasks
- [ ] Hours saved with job
- [ ] Manager approves before invoicing
- [ ] Visible on timesheet for validation

**Flow:**
```
Job Detail Screen → "Time" Tab
├─ Estimated Hours: 3.0 (displayed, read-only)
├─ Actual Hours: [Input or Timer]
├─ Option 1: Manual Entry
│  ├─ Input: "3.5"
│  └─ Save
├─ Option 2: Timer
│  ├─ "Start Timer" button
│  ├─ Shows running elapsed time
│  ├─ "Pause" button available
│  ├─ "Resume" button (if paused)
│  └─ "Stop Timer" when done
│     Logged hours: 3.5
└─ Hours submitted for approval
   Manager reviews on dashboard
```

**Implementation Notes:**
- Show both estimated and actual
- Warn if actual >> estimated
- Sync time logs to manager
- Timesheet view on mobile

---

### Story 3.5: Mike Receives Notifications

**As a** Mike  
**I want to** get notifications when I'm assigned new jobs or when something urgent happens  
**So that** I don't miss important information  

**Acceptance Criteria:**
- [ ] Receive push notification for new job assignment
- [ ] Receive reminder 1 hour before scheduled job
- [ ] Receive message from manager (in-app & push)
- [ ] Receive notification when invoice sent to customer
- [ ] Can customize notification settings
- [ ] Works even when app closed

**Flow:**
```
Push Notifications
├─ New Job Assigned
│  ├─ "You've been assigned: ABC Manufacturing"
│  ├─ Time: 9:00 AM tomorrow
│  ├─ Tap → Opens job details
│  └─ Can accept or raise concern
├─ Job Reminder
│  ├─ "Reminder: ABC Mfg in 1 hour"
│  ├─ Address and directions
│  └─ Tap → Maps
├─ Message from Manager
│  ├─ "Sarah: Can you stay late Friday?"
│  ├─ Reply button
│  └─ Tap → Chat window
└─ Notification Settings
   ├─ Enable/disable types
   ├─ Quiet hours
   └─ Preferred notification method
```

**Implementation Notes:**
- Use OneSignal or Firebase Cloud Messaging
- Allow quiet hours (no notifications 6pm-7am)
- Show unread badge on app icon

---

## CORE WORKFLOWS

### Workflow 1: Complete Job Lifecycle (Solo User)

```
┌─────────────────────────────────────────────────────────────┐
│                     SOLO JOE'S JOB FLOW                     │
└─────────────────────────────────────────────────────────────┘

1. RECEIVE JOB CALL
   Customer calls → Joe answers
   
2. CREATE JOB TICKET
   └─ Open app
   └─ Tap "+" 
   └─ Select/add customer
   └─ Set job type, location, time
   └─ Save
   └─ Status: "LEAD"

3. VISIT CUSTOMER
   └─ Check calendar
   └─ Navigate using Google Maps
   └─ Arrive at location
   
4. PERFORM WORK
   └─ Start timer (or note start time)
   └─ Add materials as purchased
   └─ Take photos if needed
   └─ Keep notes on work done

5. COMPLETE JOB
   └─ Stop timer
   └─ Mark job "COMPLETE"
   └─ Status: "COMPLETED"

6. GENERATE INVOICE
   └─ Open job
   └─ "Generate Invoice"
   └─ Review: labor + materials + tax
   └─ Send via email
   └─ Status: "INVOICED"

7. GET PAID
   └─ Customer receives invoice
   └─ Customer pays (online or cash)
   └─ Joe marks paid
   └─ Status: "PAID"
   └─ Money appears in bank
   └─ Auto-logged for monthly reporting

8. TRACK FINANCIALS
   └─ Dashboard shows income
   └─ Profit calculated
   └─ Can export for taxes
   
[ Time: 1-2 days from call to paid ]
```

---

### Workflow 2: Assign & Track Employee Job (Team)

```
┌─────────────────────────────────────────────────────────────┐
│              SARAH'S TEAM JOB ASSIGNMENT FLOW               │
└─────────────────────────────────────────────────────────────┘

1. CUSTOMER CALLS BUSINESS
   Customer calls → Sarah (or voicemail)
   
2. SARAH CREATES JOB & ASSIGNS
   └─ Open app
   └─ Create job ticket
   ├─ Customer: "John Smith"
   ├─ Address: "456 Oak Ave"
   ├─ Type: "Plumbing Repair"
   ├─ Assign To: "Mike"
   ├─ Est. hours: 2.5
   └─ Save
   
3. MIKE NOTIFIED
   └─ Push notification: "New job: John Smith"
   └─ Job appears in his "My Jobs" list
   └─ Status: "ASSIGNED"
   
4. MIKE PREPARES & TRAVELS
   └─ Checks job details
   └─ Views materials included
   └─ Taps directions
   └─ Drives to location
   
5. MIKE WORKS ON SITE
   └─ Starts timer (or logs start time)
   └─ Updates status: "IN PROGRESS"
   └─ Adds any extra materials as needed
   └─ Takes photos
   └─ Completes work
   
6. MIKE MARKS COMPLETE
   └─ Stops timer
   └─ Logs actual hours
   └─ Marks job "COMPLETE"
   └─ Adds final notes
   
7. SARAH REVIEWS
   └─ Dashboard shows job complete
   └─ Reviews hours logged
   └─ Approves labor & materials
   └─ Checks photos (optional)
   
8. GENERATE & SEND INVOICE
   └─ Sarah taps "Invoice"
   └─ Previews: labor + materials
   └─ Sends to customer
   └─ Status: "INVOICED"
   
9. TRACK PAYMENT & PROFIT
   └─ Customer pays
   └─ Sarah marks "PAID"
   └─ Dashboard tracks revenue
   └─ Mike's productivity logged
   └─ Profit calculated
   
10. PAYROLL INTEGRATION (Future)
    └─ Mike's hours synced for payroll
    └─ Commission calculated if applicable
    
[ Time: Same day to payment ]
```

---

### Workflow 3: Monthly Financial Reconciliation

```
┌─────────────────────────────────────────────────────────────┐
│           MONTHLY FINANCIAL REVIEW WORKFLOW                 │
└─────────────────────────────────────────────────────────────┘

BEGINNING OF MONTH (Month N+1)
↓
1. SARAH OPENS DASHBOARD
   └─ Selects previous month (e.g., January)
   
2. REVIEWS KEY METRICS
   ├─ Total Revenue: $12,450
   ├─ Total Costs: $4,350
   ├─ Gross Profit: $8,100
   ├─ Profit Margin: 65%
   └─ Compare to Previous Month
   
3. DRILLS INTO DETAILS
   ├─ Revenue Breakdown
   │  ├─ Labor: $8,900
   │  └─ Materials: $3,550
   ├─ Expense Breakdown
   │  ├─ Materials: $4,350
   │  └─ Other: $0
   ├─ Per-Employee Performance
   │  ├─ Mike: 8 jobs, $4,250
   │  ├─ David: 9 jobs, $4,100
   │  └─ Lisa: 7 jobs, $4,100
   └─ Identify Trends
      ├─ Lisa's revenue down 10% (check why?)
      └─ Mike's on-time rate excellent
   
4. REVIEWS OUTSTANDING INVOICES
   └─ 2 invoices still unpaid
   └─ Send reminder to customers
   
5. PREPARES REPORT FOR ACCOUNTANT
   ├─ Export PDF summary
   ├─ Export detailed CSV
   │  └─ All jobs, customers, amounts
   ├─ Include supporting documents
   │  └─ Job photos, receipts
   └─ Email to accountant
   
6. PLANS FOR NEXT MONTH
   ├─ Identify high-value services
   ├─ Plan marketing focus
   ├─ Adjust pricing if needed
   ├─ Schedule team meeting
   └─ Set revenue goals

[ Data automatically available, minimal manual work ]
```

---

## MOBILE APP NAVIGATION

### Bottom Tab Navigation
```
┌──────────────────────────────────────────────┐
│  HandimanApp                         ⚙️    │  <- Settings
├──────────────────────────────────────────────┤
│                                              │
│           [MAIN CONTENT AREA]                │
│                                              │
├──────────────────────────────────────────────┤
│  Home  │  Calendar  │  +  │  Jobs  │  More   │
│   🏠   │     📅     │  ⊕  │  📋   │   ⋯     │
└──────────────────────────────────────────────┘

TAB DESCRIPTIONS:

🏠 HOME
└─ Daily dashboard
  ├─ Today's jobs (if employee)
  ├─ Business summary (if owner)
  ├─ Quick stats
  └─ Quick actions (create job, invoice)

📅 CALENDAR
└─ View all jobs by date
  ├─ Month/week/day view
  ├─ Tap to see details
  ├─ Drag to reschedule
  └─ Filter options

⊕ CREATE (Floating Action Button)
└─ Quick create menu
  ├─ New Job
  ├─ New Customer
  ├─ New Material Quick Add
  └─ New Expense

📋 JOBS / MY JOBS
└─ List view of all jobs
  ├─ Filter by status
  ├─ Sort by priority
  ├─ Search by customer
  └─ Swipe for actions

⋯ MORE
└─ Additional options
  ├─ Invoices
  ├─ Customers
  ├─ Analytics
  ├─ Team (if owner)
  ├─ Settings
  └─ Help
```

### Key Mobile Screens Flow

```
FIRST TIME USER FLOW
└─ Sign Up
   ├─ Email/password
   ├─ Name, phone
   ├─ Trade type
   ├─ Hourly rate
   └─ Welcome screen
   
DAILY USE FLOW
├─ Open app → Home screen
│  ├─ See today's jobs (if employee)
│  ├─ See dashboard summary (if owner)
│  └─ See notifications
├─ Create job → +FAB → "New Job"
├─ Update job → Tap job → Edit status
├─ Invoice → Tap job → "Generate Invoice"
└─ Track time → Tap job → Timer/Hours
   
ON-SITE FLOW (Employee)
├─ Navigate → Tap directions
├─ Update status → Tap job → "Started"
├─ Log photos → Tap job → Camera
├─ Mark complete → Tap job → "Complete"
└─ Offline sync → Auto when connected
   
MANAGEMENT FLOW (Owner)
├─ Dashboard → See summary
├─ Assign job → Create → Assign to person
├─ Monitor progress → Dashboard → In Progress
├─ Generate invoice → Tap job → Invoice
└─ Review team → More → Team
```

---

## DESKTOP APP NAVIGATION

### Main Navigation (Sidebar)

```
┌────────────────────────────────────────────────────────────┐
│  HandimanApp                                        ⚙️  👤  │
├─────────────────────┬──────────────────────────────────────┤
│ Navigation Panel    │                                      │
│                     │                                      │
│ 🏠 Dashboard        │         [MAIN CONTENT]               │
│ 📋 Jobs             │                                      │
│ 📅 Calendar         │                                      │
│ 💰 Invoices         │                                      │
│ 👥 Customers        │                                      │
│ 📊 Analytics        │                                      │
│ 👨‍💼 Team (if owner) │                                      │
│ ⚙️ Settings         │                                      │
│ ❓ Help & Support   │                                      │
│                     │                                      │
└─────────────────────┴──────────────────────────────────────┘

MAIN SECTIONS:

🏠 DASHBOARD
├─ Key metrics (revenue, profit, jobs)
├─ Charts (revenue trend, expenses)
├─ Today's activities
├─ Pending actions
└─ Quick links

📋 JOBS
├─ Table view (all jobs)
├─ Filters (status, date, customer)
├─ Sort options
├─ Bulk actions
├─ Create job button
└─ Job detail modal/page

📅 CALENDAR
├─ Large calendar view
├─ Week/month view toggle
├─ Drag to reschedule
├─ Click for details
├─ Event details sidebar
└─ Print option

💰 INVOICES
├─ Invoice list (table)
├─ Filter (status, date)
├─ Generate invoice button
├─ Send/resend option
├─ Download PDF
└─ Archive options

👥 CUSTOMERS
├─ Customer directory
├─ Search/filter
├─ Customer detail cards
├─ Job history per customer
├─ Add customer button
└─ Edit/delete options

📊 ANALYTICS
├─ Revenue reports
├─ Expense analysis
├─ Profitability
├─ Team performance (if owner)
├─ Custom date ranges
└─ Export options

👨‍💼 TEAM (Owner Only)
├─ Team members list
├─ Add/remove members
├─ Set hourly rates
├─ Performance metrics
├─ Job assignment view
└─ Employee reports

⚙️ SETTINGS
├─ Account settings
├─ Business info
├─ Subscription/billing
├─ Integrations
├─ Notification preferences
├─ Data export/backup
└─ Logout
```

---

## COMMON USER ACTIONS & TIME REQUIREMENTS

| Action | Solo User | Team Owner | Employee | Time |
|--------|-----------|-----------|----------|------|
| Create job | 1 tap + form | 1 tap + form | N/A | 1-2 min |
| Add material | Open job, add item | Open job, add item | View only | 30 sec |
| Log time | Timer or input | View/approve | Input hours | 30 sec |
| Generate invoice | 1 tap | 1 tap | View only | 30 sec |
| View dashboard | 1 tap | 1 tap | Limited | 1 min |
| Assign job | N/A | Select employee | Auto assigned | 15 sec |
| Update status | Tap job, select | Monitor | Tap job, update | 15 sec |
| View team performance | N/A | 1 tap | N/A | 1-2 min |
| Review monthly stats | 1 tap | 1 tap | N/A | 2-3 min |

---

## ONBOARDING EXPERIENCE

### Day 1: First Hour
```
1. Sign up (email, password) - 30 sec
2. Enter basic info - 1 min
3. Set hourly rate - 30 sec
4. Create first job - 2 min
5. View in calendar - 30 sec
6. Generate first invoice - 1 min
7. Start exploring - 5 min
Total: ~10 minutes to first invoice
```

### Day 1: First Day Use
```
1. Create 2-3 real jobs
2. Add materials as they work
3. Log time
4. Generate invoice
5. Send to customer
6. Get first feedback
```

### Week 1: Building Habits
```
Day 2: Daily job creation, time logging
Day 3: Generate first paid invoice
Day 4: Explore analytics
Day 5: Learn about features they missed
End of Week: Familiar with core features
```

### Month 1: Expansion
```
Week 1: Core features (create, invoice, paid)
Week 2: Calendar and scheduling
Week 3: Analytics and dashboards
Week 4: All advanced features
```

### Upgrade Moment (for Solo → Team)
```
Trigger: When they add notes like "Hired first employee"
OR: When they try to assign a job (prompts upgrade)
OR: When they see "Add Team Member" message
Conversion: 15-20% of solo users convert to team
```

---

## Error Scenarios & Recovery

### Scenario 1: Job Created Offline
```
User creates job with no internet
├─ App shows "⚠️ Offline - Will sync when online"
├─ Job saved locally
├─ Manager doesn't see it yet
└─ When online: Syncs automatically, manager notified
```

### Scenario 2: Employee Didn't Receive Job Assignment
```
Sarah assigned job, Mike didn't get notification
├─ App shows unread badge on job
├─ Resend notification option
├─ Sarah sees "Delivered at X:XX"
├─ Mike gets push notification
└─ Job marked as seen
```

### Scenario 3: Invoice Sent With Wrong Amount
```
Invoice with wrong total sent to customer
├─ Can recall invoice (mark void)
├─ Create new corrected invoice
├─ Send corrected version
├─ Old version marked void in system
└─ Audit trail maintained
```

---

## Success Metrics - How Users Know It's Working

### Solo Users
- ✅ First invoice generated (within day 1)
- ✅ Time saved on paperwork (after week 1)
- ✅ Monthly profit visible (after month 1)
- ✅ Can access data on phone at job site

### Team Owners
- ✅ All employees added and working (day 1)
- ✅ Jobs assigned and progressing (within day 2)
- ✅ Dashboard showing team productivity (within week 1)
- ✅ Payroll/performance data visible (within month 1)

### Employees
- ✅ Receive daily job list (day 1)
- ✅ Can update status on-site (day 1)
- ✅ Manager can see their progress (day 2)
- ✅ Time logs are accurate (week 1)

---

## Conclusion

This user story and flow documentation provides clear pathways for how different users interact with HandimanApp. The workflows emphasize:

1. **Simplicity** - Core actions take minimal taps
2. **Speed** - From job creation to invoice in minutes
3. **Clarity** - Users always know current status
4. **Scalability** - Solo to team is seamless
5. **Mobile-First** - Works great on phones

The next step is to implement these flows in the UI/UX design and validate with actual trade professionals.
