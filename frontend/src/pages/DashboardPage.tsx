import React, { useState, useEffect } from 'react'
import { jobService } from '@/services/jobService'
import { Job } from '@/types'

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
      setJobs(data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
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
