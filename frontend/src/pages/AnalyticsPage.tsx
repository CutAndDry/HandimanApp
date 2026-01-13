import { useState, useEffect } from 'react'
import { BarChart3, Download, Filter } from 'lucide-react'

interface DashboardMetrics {
  totalRevenue: number
  totalJobs: number
  completedJobs: number
  completionRate: number
  averageJobValue: number
  customerSatisfaction: number
}

interface RevenueData {
  period: string
  totalRevenue: number
  breakdown: {
    byService: Array<{ service: string; revenue: number; jobCount: number }>
    byCustomerType: Array<{ type: string; revenue: number; jobCount: number }>
  }
  trends: Array<{ month: string; revenue: number; jobCount: number }>
}

interface TechnicianPerformance {
  name: string
  jobsCompleted: number
  totalRevenue: number
  customerSatisfaction: number
  specialization: string
}

interface Report {
  id: string
  name: string
  description: string
  frequency: string
}

export function AnalyticsPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null)
  const [technicians, setTechnicians] = useState<TechnicianPerformance[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('month')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'revenue' | 'technicians' | 'reports'>('dashboard')

  useEffect(() => {
    fetchMetrics()
    fetchRevenueData()
    fetchTechnicianPerformance()
    fetchReports()
  }, [period])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics/dashboard?period=${period}`)
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
      }
    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRevenueData = async () => {
    try {
      const response = await fetch(`/api/analytics/revenue?period=${period}`)
      if (response.ok) {
        const data = await response.json()
        setRevenueData(data)
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error)
    }
  }

  const fetchTechnicianPerformance = async () => {
    try {
      const response = await fetch(`/api/analytics/technician-performance?period=${period}`)
      if (response.ok) {
        const data = await response.json()
        setTechnicians(data)
      }
    } catch (error) {
      console.error('Error fetching technician data:', error)
    }
  }

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/analytics/reports')
      if (response.ok) {
        const data = await response.json()
        setReports(data)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    }
  }

  const handleGenerateReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/analytics/reports/${reportId}/generate`, {
        method: 'POST'
      })

      if (response.ok) {
        alert('Report generated successfully')
      }
    } catch (error) {
      console.error('Error generating report:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart3 className="w-10 h-10 text-indigo-600" />
          Business Analytics
        </h1>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {(['dashboard', 'revenue', 'technicians', 'reports'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 font-semibold border-b-2 transition ${
                activeTab === tab
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading analytics...</div>
          ) : metrics ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
                  <div className="text-gray-500 text-sm font-medium">Total Revenue</div>
                  <div className="text-3xl font-bold text-indigo-600 mt-2">${metrics.totalRevenue.toLocaleString()}</div>
                  <div className="text-xs text-gray-600 mt-2">+12% from last period</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                  <div className="text-gray-500 text-sm font-medium">Completion Rate</div>
                  <div className="text-3xl font-bold text-green-600 mt-2">{metrics.completionRate}%</div>
                  <div className="text-xs text-gray-600 mt-2">{metrics.completedJobs} of {metrics.totalJobs} jobs</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                  <div className="text-gray-500 text-sm font-medium">Customer Satisfaction</div>
                  <div className="text-3xl font-bold text-blue-600 mt-2">{metrics.customerSatisfaction}/5</div>
                  <div className="text-xs text-gray-600 mt-2">Based on recent reviews</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Key Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Total Jobs</span>
                      <span className="font-bold text-gray-900">{metrics.totalJobs}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Completed Jobs</span>
                      <span className="font-bold text-gray-900">{metrics.completedJobs}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Job Value</span>
                      <span className="font-bold text-indigo-600">${metrics.averageJobValue}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Success Rate</span>
                      <span className="font-bold text-green-600">92.9%</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Repeat Customers</span>
                      <span className="font-bold text-gray-900">68.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Outstanding Payments</span>
                      <span className="font-bold text-orange-600">$3,500</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && revenueData && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">By Service Type</h3>
                <div className="space-y-3">
                  {revenueData.breakdown.byService.map((item) => (
                    <div key={item.service} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{item.service}</p>
                        <p className="text-xs text-gray-600">{item.jobCount} jobs</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-indigo-600">${item.revenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">{((item.revenue / revenueData.totalRevenue) * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">By Customer Type</h3>
                <div className="space-y-3">
                  {revenueData.breakdown.byCustomerType.map((item) => (
                    <div key={item.type} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{item.type}</p>
                        <p className="text-xs text-gray-600">{item.jobCount} jobs</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">${item.revenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">{((item.revenue / revenueData.totalRevenue) * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend</h2>
            <div className="space-y-3">
              {revenueData.trends.map((item) => (
                <div key={item.month} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{item.month}</p>
                    <p className="text-xs text-gray-600">{item.jobCount} jobs</p>
                  </div>
                  <p className="font-bold text-green-600">${item.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Technicians Tab */}
      {activeTab === 'technicians' && (
        <div className="space-y-4">
          {technicians.map((tech) => (
            <div key={tech.name} className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{tech.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Specialization: {tech.specialization}</p>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Jobs Completed</p>
                      <p className="text-lg font-bold text-gray-900">{tech.jobsCompleted}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Revenue</p>
                      <p className="text-lg font-bold text-indigo-600">${tech.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Satisfaction</p>
                      <p className="text-lg font-bold text-yellow-600">{tech.customerSatisfaction}/5</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Avg Job Value</p>
                      <p className="text-lg font-bold text-blue-600">${(tech.totalRevenue / tech.jobsCompleted).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{report.name}</h3>
                  <p className="text-gray-600 mt-1">{report.description}</p>
                  <div className="mt-3 flex gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      {report.frequency}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleGenerateReport(report.id)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition flex items-center gap-2"
                  title="Generate report"
                >
                  <Download className="w-5 h-5" />
                  <span className="text-sm">Generate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AnalyticsPage
