import { useState, useEffect } from 'react'
import { DollarSign, Plus, Trash2, Edit2, TrendingUp } from 'lucide-react'

interface PricingRule {
  id: string
  name: string
  category: string
  basePrice: number
  unit: string
  active: boolean
}

interface Estimate {
  id: string
  jobId: string
  serviceType: string
  description: string
  total: number
  status: string
}

interface PricingStats {
  totalRules: number
  activeRules: number
  estimatesThisMonth: number
  acceptanceRate: number
  averageEstimateValue: number
  highestQuote: number
  lowestQuote: number
}

export function DynamicPricingPage() {
  const [rules, setRules] = useState<PricingRule[]>([])
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [stats, setStats] = useState<PricingStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'rules' | 'estimates'>('rules')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    basePrice: 0,
    unit: 'hour',
    active: true
  })
  const [estimateForm, setEstimateForm] = useState({
    jobId: '',
    serviceType: '',
    description: '',
    estimatedHours: 0,
    materialsCost: 0
  })

  useEffect(() => {
    fetchRules()
    fetchEstimates()
    fetchStats()
  }, [])

  const fetchRules = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/pricing/rules')
      if (response.ok) {
        const data = await response.json()
        setRules(data)
      }
    } catch (error) {
      console.error('Error fetching rules:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEstimates = async () => {
    try {
      const response = await fetch('/api/pricing/estimates')
      if (response.ok) {
        const data = await response.json()
        setEstimates(data)
      }
    } catch (error) {
      console.error('Error fetching estimates:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/pricing/statistics')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSubmitRule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || formData.basePrice <= 0) {
      alert('Name and valid base price are required')
      return
    }

    try {
      const response = await fetch('/api/pricing/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowForm(false)
        setFormData({ name: '', category: '', basePrice: 0, unit: 'hour', active: true })
        fetchRules()
        fetchStats()
      }
    } catch (error) {
      console.error('Error creating rule:', error)
    }
  }

  const handleGenerateEstimate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!estimateForm.jobId || estimateForm.estimatedHours <= 0) {
      alert('Job ID and estimated hours are required')
      return
    }

    try {
      const response = await fetch('/api/pricing/estimates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estimateForm)
      })

      if (response.ok) {
        setEstimateForm({ jobId: '', serviceType: '', description: '', estimatedHours: 0, materialsCost: 0 })
        fetchEstimates()
        fetchStats()
      }
    } catch (error) {
      console.error('Error generating estimate:', error)
    }
  }

  const handleDeleteRule = async (id: string) => {
    if (!confirm('Delete this pricing rule?')) return

    try {
      const response = await fetch(`/api/pricing/rules/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setRules(rules.filter(r => r.id !== id))
        fetchStats()
      }
    } catch (error) {
      console.error('Error deleting rule:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
          <TrendingUp className="w-10 h-10 text-indigo-600" />
          Dynamic Pricing & Estimates
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Add Pricing Rule'}
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
            <div className="text-gray-500 text-sm font-medium">Total Rules</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{stats.totalRules}</div>
            <div className="text-xs text-gray-600 mt-1">{stats.activeRules} active</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="text-gray-500 text-sm font-medium">Estimates This Month</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{stats.estimatesThisMonth}</div>
            <div className="text-xs text-gray-600 mt-1">{stats.acceptanceRate}% acceptance</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="text-gray-500 text-sm font-medium">Avg Estimate</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">${stats.averageEstimateValue}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="text-gray-500 text-sm font-medium">Highest Quote</div>
            <div className="text-3xl font-bold text-purple-600 mt-2">${stats.highestQuote.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="text-gray-500 text-sm font-medium">Lowest Quote</div>
            <div className="text-3xl font-bold text-orange-600 mt-2">${stats.lowestQuote}</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-4 px-2 font-semibold border-b-2 transition ${
              activeTab === 'rules'
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Pricing Rules
          </button>
          <button
            onClick={() => setActiveTab('estimates')}
            className={`py-4 px-2 font-semibold border-b-2 transition ${
              activeTab === 'estimates'
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Estimates & Quotes
          </button>
        </div>
      </div>

      {/* Create Rule Form */}
      {showForm && activeTab === 'rules' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create Pricing Rule</h2>
          <form onSubmit={handleSubmitRule} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Residential plumbing rate"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., plumbing, electrical"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="hour">Hour</option>
                  <option value="day">Day</option>
                  <option value="service_call">Service Call</option>
                  <option value="multiplier">Multiplier</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded"
              />
              <label className="text-sm font-medium text-gray-700">Active</label>
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
                Create Rule
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Content */}
      {activeTab === 'rules' ? (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading pricing rules...</div>
          ) : rules.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No pricing rules configured yet</p>
            </div>
          ) : (
            rules.map(rule => (
              <div key={rule.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{rule.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">Category: {rule.category}</p>
                    <div className="mt-4 flex gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Base Price</p>
                        <p className="text-lg font-bold text-indigo-600">${rule.basePrice}/{rule.unit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full inline-block ${rule.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {rule.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition" title="Edit">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
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
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Generate Estimate</h2>
            <form onSubmit={handleGenerateEstimate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job ID *</label>
                  <input
                    type="text"
                    value={estimateForm.jobId}
                    onChange={(e) => setEstimateForm({ ...estimateForm, jobId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <input
                    type="text"
                    value={estimateForm.serviceType}
                    onChange={(e) => setEstimateForm({ ...estimateForm, serviceType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={estimateForm.description}
                  onChange={(e) => setEstimateForm({ ...estimateForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours *</label>
                  <input
                    type="number"
                    step="0.5"
                    value={estimateForm.estimatedHours}
                    onChange={(e) => setEstimateForm({ ...estimateForm, estimatedHours: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Materials Cost</label>
                  <input
                    type="number"
                    step="0.01"
                    value={estimateForm.materialsCost}
                    onChange={(e) => setEstimateForm({ ...estimateForm, materialsCost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Generate Estimate
                </button>
              </div>
            </form>
          </div>

          {/* Estimates List */}
          {estimates.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No estimates generated yet</p>
            </div>
          ) : (
            estimates.map(estimate => (
              <div key={estimate.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{estimate.description}</h3>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Service Type</p>
                        <p className="font-semibold text-gray-900">{estimate.serviceType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Job ID</p>
                        <p className="font-semibold text-gray-900">{estimate.jobId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="font-bold text-indigo-600">${estimate.total.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          estimate.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          estimate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {estimate.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default DynamicPricingPage
