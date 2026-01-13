import React, { useState } from 'react';
import { Truck, Home, TrendingUp, MapPin } from 'lucide-react';

interface ServiceArea {
  city: string;
  jobCount: number;
  completedJobs: number;
  completionRate: number;
  revenue: number;
}

interface TechnicianRoute {
  id: string;
  name: string;
  date: string;
  jobCount: number;
  totalHours: number;
  nextStop: string;
  status: 'active' | 'completed' | 'pending';
}

export const MapServiceAreasPage: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>('Denver');

  const serviceAreas: ServiceArea[] = [
    {
      city: 'Denver',
      jobCount: 156,
      completedJobs: 154,
      completionRate: 0.987,
      revenue: 45230
    },
    {
      city: 'Boulder',
      jobCount: 89,
      completedJobs: 87,
      completionRate: 0.978,
      revenue: 26540
    },
    {
      city: 'Fort Collins',
      jobCount: 65,
      completedJobs: 63,
      completionRate: 0.969,
      revenue: 19870
    },
    {
      city: 'Colorado Springs',
      jobCount: 42,
      completedJobs: 40,
      completionRate: 0.952,
      revenue: 12600
    },
    {
      city: 'Aurora',
      jobCount: 78,
      completedJobs: 75,
      completionRate: 0.962,
      revenue: 23450
    }
  ];

  const technicianRoutes: TechnicianRoute[] = [
    {
      id: '1',
      name: 'John Smith',
      date: 'Today',
      jobCount: 4,
      totalHours: 7.5,
      nextStop: '1234 Main St, Denver',
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      date: 'Today',
      jobCount: 3,
      totalHours: 6,
      nextStop: '5678 Oak Ave, Boulder',
      status: 'active'
    },
    {
      id: '3',
      name: 'Mike Davis',
      date: 'Today',
      jobCount: 5,
      totalHours: 8,
      nextStop: '9012 Pine Rd, Fort Collins',
      status: 'active'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Service Area Map</h1>
        <p className="text-gray-600 mt-2">Real-time coverage and technician routes</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Service Cities</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{serviceAreas.length}</p>
            </div>
            <MapPin className="w-10 h-10 text-red-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {serviceAreas.reduce((sum, a) => sum + a.jobCount, 0)}
              </p>
            </div>
            <Home className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {(
                  (serviceAreas.reduce((sum, a) => sum + a.completionRate, 0) / serviceAreas.length) * 100
                ).toFixed(1)}
                %
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${(serviceAreas.reduce((sum, a) => sum + a.revenue, 0) / 1000).toFixed(0)}K
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-500 opacity-20" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Areas List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Service Cities</h2>
            <div className="space-y-2">
              {serviceAreas.map((area) => (
                <button
                  key={area.city}
                  onClick={() => setSelectedArea(area.city)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    selectedArea === area.city
                      ? 'bg-blue-100 border border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{area.city}</span>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      {area.jobCount} jobs
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {(area.completionRate * 100).toFixed(0)}% complete
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Area Details */}
        <div className="lg:col-span-2">
          {selectedArea && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{selectedArea} Details</h2>
              
              {(() => {
                const area = serviceAreas.find(a => a.city === selectedArea);
                return area ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm">Total Jobs</p>
                      <p className="text-2xl font-bold text-blue-600 mt-2">{area.jobCount}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm">Completed</p>
                      <p className="text-2xl font-bold text-green-600 mt-2">{area.completedJobs}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm">Completion Rate</p>
                      <p className="text-2xl font-bold text-purple-600 mt-2">
                        {(area.completionRate * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm">Revenue</p>
                      <p className="text-2xl font-bold text-orange-600 mt-2">
                        ${(area.revenue / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Active Routes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Truck className="w-5 h-5 mr-2" />
          Active Routes
        </h2>
        <div className="space-y-3">
          {technicianRoutes.map((route) => (
            <div key={route.id} className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{route.name}</h3>
                  <p className="text-sm text-gray-600">{route.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  route.status === 'active' ? 'bg-green-100 text-green-800' :
                  route.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {route.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <p>📍 Next: {route.nextStop}</p>
                <p>📋 {route.jobCount} jobs | ⏱ {route.totalHours}h estimated</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapServiceAreasPage;
