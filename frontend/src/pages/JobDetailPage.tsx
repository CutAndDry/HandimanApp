import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService } from '@/services/jobService';
import type { Job } from '@/types';

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    supplier: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    materialType: 'general',
  });
  const [showMaterialForm, setShowMaterialForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const data = await jobService.getJob(id!);
      setJob(data);
      setError(null);
    } catch (err) {
      setError('Failed to load job');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!job) return;
    try {
      // Find the correct method - jobService.updateJob or use the correct API call
      await jobService.updateJob(job.id, { ...job, status });
      await fetchJob();
    } catch (err) {
      setError('Failed to update job status');
      console.error(err);
    }
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    try {
      // This would require a material service endpoint
      console.log('Adding material:', materialForm);
      setMaterialForm({ supplier: '', description: '', quantity: 1, unitPrice: 0, materialType: 'general' });
      setShowMaterialForm(false);
      // await fetchJob();
    } catch (err) {
      setError('Failed to add material');
      console.error(err);
    }
  };

  const handleTimerToggle = () => {
    setTimerRunning(!timerRunning);
  };

  const handleSaveTimer = async () => {
    if (!job) return;
    const hours = timer / 3600;
    try {
      await jobService.updateJob(job.id, { ...job, laborHours: hours });
      setTimer(0);
      setTimerRunning(false);
      await fetchJob();
    } catch (err) {
      setError('Failed to save labor hours');
      console.error(err);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">❌</div>
        <p className="text-gray-600 mb-4">Job not found</p>
        <button
          onClick={() => navigate('/jobs')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  const jobStatusColors: { [key: string]: string } = {
    lead: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{job.title}</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">{job.description}</p>
        </div>
        <button
          onClick={() => navigate('/jobs')}
          className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
        >
          ← Back to Jobs
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Job Details */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Status & Key Info */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="mb-6">
              <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Status</label>
              <select
                value={job.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`w-full font-bold py-2 px-3 sm:px-4 rounded-lg border-none cursor-pointer text-white text-sm sm:text-base ${
                  job.status === 'completed'
                    ? 'bg-green-600 hover:bg-green-700'
                    : job.status === 'in_progress'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : job.status === 'pending'
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                <option value="lead">Lead</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Customer</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">{job.customerName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Job Type</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">{job.jobType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Location</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">📍 {job.location || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Scheduled</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {(job.description || job.notes) && (
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Details</h2>
              {job.description && (
                <div className="mb-4">
                  <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">Description</p>
                  <p className="text-sm sm:text-base text-gray-700">{job.description}</p>
                </div>
              )}
              {job.notes && (
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">Notes</p>
                  <p className="text-sm sm:text-base text-gray-700">{job.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Materials Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Materials</h2>
              <button
                onClick={() => setShowMaterialForm(!showMaterialForm)}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-lg transition text-sm"
              >
                {showMaterialForm ? 'Cancel' : '+ Add Material'}
              </button>
            </div>

            {showMaterialForm && (
              <form onSubmit={handleAddMaterial} className="mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <input
                    type="text"
                    placeholder="Enter supplier name"
                    value={materialForm.supplier}
                    onChange={(e) => setMaterialForm({ ...materialForm, supplier: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Enter description"
                    value={materialForm.description}
                    onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Qty"
                      value={materialForm.quantity}
                      onChange={(e) => setMaterialForm({ ...materialForm, quantity: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="$"
                      value={materialForm.unitPrice}
                      onChange={(e) => setMaterialForm({ ...materialForm, unitPrice: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Material Type</label>
                  <select
                    value={materialForm.materialType}
                    onChange={(e) => setMaterialForm({ ...materialForm, materialType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="general">General</option>
                    <option value="electrical">Electrical</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="hardware">Hardware</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
                  >
                    Save Material
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMaterialForm(false)}
                    className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="text-center py-6 sm:py-8 text-gray-600">
              <div className="text-2xl sm:text-3xl mb-2">📦</div>
              <p className="text-sm sm:text-base">No materials added yet</p>
            </div>
          </div>
        </div>

        {/* Timer & Labor Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Timer */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">⏱️ Labor Hours</h2>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-lg mb-4 text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold text-blue-600 mb-4 tracking-tight break-all">
                {formatTime(timer)}
              </div>
              <div className="space-y-2">
                <button
                  onClick={handleTimerToggle}
                  className={`w-full font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-white transition text-sm sm:text-base ${
                    timerRunning
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {timerRunning ? '⏸ Pause' : '▶ Start'}
                </button>
                <button
                  onClick={handleSaveTimer}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition text-sm"
                >
                  💾 Save Hours
                </button>
                <button
                  onClick={() => setTimer(0)}
                  className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-3 rounded-lg transition text-sm"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Total Logged</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{job.laborHours?.toFixed(2) || '0.00'} <span className="text-xs sm:text-sm text-gray-600">hrs</span></p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <button
              onClick={() => navigate(`/invoices?jobId=${job.id}`)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition text-sm"
            >
              💰 Create Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
