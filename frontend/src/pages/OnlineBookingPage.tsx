import { useState, useEffect } from 'react';

interface OnlineBooking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  description: string;
  scheduledDate: string;
  status: string;
  quotedPrice?: number;
}

export default function OnlineBookingPage() {
  const [bookings, setBookings] = useState<OnlineBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceType: '',
    description: '',
    scheduledDate: '',
    accountId: localStorage.getItem('accountId') || ''
  });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const statusParam = filter !== 'all' ? `&status=${filter}` : '';
      const res = await fetch(
        `http://localhost:5000/api/bookings?limit=50${statusParam}`
      );
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          serviceType: '',
          description: '',
          scheduledDate: '',
          accountId: localStorage.getItem('accountId') || ''
        });
        setShowForm(false);
        fetchBookings();
        alert('Booking created successfully!');
      } else {
        alert('Error creating booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Online Bookings</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'New Booking'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Create New Booking</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="customerName"
                placeholder="Customer Name"
                value={formData.customerName}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="email"
                name="customerEmail"
                placeholder="Customer Email"
                value={formData.customerEmail}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="tel"
                name="customerPhone"
                placeholder="Customer Phone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="serviceType"
                placeholder="Service Type"
                value={formData.serviceType}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="datetime-local"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <textarea
              name="description"
              placeholder="Service Description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            ></textarea>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Booking
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        {['all', 'pending', 'confirmed', 'completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 capitalize ${
              filter === status
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No bookings found</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{booking.customerName}</p>
                      <p className="text-sm text-gray-500">{booking.customerEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{booking.serviceType}</td>
                  <td className="px-6 py-4 text-gray-900">
                    {new Date(booking.scheduledDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {booking.quotedPrice ? `$${booking.quotedPrice.toFixed(2)}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
