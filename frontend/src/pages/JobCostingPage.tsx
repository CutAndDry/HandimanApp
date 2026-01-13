import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

interface JobCost {
  id: string;
  jobId: string;
  amount: number;
  costType: string;
  description: string;
  createdAt: string;
}

interface CostAnalysis {
  totalJobsWithCosts: number;
  totalCostItems: number;
  totalCost: number;
  averageJobCost: number;
  costBreakdown: Array<{
    type: string;
    count: number;
    total: number;
  }>;
}

export function JobCostingPage() {
  const [costs, setCosts] = useState<JobCost[]>([]);
  const [analysis, setAnalysis] = useState<CostAnalysis | null>(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch job costs
      const costsResponse = await fetch('http://localhost:5000/api/job-costing', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const costsData = await costsResponse.json();
      setCosts(Array.isArray(costsData) ? costsData : []);

      // Fetch analysis
      const analysisResponse = await fetch('http://localhost:5000/api/job-costing/summary/overview', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const analysisData = await analysisResponse.json();
      setAnalysis(analysisData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCosts = filter === 'all' 
    ? costs 
    : costs.filter(c => c.costType === filter);

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

  const getCostTypeColor = (type: string) => {
    switch(type.toLowerCase()) {
      case 'labor': return 'bg-blue-100 text-blue-800';
      case 'material': return 'bg-green-100 text-green-800';
      case 'equipment': return 'bg-yellow-100 text-yellow-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Job Costing</h1>
          <p className="text-gray-600 mt-2">Track expenses and analyze job profitability</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} />
          Add Cost
        </button>
      </div>

      {/* Summary Cards */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-600 text-sm font-medium">Total Costs</div>
            <div className="text-3xl font-bold text-red-600 mt-2">{formatCurrency(analysis.totalCost)}</div>
            <div className="text-gray-500 text-xs mt-2">{analysis.totalCostItems} cost items</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-600 text-sm font-medium">Jobs Tracked</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">{analysis.totalJobsWithCosts}</div>
            <div className="text-gray-500 text-xs mt-2">active jobs</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-600 text-sm font-medium">Average Cost/Job</div>
            <div className="text-3xl font-bold text-orange-600 mt-2">{formatCurrency(analysis.averageJobCost)}</div>
            <div className="text-gray-500 text-xs mt-2">per job</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-600 text-sm font-medium">Cost Types</div>
            <div className="text-3xl font-bold text-purple-600 mt-2">{analysis.costBreakdown.length}</div>
            <div className="text-gray-500 text-xs mt-2">categories tracked</div>
          </div>
        </div>
      )}

      {/* Cost Breakdown */}
      {analysis && analysis.costBreakdown.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Cost Breakdown by Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analysis.costBreakdown.map((category) => (
              <div key={category.type} className="border border-gray-200 rounded-lg p-4">
                <div className="text-gray-600 text-sm font-medium">{category.type.toUpperCase()}</div>
                <div className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(category.total)}</div>
                <div className="text-gray-500 text-xs mt-2">{category.count} items</div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: analysis.totalCost > 0 
                        ? `${(category.total / analysis.totalCost) * 100}%`
                        : '0%'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Costs List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">All Costs</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Types</option>
            <option value="labor">Labor</option>
            <option value="material">Material</option>
            <option value="equipment">Equipment</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Job ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCosts.length > 0 ? (
                filteredCosts.map((cost) => (
                  <tr key={cost.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">{cost.jobId.substring(0, 8)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCostTypeColor(cost.costType)}`}>
                        {cost.costType.charAt(0).toUpperCase() + cost.costType.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-red-600">{formatCurrency(cost.amount)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cost.description || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(cost.createdAt)}</td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No costs recorded yet
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
