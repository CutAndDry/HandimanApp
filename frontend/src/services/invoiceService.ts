import api from './api';

export interface Invoice {
  id?: string;
  accountId?: string;
  jobId?: string;
  customerId: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  dueDate: string;
  laborHours?: number;
  hourlyRate?: number;
  laborAmount?: number;
  materialCost?: number;
  subtotal?: number;
  taxRate?: number;
  taxAmount?: number;
  totalAmount?: number;
  paidAmount?: number;
  status?: 'draft' | 'sent' | 'viewed' | 'accepted' | 'paid' | 'overdue';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInvoiceRequest {
  jobId: string;
  customerId: string;
  dueDate: string;
  laborHours?: number;
  hourlyRate?: number;
  materialCost?: number;
  taxRate?: number;
  notes?: string;
}

export interface UpdateInvoiceRequest {
  status?: string;
  laborHours?: number;
  materialCost?: number;
}

export interface RecordPaymentRequest {
  amount: number;
  notes?: string;
}

export const invoiceService = {
  // Get all invoices
  async getInvoices(status?: string, search?: string, limit: number = 50, offset: number = 0) {
    const response = await api.get('/api/invoices', {
      params: { status, search, limit, offset },
    });
    return response.data;
  },

  // Get a single invoice
  async getInvoice(id: string) {
    const response = await api.get(`/api/invoices/${id}`);
    return response.data;
  },

  // Create a new invoice
  async createInvoice(invoice: CreateInvoiceRequest) {
    const response = await api.post('/api/invoices', invoice);
    return response.data;
  },

  // Update an invoice
  async updateInvoice(id: string, invoice: UpdateInvoiceRequest) {
    const response = await api.put(`/api/invoices/${id}`, invoice);
    return response.data;
  },

  // Delete an invoice
  async deleteInvoice(id: string) {
    await api.delete(`/api/invoices/${id}`);
  },

  // Record a payment
  async recordPayment(id: string, payment: RecordPaymentRequest) {
    const response = await api.post(`/api/invoices/${id}/payment`, payment);
    return response.data;
  },

  // Send an invoice
  async sendInvoice(id: string) {
    const response = await api.post(`/api/invoices/${id}/send`, {});
    return response.data;
  },
};
