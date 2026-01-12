export interface Job {
  id: string
  accountId: string
  customerId: string
  title: string
  description?: string
  jobType?: string
  status: string
  scheduledDate?: string
  estimatedLaborHours?: number
  actualLaborHours?: number
  location?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Invoice {
  id: string
  accountId: string
  jobId: string
  customerId: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  laborHours?: number
  hourlyRate?: number
  laborAmount: number
  materialCost: number
  subtotal: number
  taxRate: number
  taxAmount: number
  totalAmount: number
  paidAmount: number
  status: string
  createdAt: string
}

export interface Customer {
  id: string
  accountId: string
  firstName: string
  lastName: string
  email?: string
  phoneNumber?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  createdAt: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  createdAt: string
}

export interface Account {
  id: string
  ownerId: string
  businessName: string
  businessType: string
  subscriptionTier: string
  hourlyRate?: number
  taxRate: number
  createdAt: string
}
