import api from './api'
import { Job } from '@/types'

export type { Job }

export const jobService = {
  getJobs: async (status?: string, search?: string, limit: number = 50, offset: number = 0) => {
    const response = await api.get<Job[]>('/api/jobs', {
      params: { status, search, limit, offset },
    })
    return response.data
  },

  getJob: async (id: string) => {
    const response = await api.get<Job>(`/api/jobs/${id}`)
    return response.data
  },

  createJob: async (data: Partial<Job>) => {
    const response = await api.post<Job>('/api/jobs', data)
    return response.data
  },

  updateJob: async (id: string, data: Partial<Job>) => {
    const response = await api.put<Job>(`/api/jobs/${id}`, data)
    return response.data
  },

  deleteJob: async (id: string) => {
    await api.delete(`/api/jobs/${id}`)
  },
}
