# HandimanApp - Quick Start Guide

## 🎯 Getting Started

### Step 1: Login
1. Go to **http://localhost:3000**
2. Use test credentials:
   - Email: `test@handiman.app`
   - Password: `Test123!`
3. Click "Login"

### Step 2: Navigate the Application

The sidebar has the following sections:
- 📊 **Dashboard** - View business metrics and recent activity
- 🔧 **Jobs** - Create, view, and manage jobs
- 📅 **Calendar** - See jobs scheduled on a calendar
- 💰 **Invoices** - Create and manage invoices
- 👥 **Customers** - Manage your customer list
- ⚙️ **Settings** - Configure your business account

---

## 📋 Common Workflows

### Creating a Job

1. Go to **Jobs** page
2. Click **"New Job"** button
3. Fill in:
   - **Customer ID** - Select from existing customers
   - **Job Title** - Name of the job (e.g., "Electrical Repair")
   - **Description** - Details about the work
   - **Location** - Where the job is located
   - **Estimated Labor Hours** - How long you expect it to take
4. Click **"Create Job"**

### Viewing Job Details

1. Go to **Jobs** page
2. **Click on any job** to view details
3. In the detail page you can:
   - See all job information
   - **Add materials** - Click "Add Material" to add costs
   - **Track time** - Use the timer to log hours worked
     - Click **"Start"** to begin timing
     - Click **"Pause"** to pause the timer
     - Click **"Save Hours"** to save to the job
   - **Update status** - Change from "Pending" → "In Progress" → "Completed"
   - **Create invoice** - Click "Create Invoice" to generate an invoice for this job

### Recording Labor Hours

1. Go to **Jobs** → Click on a job
2. In the **"Labor Hours"** section:
   - Use the **timer** for automatic time tracking
   - Or manually enter hours
3. Click **"Save Hours"** to record

### Adding Materials to a Job

1. Go to **Jobs** → Click on a job
2. In the **"Materials"** section:
   - Click **"Add Material"**
   - Fill in:
     - **Supplier** - Where you got the material
     - **Description** - What the material is
     - **Quantity** - How much
     - **Unit Price** - Cost per unit
     - **Material Type** - General, Electrical, or Plumbing
   - Click **"Save Material"**

### Creating an Invoice

**Method 1: From Jobs**
1. Go to **Jobs** → Click on a job
2. Click **"Create Invoice"** button
3. Fill in invoice details
4. Click **"Create Invoice"**

**Method 2: From Invoices Page**
1. Go to **Invoices** page
2. Click **"New Invoice"**
3. Select:
   - **Job** - Which job this invoice is for
   - **Customer** - Who to bill
   - **Due Date** - When payment is due
   - **Labor Hours** - Hours worked
   - **Hourly Rate** - Your rate per hour
   - **Material Costs** - Total material costs
4. Click **"Create Invoice"**

### Sending an Invoice

1. Go to **Invoices** page
2. Find the invoice you want to send
3. Click **"Send Email"** button
4. Invoice will be automatically emailed to customer

### Downloading Invoice as PDF

1. Go to **Invoices** page
2. Find the invoice
3. Click **"Download PDF"** button
4. PDF will download to your computer

### Recording Payment

1. Go to **Invoices** page
2. Find the invoice
3. Click **"Record Payment"**
4. Enter the payment amount
5. Click confirm
6. Invoice status will update automatically

### Managing Customers

1. Go to **Customers** page
2. **Add New Customer**:
   - Fill in the form on the left
   - Click **"Create"**
3. **Edit Customer**:
   - Click **"Edit"** on any customer
   - Update the information
   - Click **"Update"**
4. **Delete Customer**:
   - Click **"Delete"**
   - Confirm deletion

### Viewing the Calendar

1. Go to **Calendar** page
2. See all your jobs displayed on a calendar
3. Use **Previous/Next** buttons to navigate months
4. Use **Filter by Status** dropdown to show only certain types of jobs
5. Click any job to go to job details

### Exporting Data

1. Go to **Jobs** page (or **Invoices** page)
2. Click **"Export CSV"** button
3. A CSV file will download
4. Open in Excel or Google Sheets

### Updating Business Settings

1. Go to **Settings** page
2. Update:
   - **Business Name** - Your company name
   - **Business Type** - What type of services you provide
   - **Phone** - Your phone number
   - **Address** - Your business address
   - **Hourly Rate** - Your default hourly rate
   - **Tax Rate** - Your tax rate (e.g., 0.08 for 8%)
3. Click **"Update Account"**

---

## 📊 Understanding the Dashboard

The **Dashboard** shows:
- **Total Jobs** - How many jobs you've created
- **Completed Jobs** - How many are finished
- **In Progress Jobs** - How many you're currently working on
- **Total Revenue** - How much you've invoiced in total
- **Pending Invoices** - How many invoices haven't been paid
- **Recent Jobs** - Your 5 most recent jobs
- **Pending Invoices** - Invoices that need payment with due dates

---

## 🔧 Troubleshooting

### Can't log in?
- Check your email and password are correct
- Make sure the backend is running on localhost:5000
- Refresh the page

### Jobs not loading?
- Check that the backend API is running
- Go to http://localhost:5000/swagger to test the API
- Check browser console for errors (F12 → Console)

### Can't send emails?
- Email feature requires SMTP configuration
- In development, emails are logged but not actually sent
- Check appsettings.json for SMTP settings

### PDF download not working?
- Make sure the backend is running
- Check that the invoice exists
- Try refreshing the page

---

## 💡 Tips & Best Practices

1. **Use the Timer** - It's easier than manually entering hours
2. **Add Materials Immediately** - Don't forget material costs
3. **Update Job Status** - Keep statuses up to date for accurate reporting
4. **Set Hourly Rate** - Update in Settings so invoices calculate correctly
5. **Review Dashboard** - Check it regularly to see business metrics
6. **Export Monthly** - Export jobs/invoices monthly for your records
7. **Send Invoices Promptly** - Send invoices right after completing work

---

## 📱 Mobile Access

The app works on mobile browsers! You can:
- View your dashboard on the go
- Check pending invoices
- See your calendar
- View job details

Just open http://localhost:3000 on your mobile device (if on the same network).

---

## 🆘 Need Help?

Check the implementation guide for:
- Full API documentation at http://localhost:5000/swagger
- Database schema details
- Technical architecture
- Advanced configuration

---

**Happy invoicing! 🎉**

