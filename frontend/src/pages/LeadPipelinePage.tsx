import { useState, useEffect } from 'react';

interface Lead {
  id: string;
  customerName: string;
  leadSource: string;
  status: string;
  estimatedValue?: number;
  followUpDate?: string;
  notes?: string;
}

interface Summary {
  total_leads: number;
  new_leads: number;
  contacted: number;
  quoted: number;
  won: number;
  lost: number;
  total_value: number;
}

export default function LeadPipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    accountId: localStorage.getItem('accountId') || '',
    customerId: '',
    leadSource: 'website',
    estimatedValue: '',
    notes: ''
  });

  const statuses = ['new', 'contacted', 'quoted', 'won', 'lost'];
  const sources = ['website', 'phone', 'referral', 'advertisement', 'social_media', 'other'];

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const accountId = localStorage.getItem('accountId');
      const statusParam = selectedStatus !== 'all' ? `&status=${selectedStatus}` : '';
      const res = await fetch(
        `http://localhost:5000/api/leads?accountId=${accountId}&limit=50${statusParam}`
      );
      const data = await res.json();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
    setLoading(false);
  };

  const fetchSummary = async () => {
    try {
      const accountId = localStorage.getItem('accountId');
      const res = await fetch(
        `http://localhost:5000/api/leads/dashboard/summary?accountId=${accountId}`
      );
      const data = await res.json();
      setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchSummary();
  }, [selectedStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({
          accountId: localStorage.getItem('accountId') || '',
          customerId: '',
          leadSource: 'website',
          estimatedValue: '',
          notes: ''
        });
        setShowForm(false);
        fetchLeads();
        fetchSummary();
        alert('Lead created successfully!');
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('Error creating lead');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-purple-100 text-purple-800',
      quoted: 'bg-yellow-100 text-yellow-800',
      won: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Lead Pipeline</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Lead'}
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Total Leads</p>
            <p className="text-3xl font-bold text-blue-600">{summary.total}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Won Deals</p>
            <p className="text-3xl font-bold text-green-600">{summary.won}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Pipeline Value</p>
            <p className="text-3xl font-bold text-purple-600">
              ${summary.total_value.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Lead</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="leadSource"
                value={formData.leadSource}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                {sources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
              <input
                type="number"
                name="estimatedValue"
                placeholder="Estimated Value"
                value={formData.estimatedValue}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <textarea
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            ></textarea>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Lead
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

      {/* Status Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-4 py-2 whitespace-nowrap ${
            selectedStatus === 'all'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All
        </button>
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 capitalize whitespace-nowrap ${
              selectedStatus === status
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Leads List */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : leads.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No leads found</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Follow-up</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {lead.customerName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{lead.leadSource}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {lead.estimatedValue ? `$${lead.estimatedValue.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : '-'}
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
