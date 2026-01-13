import api from './api';

export interface Account {
  id?: string;
  userId?: string;
  businessName: string;
  businessType: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SetupAccountRequest {
  businessName: string;
  businessType: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface UpdateAccountRequest {
  businessName?: string;
  businessType?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export const accountService = {
  // Get current account
  async getCurrentAccount() {
    const response = await api.get('/api/accounts/me');
    return response.data;
  },

  // Setup account
  async setupAccount(account: SetupAccountRequest) {
    const response = await api.post('/api/accounts/setup', account);
    return response.data;
  },

  // Update account
  async updateAccount(id: string, account: UpdateAccountRequest) {
    const response = await api.put(`/api/accounts/${id}`, account);
    return response.data;
  },

  // Get account details
  async getAccount(id: string) {
    const response = await api.get(`/api/accounts/${id}`);
    return response.data;
  },

  // Get account team
  async getAccountTeam(id: string) {
    const response = await api.get(`/api/accounts/${id}/team`);
    return response.data;
  },

  // Add team member
  async addTeamMember(accountId: string, member: any) {
    const response = await api.post(`/api/accounts/${accountId}/team`, member);
    return response.data;
  },
};
