import React, { useEffect, useState } from 'react'
import { Icons } from '../components/Icons'

interface Integration {
  id: string
  name: string
  category: string
  description: string
  connected: boolean
  connectedAt?: string
  status: string
}

interface IntegrationDetail extends Integration {
  apiKey?: string
  webhookUrl?: string
  lastSync?: string
  syncFrequency?: string
  features: Array<{ name: string; enabled: boolean }>
  settings?: object
  usage?: object
}

interface IntegrationStats {
  connectedIntegrations: number
  totalAvailable: number
  activeWebhooks: number
  totalApiCalls: number
  failureRate: number
  averageResponseTime: string
}

const IntegrationsPage: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [availableIntegrations, setAvailableIntegrations] = useState<any[]>([])
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationDetail | null>(null)
  const [stats, setStats] = useState<IntegrationStats | null>(null)
  const [showConnectForm, setShowConnectForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testLoading, setTestLoading] = useState(false)

  const [connectData, setConnectData] = useState({ apiKey: '', apiSecret: '' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const integrationsResponse = await fetch('/api/integrations')
        if (integrationsResponse.ok) {
          const data = await integrationsResponse.json()
          setIntegrations(data)
        }
        const availableResponse = await fetch('/api/integrations/available/list')
        if (availableResponse.ok) {
          const data = await availableResponse.json()
          setAvailableIntegrations(data)
        }
        const statsResponse = await fetch('/api/integrations/statistics')
        if (statsResponse.ok) {
          const data = await statsResponse.json()
          setStats(data)
        }
      } catch (err) {
        setError('Failed to fetch integrations')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSelectIntegration = async (integrationId: string) => {
    try {
      const response = await fetch(`/api/integrations/${integrationId}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedIntegration(data)
        setShowConnectForm(false)
      }
    } catch (err) {
      setError('Failed to fetch integration details')
    }
  }

  const handleConnectIntegration = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedIntegration) return
    try {
      const response = await fetch(`/api/integrations/${selectedIntegration.id}/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(connectData)
      })
      if (response.ok) {
        setConnectData({ apiKey: '', apiSecret: '' })
        setShowConnectForm(false)
        const res = await fetch(`/api/integrations/${selectedIntegration.id}`)
        if (res.ok) setSelectedIntegration(await res.json())
        // Refresh integrations list
        const listRes = await fetch('/api/integrations')
        if (listRes.ok) setIntegrations(await listRes.json())
      }
    } catch (err) {
      setError('Failed to connect integration')
    }
  }

  const handleDisconnect = async () => {
    if (!selectedIntegration || !window.confirm(`Disconnect ${selectedIntegration.name}?`)) return
    try {
      const response = await fetch(`/api/integrations/${selectedIntegration.id}/disconnect`, {
        method: 'POST'
      })
      if (response.ok) {
        setSelectedIntegration(null)
        const res = await fetch('/api/integrations')
        if (res.ok) setIntegrations(await res.json())
      }
    } catch (err) {
      setError('Failed to disconnect integration')
    }
  }

  const handleTestIntegration = async () => {
    if (!selectedIntegration) return
    try {
      setTestLoading(true)
      const response = await fetch(`/api/integrations/${selectedIntegration.id}/test`, {
        method: 'POST'
      })
      if (response.ok) {
        const result = await response.json()
        alert(`✓ Test successful! Response time: ${result.responseTime}`)
      }
    } catch (err) {
      setError('Failed to test integration')
    } finally {
      setTestLoading(false)
    }
  }

  const handleAddIntegration = (integrationId: string) => {
    const available = availableIntegrations.find((i) => i.id === integrationId)
    if (available) {
      setSelectedIntegration({
        id: available.id,
        name: available.name,
        category: available.category,
        description: available.description,
        connected: false,
        status: 'available',
        features: []
      })
      setShowConnectForm(true)
    }
  }

  if (loading) return <div className="p-8">Loading integrations...</div>

  return (
    <div className="p-8 bg-white">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Icons.Plug className="w-8 h-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-gray-600 text-sm">Connected</div>
            <div className="text-2xl font-bold text-green-600">
              {stats.connectedIntegrations}/{stats.totalAvailable}
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-gray-600 text-sm">Active Webhooks</div>
            <div className="text-2xl font-bold text-blue-600">{stats.activeWebhooks}</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-gray-600 text-sm">API Calls</div>
            <div className="text-2xl font-bold text-purple-600">{(stats.totalApiCalls / 1000).toFixed(1)}K</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-gray-600 text-sm">Failure Rate</div>
            <div className="text-2xl font-bold text-orange-600">{stats.failureRate.toFixed(2)}%</div>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <div className="text-gray-600 text-sm">Response Time</div>
            <div className="text-2xl font-bold text-amber-600">{stats.averageResponseTime}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-8">
        {/* Integrations List */}
        <div className="col-span-1">
          <h2 className="text-lg font-bold mb-4">Connected Services</h2>
          <div className="space-y-2 mb-6">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                onClick={() => handleSelectIntegration(integration.id)}
                className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedIntegration?.id === integration.id ? 'bg-orange-100 border-orange-500' : 'border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900">{integration.name}</div>
                <div className={`text-xs font-bold ${integration.connected ? 'text-green-600' : 'text-red-600'}`}>
                  {integration.connected ? '● Connected' : '● Disconnected'}
                </div>
                <div className="text-xs text-gray-600">{integration.category}</div>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-bold mb-4">Available Services</h2>
          <div className="space-y-2">
            {availableIntegrations
              .filter((avail) => !integrations.find((i) => i.id === avail.id && i.connected))
              .slice(0, 5)
              .map((available) => (
                <div key={available.id} className="p-3 border border-gray-300 rounded-lg">
                  <div className="font-semibold text-gray-900">{available.icon} {available.name}</div>
                  <div className="text-xs text-gray-600 mb-2">{available.category}</div>
                  <button
                    onClick={() => handleAddIntegration(available.id)}
                    className="w-full px-2 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
                  >
                    Connect
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Integration Details */}
        {selectedIntegration && (
          <div className="col-span-3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedIntegration.name}</h2>
              {selectedIntegration.connected && (
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Disconnect
                </button>
              )}
            </div>

            {/* Connection Status */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Category</div>
                  <div className="font-semibold text-gray-900">{selectedIntegration.category}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Status</div>
                  <div className={`font-semibold ${selectedIntegration.connected ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedIntegration.connected ? 'Connected' : 'Not Connected'}
                  </div>
                </div>
                {selectedIntegration.lastSync && (
                  <div>
                    <div className="text-sm text-gray-600">Last Sync</div>
                    <div className="font-semibold text-gray-900">{new Date(selectedIntegration.lastSync).toLocaleString()}</div>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-600">Description</div>
                <div className="text-gray-900">{selectedIntegration.description}</div>
              </div>
            </div>

            {/* Connect Form */}
            {!selectedIntegration.connected && showConnectForm && (
              <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="font-bold mb-4 text-gray-900">Connect {selectedIntegration.name}</h3>
                <form onSubmit={handleConnectIntegration} className="space-y-3">
                  <input
                    type="password"
                    placeholder="API Key"
                    value={connectData.apiKey}
                    onChange={(e) => setConnectData({ ...connectData, apiKey: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                  <input
                    type="password"
                    placeholder="API Secret (optional)"
                    value={connectData.apiSecret}
                    onChange={(e) => setConnectData({ ...connectData, apiSecret: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
                      Connect
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowConnectForm(false)}
                      className="flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Webhook URL */}
            {selectedIntegration.connected && selectedIntegration.webhookUrl && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-bold mb-2 text-gray-900">Webhook URL</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedIntegration.webhookUrl}
                    className="flex-1 p-2 border border-gray-300 rounded bg-gray-100"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedIntegration.webhookUrl || '')
                      alert('Webhook URL copied!')
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            {/* Test Connection */}
            {selectedIntegration.connected && (
              <div className="mb-6">
                <button
                  onClick={handleTestIntegration}
                  disabled={testLoading}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {testLoading ? 'Testing...' : '✓ Test Connection'}
                </button>
              </div>
            )}

            {/* Features */}
            {selectedIntegration.features && selectedIntegration.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedIntegration.features.map((feature, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${feature.enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center gap-2">
                        <span className={feature.enabled ? 'text-green-600 text-lg' : 'text-gray-400 text-lg'}>
                          {feature.enabled ? '✓' : '○'}
                        </span>
                        <span className="font-semibold text-gray-900">{feature.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* API Key Display */}
            {selectedIntegration.connected && selectedIntegration.apiKey && (
              <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
                <h3 className="font-bold mb-2 text-gray-900">API Key</h3>
                <div className="text-sm text-gray-700 font-mono break-all">{selectedIntegration.apiKey}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default IntegrationsPage
