import { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';

interface Payment {
  id: string;
  invoiceId: string;
  customerId: string;
  amount: number;
  method: string;
  paymentDate: string;
  reference: string;
  createdAt: string;
}

interface Summary {
  totalInvoiced: number;
  totalCollected: number;
  totalOutstanding: number;
  paidInvoices: number;
  unpaidInvoices: number;
  collectionRate: number;
  totalPayments: number;
  averagePayment: number;
}

export function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const accountId = localStorage.getItem('accountId') || '';
      
      // Fetch payments
      const paymentsResponse = await fetch(
        `http://localhost:5000/api/invoices-payments/payments?accountId=${accountId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const paymentsData = await paymentsResponse.json();
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);

      // Fetch summary
      const summaryResponse = await fetch(
        `http://localhost:5000/api/invoices-payments/summary?accountId=${accountId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const summaryData = await summaryResponse.json();
      setSummary(summaryData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = filter === 'all' 
    ? payments 
    : payments.filter(p => p.method === filter);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-2">Track and manage customer payments</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} />
          Record Payment
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-600 text-sm font-medium">Total Collected</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(summary.totalCollected)}</div>
            <div className="text-gray-500 text-xs mt-2">{summary.totalPayments} payments</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-600 text-sm font-medium">Outstanding</div>
            <div className="text-3xl font-bold text-orange-600 mt-2">{formatCurrency(summary.totalOutstanding)}</div>
            <div className="text-gray-500 text-xs mt-2">{summary.unpaidInvoices} invoices pending</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-600 text-sm font-medium">Collection Rate</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">{summary.collectionRate.toFixed(1)}%</div>
            <div className="text-gray-500 text-xs mt-2">of invoiced amount</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-600 text-sm font-medium">Average Payment</div>
            <div className="text-3xl font-bold text-purple-600 mt-2">{formatCurrency(summary.averagePayment)}</div>
            <div className="text-gray-500 text-xs mt-2">per transaction</div>
          </div>
        </div>
      )}

      {/* Payments List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Recent Payments</h2>
          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Methods</option>
              <option value="card">Credit Card</option>
              <option value="check">Check</option>
              <option value="ach">Bank Transfer</option>
              <option value="cash">Cash</option>
            </select>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download size={18} />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Method</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">{payment.reference}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.invoiceId.substring(0, 8)}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">{formatCurrency(payment.amount)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {payment.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(payment.paymentDate)}</td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">View</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No payments recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
