import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface PortalData {
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  activeJobs: Array<{
    id: string;
    title: string;
    status: string;
    scheduledDate: string;
  }>;
  recentInvoices: Array<{
    id: string;
    number: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  serviceHistory: Array<{
    serviceType: string;
    cost: number;
    serviceDate: string;
  }>;
  statistics: {
    totalJobs: number;
    totalInvoiced: number;
    pendingInvoices: number;
  };
}

export default function CustomerPortalPage() {
  const { customerId } = useParams();
  const [portalData, setPortalData] = useState<PortalData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    serviceType: '',
    description: '',
    scheduledDate: '',
    accountId: localStorage.getItem('accountId') || ''
  });
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    fetchPortalData();
  }, [customerId]);

  const fetchPortalData = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/customerportal/customer/${customerId}/overview`
      );
      if (res.ok) {
        const data = await res.json();
        setPortalData(data);
      }
    } catch (error) {
      console.error('Error fetching portal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5000/api/customerportal/customer/${customerId}/book-service`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingForm)
        }
      );
      if (res.ok) {
        setBookingForm({ serviceType: '', description: '', scheduledDate: '', accountId: localStorage.getItem('accountId') || '' });
        setShowBookingForm(false);
        fetchPortalData();
        alert('Service booked successfully!');
      }
    } catch (error) {
      console.error('Error booking service:', error);
      alert('Error booking service');
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;
  if (!portalData) return <div className="text-center py-8 text-gray-500">Customer not found</div>;

  const { customer, activeJobs, recentInvoices, serviceHistory, statistics } = portalData;

  return (
    <div className="space-y-6">
      {/* Customer Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {customer.firstName} {customer.lastName}
            </h1>
            <p className="text-gray-600 mt-1">{customer.email}</p>
            <p className="text-gray-600">{customer.phoneNumber}</p>
          </div>
          <button
            onClick={() => setShowBookingForm(!showBookingForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showBookingForm ? 'Cancel' : 'Book Service'}
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Total Jobs</p>
            <p className="text-2xl font-bold text-blue-600">{statistics.totalJobs}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Total Spent</p>
            <p className="text-2xl font-bold text-green-600">
              ${statistics.totalInvoiced.toFixed(2)}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Pending Invoices</p>
            <p className="text-2xl font-bold text-yellow-600">{statistics.pendingInvoices}</p>
          </div>
        </div>
      </div>

      {/* Book Service Form */}
      {showBookingForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Book a Service</h2>
          <form onSubmit={handleSubmitBooking} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="serviceType"
                placeholder="Service Type"
                value={bookingForm.serviceType}
                onChange={handleBookingInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="datetime-local"
                name="scheduledDate"
                value={bookingForm.scheduledDate}
                onChange={handleBookingInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <textarea
              name="description"
              placeholder="Service Description"
              value={bookingForm.description}
              onChange={handleBookingInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            ></textarea>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Book Service
              </button>
              <button
                type="button"
                onClick={() => setShowBookingForm(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b bg-white rounded-lg p-2">
        {['overview', 'jobs', 'invoices', 'history'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 capitalize ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Jobs */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Active Jobs</h3>
            {activeJobs.length === 0 ? (
              <p className="text-gray-500">No active jobs</p>
            ) : (
              <div className="space-y-2">
                {activeJobs.map(job => (
                  <div key={job.id} className="p-3 bg-gray-50 rounded">
                    <p className="font-medium text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-600">{job.status}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(job.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Invoices */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Recent Invoices</h3>
            {recentInvoices.length === 0 ? (
              <p className="text-gray-500">No invoices</p>
            ) : (
              <div className="space-y-2">
                {recentInvoices.map(invoice => (
                  <div key={invoice.id} className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-900">#{invoice.number}</p>
                      <p className="font-bold text-gray-900">${invoice.total.toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-gray-600">{invoice.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">All Jobs</h3>
          {activeJobs.length === 0 ? (
            <p className="text-gray-500">No jobs</p>
          ) : (
            <div className="space-y-2">
              {activeJobs.map(job => (
                <div key={job.id} className="p-4 border border-gray-200 rounded">
                  <h4 className="font-semibold text-gray-900">{job.title}</h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">{job.status}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(job.scheduledDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Invoices</h3>
          {recentInvoices.length === 0 ? (
            <p className="text-gray-500">No invoices</p>
          ) : (
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 text-sm font-medium text-gray-700">Number</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-700">Amount</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map(invoice => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">#{invoice.number}</td>
                    <td className="py-2">${invoice.total.toFixed(2)}</td>
                    <td className="py-2 text-sm">{invoice.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Service History</h3>
          {serviceHistory.length === 0 ? (
            <p className="text-gray-500">No service history</p>
          ) : (
            <div className="space-y-2">
              {serviceHistory.map((item, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-900">{item.serviceType}</p>
                    <p className="font-bold text-gray-900">${item.cost.toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(item.serviceDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
