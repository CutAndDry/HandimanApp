import { useState, useEffect } from 'react'
import { Image, Upload, Trash2, Filter, Camera } from 'lucide-react'

interface Photo {
  id: string
  jobId: string
  photoUrl: string
  photoType: string
  description: string
  createdAt: string
}

interface PhotoStats {
  totalPhotos: number
  photosByType: Array<{ type: string; count: number }>
  jobsWithPhotos: number
  photoTypeBreakdown: {
    before: number
    during: number
    after: number
    damage: number
    inspection: number
  }
}

export function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [stats, setStats] = useState<PhotoStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedJobId, setSelectedJobId] = useState<string>('')
  const [photoTypeFilter, setPhotoTypeFilter] = useState<string>('all')
  const [jobs, setJobs] = useState<Array<{ id: string; description: string }>>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    jobId: '',
    photoUrl: '',
    photoType: 'during',
    description: ''
  })

  const photoTypes = ['before', 'during', 'after', 'damage', 'inspection']
  const photoTypeEmojis: { [key: string]: string } = {
    'before': '📸',
    'during': '🔨',
    'after': '✅',
    'damage': '⚠️',
    'inspection': '🔍'
  }

  useEffect(() => {
    fetchStats()
    fetchJobs()
  }, [])

  useEffect(() => {
    if (selectedJobId) {
      fetchPhotos(selectedJobId)
    }
  }, [selectedJobId, photoTypeFilter])

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

  const fetchPhotos = async (jobId: string) => {
    try {
      setLoading(true)
      let url = `/api/job-photos/job/${jobId}`
      if (photoTypeFilter !== 'all') {
        url += `?photoType=${photoTypeFilter}`
      }
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setPhotos(data)
      }
    } catch (error) {
      console.error('Error fetching photos:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/job-photos/statistics/summary')
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
    if (!formData.jobId || !formData.photoUrl || !formData.photoType) {
      alert('Job, photo URL, and type are required')
      return
    }

    try {
      const response = await fetch('/api/job-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowForm(false)
        setFormData({
          jobId: '',
          photoUrl: '',
          photoType: 'during',
          description: ''
        })
        if (selectedJobId) {
          fetchPhotos(selectedJobId)
        }
        fetchStats()
      }
    } catch (error) {
      console.error('Error creating photo:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this photo?')) return

    try {
      const response = await fetch(`/api/job-photos/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setPhotos(photos.filter(p => p.id !== id))
        fetchStats()
      }
    } catch (error) {
      console.error('Error deleting photo:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
          <Camera className="w-10 h-10 text-purple-600" />
          Job Documentation
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Upload Photo'}
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <div className="text-gray-500 text-xs font-medium">Total Photos</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalPhotos}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="text-gray-500 text-xs font-medium">Before</div>
            <div className="text-2xl font-bold text-blue-600">{stats.photoTypeBreakdown.before}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <div className="text-gray-500 text-xs font-medium">During</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.photoTypeBreakdown.during}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="text-gray-500 text-xs font-medium">After</div>
            <div className="text-2xl font-bold text-green-600">{stats.photoTypeBreakdown.after}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
            <div className="text-gray-500 text-xs font-medium">Damage</div>
            <div className="text-2xl font-bold text-red-600">{stats.photoTypeBreakdown.damage}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
            <div className="text-gray-500 text-xs font-medium">Jobs</div>
            <div className="text-2xl font-bold text-gray-900">{stats.jobsWithPhotos}</div>
          </div>
        </div>
      )}

      {/* Upload Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Upload Photo</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job *</label>
                <select
                  value={formData.jobId}
                  onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="">Select a job...</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>{job.description}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo Type *</label>
                <select
                  value={formData.photoType}
                  onChange={(e) => setFormData({ ...formData, photoType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                >
                  {photoTypes.map(type => (
                    <option key={type} value={type}>
                      {photoTypeEmojis[type]} {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL *</label>
              <input
                type="url"
                value={formData.photoUrl}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                rows={3}
                placeholder="Add notes about this photo..."
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
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Upload Photo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Job Selection & Filter */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filter Photos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Job</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Choose a job...</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.description}</option>
              ))}
            </select>
          </div>
          {selectedJobId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo Type</label>
              <select
                value={photoTypeFilter}
                onChange={(e) => setPhotoTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Types</option>
                {photoTypes.map(type => (
                  <option key={type} value={type}>
                    {photoTypeEmojis[type]} {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Photos Grid */}
      {!selectedJobId ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Image className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Select a job to view photos</p>
        </div>
      ) : loading ? (
        <div className="text-center py-12 text-gray-500">Loading photos...</div>
      ) : photos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Image className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No photos for this job</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map(photo => (
            <div key={photo.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
              <div className="relative bg-gray-200 h-48 overflow-hidden group">
                <img
                  src={photo.photoUrl}
                  alt={photo.photoType}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 px-3 py-1 rounded text-white text-xs font-semibold">
                  {photoTypeEmojis[photo.photoType]} {photo.photoType.toUpperCase()}
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(photo.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700 text-sm mb-3">
                  {photo.description || 'No description'}
                </p>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="w-full py-2 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PhotosPage
