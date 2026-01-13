import api from './api';

export interface Customer {
  id?: string;
  accountId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface UpdateCustomerRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export const customerService = {
  // Get all customers
  async getCustomers(search: string = '', limit: number = 100, offset: number = 0) {
    const response = await api.get('/api/customers', {
      params: { search, limit, offset },
    });
    return response.data;
  },

  // Get a single customer
  async getCustomer(id: string) {
    const response = await api.get(`/api/customers/${id}`);
    return response.data;
  },

  // Create a new customer
  async createCustomer(customer: CreateCustomerRequest) {
    const response = await api.post('/api/customers', customer);
    return response.data;
  },

  // Update a customer
  async updateCustomer(id: string, customer: UpdateCustomerRequest) {
    const response = await api.put(`/api/customers/${id}`, customer);
    return response.data;
  },

  // Delete a customer
  async deleteCustomer(id: string) {
    await api.delete(`/api/customers/${id}`);
  },
};
