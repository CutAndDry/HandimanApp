import React, { useState, useEffect } from 'react'
import { invoiceService, Invoice } from '@/services/invoiceService'

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    jobId: '',
    customerId: '',
    dueDate: '',
    laborHours: '',
    hourlyRate: '',
    materialCost: '',
    notes: ''
  })

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await invoiceService.getInvoices()
      setInvoices(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoices')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await invoiceService.createInvoice({
        jobId: formData.jobId,
        customerId: formData.customerId,
        dueDate: formData.dueDate,
        laborHours: formData.laborHours ? Number(formData.laborHours) : undefined,
        hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : undefined,
        materialCost: formData.materialCost ? Number(formData.materialCost) : undefined,
        notes: formData.notes
      })
      setShowForm(false)
      setFormData({
        jobId: '',
        customerId: '',
        dueDate: '',
        laborHours: '',
        hourlyRate: '',
        materialCost: '',
        notes: ''
      })
      fetchInvoices()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice')
    }
  }

  const handleRecordPayment = async (invoiceId: string) => {
    const amount = prompt('Enter payment amount:')
    if (!amount) return

    try {
      await invoiceService.recordPayment(invoiceId, {
        amount: Number(amount)
      })
      fetchInvoices()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record payment')
    }
  }

  const handleDownloadPdf = async (invoiceId: string, invoiceNumber: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/invoices/${invoiceId}/pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice_${invoiceNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError('Failed to download PDF')
      console.error(err)
    }
  }

  const handleSendEmail = async (invoiceId: string) => {
    try {
      await fetch(`http://localhost:5000/api/invoices/${invoiceId}/email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      alert('Invoice sent successfully!')
      fetchInvoices()
    } catch (err) {
      setError('Failed to send invoice')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-1">Generate, manage, and track invoices</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          {showForm ? 'Cancel' : '+ New Invoice'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Create New Invoice</h2>
          <form onSubmit={handleCreateInvoice} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Job ID *</label>
                <input
                  type="text"
                  placeholder="Enter job ID"
                  value={formData.jobId}
                  onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Customer ID *</label>
                <input
                  type="text"
                  placeholder="Enter customer ID"
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Labor Hours</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="Enter hours"
                  value={formData.laborHours}
                  onChange={(e) => setFormData({ ...formData, laborHours: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="$"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Material Cost</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="$"
                  value={formData.materialCost}
                  onChange={(e) => setFormData({ ...formData, materialCost: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                placeholder="Add any notes for this invoice..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                rows={3}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
              >
                Create Invoice
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full sm:flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Invoices List */}
      <div className="space-y-3 sm:space-y-4">
        {invoices.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center">
            <div className="text-4xl sm:text-5xl mb-4">📄</div>
            <p className="text-sm sm:text-base text-gray-600 mb-4">No invoices yet. Create one to get started!</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
            >
              Create First Invoice
            </button>
          </div>
        ) : (
          invoices.map((invoice) => (
            <div key={invoice.id} className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-lg transition">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Invoice Number</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{invoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Total Amount</p>
                  <p className="text-lg sm:text-xl font-bold text-green-600">${invoice.totalAmount?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Paid Amount</p>
                  <p className="text-lg sm:text-xl font-bold text-blue-600">${invoice.paidAmount?.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold text-white w-fit ${
                  invoice.status === 'paid' 
                    ? 'bg-green-600' 
                    : invoice.status === 'sent' 
                      ? 'bg-blue-600' 
                      : 'bg-yellow-600'
                }`}>
                  {(invoice.status || 'pending').toUpperCase()}
                </span>
                <span className="text-xs sm:text-sm text-gray-600">
                  Due: {new Date(invoice.dueDate || '').toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <button
                  onClick={() => handleRecordPayment(invoice.id!)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-lg transition text-sm"
                >
                  💳 Record Payment
                </button>
                <button
                  onClick={() => handleDownloadPdf(invoice.id!, invoice.invoiceNumber || 'unknown')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition text-sm"
                >
                  📥 Download PDF
                </button>
                <button
                  onClick={() => handleSendEmail(invoice.id!)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded-lg transition text-sm"
                >
                  📧 Send Email
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default InvoicesPage
