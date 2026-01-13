import React, { useState } from 'react';
import { Users, Calendar, TrendingUp } from 'lucide-react';

interface Technician {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  skills: string[];
  totalJobs: number;
  completedJobs: number;
  rating: number;
}

interface ScheduleOptimization {
  jobId: string;
  jobTitle: string;
  customerName: string;
  serviceType: string;
  recommendedTechnician: {
    id: string;
    name: string;
    matchScore: number;
  };
}

export const SchedulingPage: React.FC = () => {
  const [technicians] = useState<Technician[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      skills: ['HVAC', 'Plumbing', 'Electrical'],
      totalJobs: 145,
      completedJobs: 142,
      rating: 4.8
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@example.com',
      skills: ['Plumbing', 'Water Heater', 'Repairs'],
      totalJobs: 98,
      completedJobs: 97,
      rating: 4.9
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Davis',
      email: 'mike@example.com',
      skills: ['Electrical', 'Smart Home', 'Lighting'],
      totalJobs: 76,
      completedJobs: 74,
      rating: 4.7
    }
  ]);

  const [optimizations] = useState<ScheduleOptimization[]>([
    {
      jobId: '1',
      jobTitle: 'Emergency AC Repair',
      customerName: 'Robert Wilson',
      serviceType: 'HVAC',
      recommendedTechnician: {
        id: '1',
        name: 'John Smith',
        matchScore: 92
      }
    },
    {
      jobId: '2',
      jobTitle: 'Plumbing Inspection',
      customerName: 'Jennifer Brown',
      serviceType: 'Plumbing',
      recommendedTechnician: {
        id: '2',
        name: 'Sarah Johnson',
        matchScore: 95
      }
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Smart Scheduling</h1>
        <p className="text-gray-600 mt-2">Optimize technician assignments and routes</p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Technicians</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{technicians.length}</p>
            </div>
            <Users className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg Utilization</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">87%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Assignments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{optimizations.length}</p>
            </div>
            <Calendar className="w-10 h-10 text-orange-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">98%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Recommended Assignments */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Recommendations</h2>
        <div className="space-y-4">
          {optimizations.map((opt) => (
            <div key={opt.jobId} className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{opt.jobTitle}</h3>
                  <p className="text-sm text-gray-600 mt-1">Customer: {opt.customerName}</p>
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs font-medium mt-2">
                    {opt.serviceType}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{opt.recommendedTechnician.name}</p>
                  <p className="text-sm text-green-600 font-medium">{opt.recommendedTechnician.matchScore}% Match</p>
                  <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium transition">
                    Assign
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technician List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Technician Directory</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technicians.map((tech) => (
            <div key={tech.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <h3 className="font-semibold text-gray-900">{tech.firstName} {tech.lastName}</h3>
              <p className="text-sm text-gray-600">{tech.email}</p>
              
              <div className="mt-3 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Rating:</span>
                  <span className="ml-2 text-yellow-500">★ {tech.rating}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Jobs:</span>
                  <span className="ml-2">{tech.completedJobs}/{tech.totalJobs}</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {tech.skills.map((skill) => (
                  <span key={skill} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchedulingPage;
