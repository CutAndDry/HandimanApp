import api from './api';

export interface TeamMember {
  id?: string;
  accountId?: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'technician' | 'viewer';
  phoneNumber?: string;
  hireDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTeamMemberRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber?: string;
  hireDate?: string;
}

export interface UpdateTeamMemberRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  phoneNumber?: string;
  hireDate?: string;
}

export const teamService = {
  // Get all team members
  async getTeamMembers() {
    const response = await api.get('/api/team/members');
    return response.data;
  },

  // Get a single team member
  async getTeamMember(id: string) {
    const response = await api.get(`/api/team/members/${id}`);
    return response.data;
  },

  // Create a team member
  async createTeamMember(member: CreateTeamMemberRequest) {
    const response = await api.post('/api/team/members', member);
    return response.data;
  },

  // Update a team member
  async updateTeamMember(id: string, member: UpdateTeamMemberRequest) {
    const response = await api.put(`/api/team/members/${id}`, member);
    return response.data;
  },

  // Delete a team member
  async deleteTeamMember(id: string) {
    await api.delete(`/api/team/members/${id}`);
  },
};
