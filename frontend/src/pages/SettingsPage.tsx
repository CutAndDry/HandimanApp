import React, { useState, useEffect } from 'react'
import { accountService } from '@/services/accountService'

const SettingsPage: React.FC = () => {
  const [account, setAccount] = useState({
    businessName: '',
    businessType: '',
    businessPhone: '',
    businessAddress: '',
    businessCity: '',
    businessState: '',
    businessPostalCode: '',
    hourlyRate: '',
    taxRate: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [accountId, setAccountId] = useState('')

  useEffect(() => {
    fetchAccount()
  }, [])

  const fetchAccount = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await accountService.getCurrentAccount()
      setAccountId(data.id)
      setAccount({
        businessName: data.businessName || '',
        businessType: data.businessType || '',
        businessPhone: data.businessPhone || '',
        businessAddress: data.businessAddress || '',
        businessCity: data.businessCity || '',
        businessState: data.businessState || '',
        businessPostalCode: data.businessPostalCode || '',
        hourlyRate: data.hourlyRate || '',
        taxRate: data.taxRate || ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load account')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError(null)
      setSuccess(null)
      await accountService.updateAccount(accountId, {
        businessName: account.businessName,
        businessType: account.businessType,
        phoneNumber: account.businessPhone,
        address: account.businessAddress,
        city: account.businessCity,
        state: account.businessState,
        zipCode: account.businessPostalCode
      })
      setSuccess('Account updated successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update account')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setAccount({ ...account, [name]: value })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage your business account and preferences</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm">
          ✓ {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Business Information</h2>

        {/* Business Name */}
        <div className="mb-4">
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Business Name *</label>
          <input
            type="text"
            name="businessName"
            value={account.businessName}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            required
          />
        </div>

        {/* Business Type */}
        <div className="mb-4">
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Business Type *</label>
          <select
            name="businessType"
            value={account.businessType}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            required
          >
            <option value="">Select a type</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="HVAC">HVAC</option>
            <option value="Carpentry">Carpentry</option>
            <option value="General">General Contracting</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            name="businessPhone"
            value={account.businessPhone}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Address</label>
          <input
            type="text"
            name="businessAddress"
            value={account.businessAddress}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* City, State, ZIP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">City</label>
            <input
              type="text"
              name="businessCity"
              value={account.businessCity}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">State</label>
            <input
              type="text"
              name="businessState"
              value={account.businessState}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">ZIP Code</label>
            <input
              type="text"
              name="businessPostalCode"
              value={account.businessPostalCode}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Rates */}
        <div className="border-t pt-4 sm:pt-6 mt-4 sm:mt-6">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Billing Rates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Hourly Rate</label>
              <div className="relative">
                <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">$</span>
                <input
                  type="number"
                  name="hourlyRate"
                  value={account.hourlyRate}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Tax Rate</label>
              <div className="relative">
                <input
                  type="number"
                  name="taxRate"
                  value={account.taxRate}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full pr-7 sm:pr-8 pl-3 sm:pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <span className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-2 mt-6">
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-6 rounded-lg transition text-sm"
          >
            💾 Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}

export default SettingsPage
