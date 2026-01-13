import axios, { AxiosInstance } from 'axios'

// In development, use relative paths to leverage Vite's proxy
// In production, use the configured API base URL or default to localhost:5000
const API_BASE_URL = import.meta.env.PROD 
  ? ((import.meta.env as any).REACT_APP_API_BASE_URL || 'http://localhost:5000')
  : ''

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
