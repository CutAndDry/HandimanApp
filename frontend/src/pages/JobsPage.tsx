import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobService, Job } from '@/services/jobService'

const JobsPage: React.FC = () => {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [formData, setFormData] = useState({
    customerId: '',
    title: '',
    description: '',
    status: 'pending',
    estimatedLaborHours: '',
    location: ''
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await jobService.getJobs()
      setJobs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await jobService.createJob({
        customerId: formData.customerId,
        title: formData.title,
        description: formData.description,
        estimatedLaborHours: formData.estimatedLaborHours ? Number(formData.estimatedLaborHours) : undefined,
        location: formData.location
      })
      setShowForm(false)
      setFormData({
        customerId: '',
        title: '',
        description: '',
        status: 'pending',
        estimatedLaborHours: '',
        location: ''
      })
      fetchJobs()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job')
    }
  }

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      await jobService.updateJobStatus(jobId, newStatus)
      fetchJobs()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job')
    }
  }

  const generateCSV = (jobsData: Job[]) => {
    const headers = ['ID', 'Title', 'Description', 'Location', 'Status', 'Labor Hours']
    const rows = jobsData.map(job => [
      job.id,
      job.title,
      job.description || '',
      job.location || '',
      job.status,
      job.laborHours || ''
    ])
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    return csvContent
  }

  const downloadCSV = (content: string, filename: string) => {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', filename)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const filteredJobs = filterStatus ? jobs.filter(job => job.status === filterStatus) : jobs

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600 mt-1">Manage and track all your jobs</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          {showForm ? 'Cancel' : '+ New Job'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters & Export */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
        <div className="flex-1">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <button
            onClick={() => {
              const csv = generateCSV(jobs)
              downloadCSV(csv, `jobs_${new Date().toISOString().split('T')[0]}.csv`)
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm sm:text-base"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Job</h2>
          <form onSubmit={handleCreateJob} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                <input
                  type="text"
                  placeholder="Enter customer ID"
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  placeholder="Enter job title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                placeholder="Enter job description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Labor Hours</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="Enter hours"
                  value={formData.estimatedLaborHours}
                  onChange={(e) => setFormData({ ...formData, estimatedLaborHours: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Create Job
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Jobs List */}
      <div className="space-y-3">
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-600 mb-4">No jobs found. Create one to get started!</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Create First Job
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => navigate(`/jobs/${job.id}`)}
              className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-lg cursor-pointer transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-blue-600 hover:underline truncate">{job.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{job.description}</p>
                  <div className="flex flex-col sm:flex-row sm:gap-4 mt-3 text-xs sm:text-sm text-gray-500">
                    <span>📍 {job.location || 'No location'}</span>
                    {job.laborHours && <span>⏱️ {job.laborHours.toFixed(1)} hours</span>}
                  </div>
                </div>
                <select
                  value={job.status}
                  onChange={(e) => {
                    e.stopPropagation()
                    handleStatusChange(job.id!, e.target.value)
                  }}
                  className={`px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-white whitespace-nowrap transition ${
                    job.status === 'completed'
                      ? 'bg-green-600 hover:bg-green-700'
                      : job.status === 'in_progress'
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-yellow-600 hover:bg-yellow-700'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default JobsPage
