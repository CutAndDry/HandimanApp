import React, { useEffect, useState } from 'react';
import { customerService } from '@/services/customerService';
import type { Customer } from '@/types';

const CustomerPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    notes: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getCustomers();
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await customerService.updateCustomer(editingId, formData);
      } else {
        await customerService.createCustomer(formData);
      }
      resetForm();
      await fetchCustomers();
    } catch (err) {
      setError('Failed to save customer');
      console.error(err);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setFormData(customer);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await customerService.deleteCustomer(id);
      await fetchCustomers();
    } catch (err) {
      setError('Failed to delete customer');
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      notes: '',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
        <p className="text-gray-600 mt-1">Manage and organize your customer information</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 sticky top-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              {editingId ? '✏️ Edit Customer' : '➕ New Customer'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="(555) 123-4567"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="123 Main St"
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="New York"
                    value={formData.city || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="NY"
                    value={formData.state || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="10001"
                  value={formData.postalCode || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  placeholder="Additional notes..."
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Customers List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {customers.length === 0 ? (
              <div className="p-8 sm:p-12 text-center">
                <div className="text-4xl sm:text-5xl mb-4">👥</div>
                <p className="text-gray-600 mb-4">No customers yet. Create one to get started!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b border-gray-200 hidden sm:table-header-group">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left font-bold text-gray-700 text-xs sm:text-sm">Name</th>
                      <th className="px-4 sm:px-6 py-3 text-left font-bold text-gray-700 text-xs sm:text-sm">Email</th>
                      <th className="px-4 sm:px-6 py-3 text-left font-bold text-gray-700 text-xs sm:text-sm">Phone</th>
                      <th className="px-4 sm:px-6 py-3 text-left font-bold text-gray-700 text-xs sm:text-sm">City</th>
                      <th className="px-4 sm:px-6 py-3 text-left font-bold text-gray-700 text-xs sm:text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id} className="border-b hover:bg-gray-50 transition block sm:table-row mb-4 sm:mb-0">
                        <td className="px-4 sm:px-6 py-3 font-medium text-gray-900 before:content-['Name: '] sm:before:content-none text-xs sm:text-sm block sm:table-cell">
                          {customer.name}
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-gray-600 before:content-['Email: '] sm:before:content-none text-xs sm:text-sm block sm:table-cell">
                          {customer.email || '-'}
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-gray-600 before:content-['Phone: '] sm:before:content-none text-xs sm:text-sm block sm:table-cell">
                          {customer.phone || '-'}
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-gray-600 before:content-['City: '] sm:before:content-none text-xs sm:text-sm block sm:table-cell">
                          {customer.city || '-'}
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm block sm:table-cell">
                          <div className="flex gap-2 sm:gap-3">
                            <button
                              onClick={() => handleEdit(customer)}
                              className="text-blue-600 hover:text-blue-800 font-semibold transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(customer.id)}
                              className="text-red-600 hover:text-red-800 font-semibold transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
