import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboardService } from '@/services/dashboardService'
import { Icons } from '@/components/Icons'
import '../styles/dashboard.css'

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    inProgressJobs: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
  })
  const [recentJobs, setRecentJobs] = useState([])
  const [pendingInvoices, setPendingInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [statsData, jobsData, invoicesData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentJobs(),
        dashboardService.getPendingInvoices(),
      ])
      setStats(statsData)
      setRecentJobs(jobsData)
      setPendingInvoices(invoicesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { Icon: Icons.Wrench, title: 'Total Jobs', value: stats.totalJobs, change: '+12%' },
    { Icon: Icons.DollarSign, title: 'Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, change: '+8%' },
    { Icon: Icons.FileText, title: 'Pending Invoices', value: stats.pendingInvoices, change: '+3%' },
    { Icon: Icons.Clock, title: 'In Progress', value: stats.inProgressJobs, change: '-2%' },
  ]

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow hover:shadow-md transition-all duration-200 p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700">
                <stat.Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${stat.change.startsWith('+') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Jobs Section */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Recent Jobs</h2>
          <Link to="/jobs" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm transition">
            View All
            <Icons.ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        ) : recentJobs.length === 0 ? (
          <div className="text-center py-12">
            <Icons.Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No jobs yet. Create your first job to get started!</p>
            <Link 
              to="/jobs" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
            >
              Create Job
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentJobs.map((job: any) => (
              <Link 
                key={job.id}
                to={`/jobs/${job.id}`}
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded transition"
              >
                <div>
                  <p className="font-semibold text-gray-900">{job.title}</p>
                  <p className="text-sm text-gray-600">{job.customerName || 'Unknown Customer'}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                  job.status === 'in_progress' ? 'bg-blue-50 text-blue-700' :
                  job.status === 'completed' ? 'bg-green-50 text-green-700' :
                  'bg-yellow-50 text-yellow-700'
                }`}>
                  {job.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pending Invoices Section */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Pending Invoices</h2>
          <Link to="/invoices" className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base inline-flex items-center">
            View All
            <Icons.ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {pendingInvoices.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No pending invoices</p>
        ) : (
          <div className="space-y-3">
            {pendingInvoices.map((invoice: any) => (
              <Link
                key={invoice.id}
                to="/invoices"
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 hover:bg-yellow-100 rounded transition"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{invoice.invoiceNumber}</p>
                  <p className="text-sm text-gray-600 truncate">{invoice.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900">${invoice.amountDue.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Completed</h3>
          <p className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">{stats.completedJobs}</p>
          <p className="text-gray-600 text-sm">Finished jobs this month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">In Progress</h3>
          <p className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">{stats.inProgressJobs}</p>
          <p className="text-gray-600 text-sm">Jobs being worked on</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
