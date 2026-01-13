import { useState, useEffect } from 'react'
import { Clock, Play, Trash2 } from 'lucide-react'

interface TimeEntry {
  id: string
  jobId: string
  startTime: string
  endTime?: string
  durationMinutes: number
  hoursWorked: number
  description: string
  isBillable: boolean
}

interface TimeStats {
  totalEntries: number
  totalMinutes: number
  totalHours: number
  billableHours: number
  nonBillableHours: number
  billablePercentage: number
  averageHoursPerEntry: number
  jobsWorkedOn: number
  hourlyRate: number
  estimatedEarnings: number
}

export function TimeEntriesPage() {
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [stats, setStats] = useState<TimeStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [jobs, setJobs] = useState<Array<{ id: string; description: string }>>([])
  const [formData, setFormData] = useState({
    jobId: '',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: '',
    description: '',
    isBillable: true
  })

  useEffect(() => {
    fetchEntries()
    fetchStats()
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data.slice(0, 10))
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  const fetchEntries = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/time-entries')
      if (response.ok) {
        const data = await response.json()
        setEntries(data)
      }
    } catch (error) {
      console.error('Error fetching entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/time-entries/statistics/summary')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.jobId || !formData.startTime) {
      alert('Job and start time are required')
      return
    }

    try {
      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: formData.jobId,
          startTime: formData.startTime,
          endTime: formData.endTime || undefined,
          description: formData.description,
          isBillable: formData.isBillable
        })
      })

      if (response.ok) {
        setShowForm(false)
        setFormData({
          jobId: '',
          startTime: new Date().toISOString().slice(0, 16),
          endTime: '',
          description: '',
          isBillable: true
        })
        fetchEntries()
        fetchStats()
      }
    } catch (error) {
      console.error('Error creating entry:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this time entry?')) return

    try {
      const response = await fetch(`/api/time-entries/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setEntries(entries.filter(e => e.id !== id))
        fetchStats()
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
          <Clock className="w-10 h-10 text-blue-600" />
          Time Tracking
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Log Time'}
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="text-gray-500 text-xs font-medium">Total Hours</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalHours}</div>
            <div className="text-xs text-gray-500 mt-1">{stats.totalEntries} entries</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="text-gray-500 text-xs font-medium">Billable</div>
            <div className="text-2xl font-bold text-green-600">{stats.billableHours}h</div>
            <div className="text-xs text-gray-500 mt-1">{stats.billablePercentage}%</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
            <div className="text-gray-500 text-xs font-medium">Non-Billable</div>
            <div className="text-2xl font-bold text-orange-600">{stats.nonBillableHours}h</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <div className="text-gray-500 text-xs font-medium">Earnings</div>
            <div className="text-2xl font-bold text-purple-600">${stats.estimatedEarnings}</div>
            <div className="text-xs text-gray-500 mt-1">@ ${stats.hourlyRate}/hr</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500">
            <div className="text-gray-500 text-xs font-medium">Avg/Entry</div>
            <div className="text-2xl font-bold text-gray-900">{stats.averageHoursPerEntry}h</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-pink-500">
            <div className="text-gray-500 text-xs font-medium">Jobs</div>
            <div className="text-2xl font-bold text-gray-900">{stats.jobsWorkedOn}</div>
          </div>
        </div>
      )}

      {/* Time Entry Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Log Time Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job *</label>
                <select
                  value={formData.jobId}
                  onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a job...</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>{job.description}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Billable</label>
                <select
                  value={formData.isBillable ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, isBillable: e.target.value === 'true' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="What did you work on?"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Log Entry
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Time Entries List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading time entries...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No time entries yet</p>
          </div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      entry.isBillable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {entry.isBillable ? '✓ Billable' : 'Non-Billable'}
                    </span>
                    <span className="text-sm font-semibold text-blue-600">
                      {entry.hoursWorked.toFixed(2)}h
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium">{entry.description || 'No description'}</p>
                  <div className="text-sm text-gray-500 mt-2 space-y-1">
                    <p>Job: {entry.jobId}</p>
                    <p>
                      {new Date(entry.startTime).toLocaleString()} 
                      {entry.endTime && ` - ${new Date(entry.endTime).toLocaleTimeString()}`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TimeEntriesPage
