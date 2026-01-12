import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobService } from '@/services/jobService'
import { Job } from '@/types'
import '../styles/dashboard.css'

const DashboardPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const data = await jobService.getJobs()
      setJobs(data || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { icon: '🔧', title: 'Total Jobs', value: jobs.length, change: '+12%' },
    { icon: '💰', title: 'Revenue', value: '$12,450', change: '+8%' },
    { icon: '👥', title: 'Customers', value: '24', change: '+3%' },
    { icon: '⏱️', title: 'Hours', value: '156', change: '-2%' },
  ]

  const completedJobs = jobs.filter((j) => j.status === 'completed').length
  const inProgressJobs = jobs.filter((j) => j.status === 'in_progress').length

  return (
    <div className="dashboard">
      {/* Stats */}
      <div className="dashboard-container">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-card-icon">{stat.icon}</div>
            <div className="stat-card-title">{stat.title}</div>
            <div className="stat-card-value">{stat.value}</div>
            <div className={`stat-card-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
              {stat.change} from last month
            </div>
          </div>
        ))}
      </div>

      {/* Recent Jobs */}
      <div className="dashboard-section">
        <div className="section-title">
          <h2 style={{ margin: 0 }}>Recent Jobs</h2>
          <Link to="/jobs">View All</Link>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="spinner"></div>
            <p>Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p className="empty-state-text">No jobs yet. Create your first job to get started!</p>
            <Link to="/jobs" className="btn btn-primary">
              Create Job
            </Link>
          </div>
        ) : (
          <div className="recent-jobs-list">
            {jobs.slice(0, 5).map((job) => (
              <div key={job.id} className="job-item">
                <div className="job-info">
                  <div className="job-name">{job.title}</div>
                  <div className="job-customer">{job.customer?.name || 'Unknown Customer'}</div>
                </div>
                <div className="job-meta">
                  <span
                    className={`job-status ${
                      job.status === 'in_progress'
                        ? 'in-progress'
                        : job.status === 'completed'
                          ? 'completed'
                          : 'pending'
                    }`}
                  >
                    {job.status}
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    ${job.estimatedAmount || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-lg)' }}>
        <div className="dashboard-section">
          <h3>In Progress</h3>
          <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--primary)' }}>{inProgressJobs}</div>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>Jobs being worked on</p>
        </div>
        <div className="dashboard-section">
          <h3>Completed</h3>
          <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--success)' }}>{completedJobs}</div>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>Finished jobs this month</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
        <div>
          <p>Total Jobs: {jobs.length}</p>
          {jobs.length === 0 ? (
            <p>No jobs yet. Create your first job to get started.</p>
          ) : (
            <ul>
              {jobs.map((job) => (
                <li key={job.id}>{job.title}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default DashboardPage
