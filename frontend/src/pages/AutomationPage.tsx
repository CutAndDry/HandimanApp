import { useState, useEffect } from 'react'
import { Zap, Play, Trash2, Plus } from 'lucide-react'

interface Workflow {
  id: string
  name: string
  description: string
  type: string
  enabled: boolean
  lastRun: Date
  runCount: number
}

interface WorkflowStats {
  totalWorkflows: number
  activeWorkflows: number
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  successRate: number
  timesSaved: number
  automatedJobsCount: number
}

export function AutomationPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [stats, setStats] = useState<WorkflowStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'assignment',
    enabled: true
  })

  useEffect(() => {
    fetchWorkflows()
    fetchStats()
  }, [])

  const fetchWorkflows = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/automation/workflows')
      if (response.ok) {
        const data = await response.json()
        setWorkflows(data)
      }
    } catch (error) {
      console.error('Error fetching workflows:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/automation/statistics')
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
    if (!formData.name) {
      alert('Workflow name is required')
      return
    }

    try {
      const response = await fetch('/api/automation/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowForm(false)
        setFormData({ name: '', description: '', type: 'assignment', enabled: true })
        fetchWorkflows()
        fetchStats()
      }
    } catch (error) {
      console.error('Error creating workflow:', error)
    }
  }

  const handleRunWorkflow = async (id: string) => {
    try {
      const response = await fetch(`/api/automation/workflows/${id}/run`, {
        method: 'POST'
      })

      if (response.ok) {
        fetchWorkflows()
        fetchStats()
      }
    } catch (error) {
      console.error('Error running workflow:', error)
    }
  }

  const handleDeleteWorkflow = async (id: string) => {
    if (!confirm('Delete this workflow?')) return

    try {
      const response = await fetch(`/api/automation/workflows/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setWorkflows(workflows.filter(w => w.id !== id))
        fetchStats()
      }
    } catch (error) {
      console.error('Error deleting workflow:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
          <Zap className="w-10 h-10 text-indigo-600" />
          Workflow Automation
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Create Workflow'}
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
            <div className="text-gray-500 text-sm font-medium">Active Workflows</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{stats.activeWorkflows}</div>
            <div className="text-xs text-gray-600 mt-1">of {stats.totalWorkflows} total</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="text-gray-500 text-sm font-medium">Success Rate</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{stats.successRate}%</div>
            <div className="text-xs text-gray-600 mt-1">{stats.successfulExecutions} of {stats.totalExecutions}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="text-gray-500 text-sm font-medium">Automated Jobs</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">{stats.automatedJobsCount}</div>
            <div className="text-xs text-gray-600 mt-1">Total this period</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="text-gray-500 text-sm font-medium">Time Saved</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">{stats.timesSaved}h</div>
            <div className="text-xs text-gray-600 mt-1">Manual work avoided</div>
          </div>
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Workflow</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Workflow Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Auto-assign jobs"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="assignment">Job Assignment</option>
                  <option value="invoice">Invoice Generation</option>
                  <option value="notification">Notification</option>
                  <option value="payment">Payment Processing</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                placeholder="Describe what this workflow does..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="rounded"
              />
              <label className="text-sm font-medium text-gray-700">Enable workflow immediately</label>
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
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Create Workflow
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Workflows List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading workflows...</div>
        ) : workflows.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No workflows created yet</p>
          </div>
        ) : (
          workflows.map(workflow => (
            <div key={workflow.id} className={`bg-white rounded-lg shadow p-6 border-l-4 ${workflow.enabled ? 'border-indigo-500' : 'border-gray-300'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{workflow.name}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${workflow.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {workflow.enabled ? 'Active' : 'Inactive'}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      {workflow.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{workflow.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-sm">
                      <p className="text-gray-500">Last Run</p>
                      <p className="font-semibold text-gray-900">{new Date(workflow.lastRun).toLocaleDateString()}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-500">Total Runs</p>
                      <p className="font-semibold text-gray-900">{workflow.runCount}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-500">Avg Duration</p>
                      <p className="font-semibold text-gray-900">~2.3s</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleRunWorkflow(workflow.id)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                    title="Run workflow"
                  >
                    <Play className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteWorkflow(workflow.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AutomationPage
