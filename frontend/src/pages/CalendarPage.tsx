import React, { useEffect, useState } from 'react';
import { jobService } from '@/services/jobService';
import type { Job } from '@/types';

const CalendarPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobService.getJobs();
      setJobs(data);
      setError(null);
    } catch (err) {
      setError('Failed to load jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getJobsForDate = (day: number): Job[] => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString()
      .split('T')[0];
    return jobs.filter(job => {
      if (job.scheduledDate) {
        const jobDate = new Date(job.scheduledDate).toISOString().split('T')[0];
        if (selectedStatus && job.status !== selectedStatus) return false;
        return jobDate === dateStr;
      }
      return false;
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const statusColors: { [key: string]: string } = {
    lead: 'bg-gray-200 text-gray-800',
    pending: 'bg-yellow-200 text-yellow-800',
    in_progress: 'bg-blue-200 text-blue-800',
    completed: 'bg-green-200 text-green-800',
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const uniqueStatuses = Array.from(new Set(jobs.map(j => j.status)));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Calendar</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">View your scheduled jobs by date</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-3 sm:p-6">
        {/* Navigation */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={previousMonth}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-3 sm:px-4 rounded-lg transition text-sm"
              >
                ← Previous
              </button>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 flex-1 text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={nextMonth}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-3 sm:px-4 rounded-lg transition text-sm"
              >
                Next →
              </button>
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-auto">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Filter by Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">All Statuses</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-4 sm:mb-6 overflow-x-auto">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-bold text-xs sm:text-sm text-gray-700 py-1 sm:py-2 bg-gray-50 rounded-t">
              {day}
            </div>
          ))}

          {/* Empty days */}
          {emptyDays.map(i => (
            <div key={`empty-${i}`} className="bg-gray-50 rounded p-0.5 sm:p-2 min-h-16 sm:min-h-28"></div>
          ))}

          {/* Days with jobs */}
          {days.map(day => {
            const dayJobs = getJobsForDate(day);
            return (
              <div
                key={day}
                className="border border-gray-200 rounded-lg p-0.5 sm:p-2 min-h-16 sm:min-h-28 bg-white hover:bg-blue-50 transition"
              >
                <div className="font-bold text-xs sm:text-sm text-gray-700 mb-0.5 sm:mb-2">{day}</div>
                <div className="space-y-0.5">
                  {dayJobs.length === 0 ? (
                    <p className="text-xs text-gray-400">—</p>
                  ) : (
                    dayJobs.map(job => (
                      <a
                        key={job.id}
                        href={`/jobs/${job.id}`}
                        className={`text-xs p-0.5 sm:p-1.5 rounded block truncate cursor-pointer hover:opacity-100 transition font-medium ${
                          job.status === 'completed'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : job.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              : job.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                        title={job.title}
                      >
                        {job.title}
                      </a>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        {uniqueStatuses.length > 0 && (
          <div className="border-t pt-3 sm:pt-4">
            <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Status Legend</p>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {uniqueStatuses.map(status => (
                <div key={status} className="flex items-center gap-2">
                  <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded ${
                    status === 'completed'
                      ? 'bg-green-100 border border-green-800'
                      : status === 'in_progress'
                        ? 'bg-blue-100 border border-blue-800'
                        : status === 'pending'
                          ? 'bg-yellow-100 border border-yellow-800'
                          : 'bg-gray-100 border border-gray-800'
                  }`}></div>
                  <span className="text-xs sm:text-sm text-gray-700 font-medium">
                    {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {jobs.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-5xl mb-4">📅</div>
            <p className="text-sm sm:text-base text-gray-600">No jobs scheduled yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
