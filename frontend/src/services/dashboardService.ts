import api from './api';

export interface DashboardStats {
  totalJobs: number;
  completedJobs: number;
  inProgressJobs: number;
  totalRevenue: number;
  pendingInvoices: number;
}

export interface DashboardJob {
  id: string;
  title: string;
  status: string;
  customerName: string;
  dueDate?: string;
  createdAt?: string;
}

export interface DashboardInvoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  totalAmount: number;
  paidAmount: number;
  amountDue: number;
  dueDate: string;
  status: string;
}

export const dashboardService = {
  // Get dashboard statistics
  async getStats() {
    const response = await api.get('/api/dashboard/stats');
    return response.data;
  },

  // Get recent jobs
  async getRecentJobs() {
    const response = await api.get('/api/dashboard/recent-jobs');
    return response.data;
  },

  // Get pending invoices
  async getPendingInvoices() {
    const response = await api.get('/api/dashboard/pending-invoices');
    return response.data;
  },
};
