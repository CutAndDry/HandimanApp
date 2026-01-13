import React, { useState } from 'react';
import { Users, Award, Plus, Edit2, Trash2, Check } from 'lucide-react';

interface Technician {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  skills: string[];
  certifications: string[];
  hourlyRate: number;
  rating: number;
  completedJobs: number;
  totalJobs: number;
  isActive: boolean;
}

export const TechnicianManagementPage: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      phoneNumber: '(303) 555-0101',
      skills: ['HVAC', 'Plumbing', 'Electrical'],
      certifications: ['EPA Certified', 'HVAC License'],
      hourlyRate: 75,
      rating: 4.8,
      completedJobs: 142,
      totalJobs: 145,
      isActive: true
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@example.com',
      phoneNumber: '(720) 555-0102',
      skills: ['Plumbing', 'Water Heater', 'Repairs'],
      certifications: ['Plumbing License', 'Master Plumber'],
      hourlyRate: 80,
      rating: 4.9,
      completedJobs: 97,
      totalJobs: 98,
      isActive: true
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Davis',
      email: 'mike@example.com',
      phoneNumber: '(970) 555-0103',
      skills: ['Electrical', 'Smart Home', 'Lighting'],
      certifications: ['Electrical License'],
      hourlyRate: 70,
      rating: 4.7,
      completedJobs: 74,
      totalJobs: 76,
      isActive: true
    }
  ]);

  const [showAddSkill, setShowAddSkill] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Intermediate' as const });

  const addSkillToTechnician = (techId: string) => {
    setTechnicians(prevTechs =>
      prevTechs.map(tech =>
        tech.id === techId
          ? { ...tech, skills: [...tech.skills, newSkill.name] }
          : tech
      )
    );
    setNewSkill({ name: '', level: 'Intermediate' });
    setShowAddSkill(null);
  };

  const toggleTechnicianStatus = (techId: string) => {
    setTechnicians(prevTechs =>
      prevTechs.map(tech =>
        tech.id === techId ? { ...tech, isActive: !tech.isActive } : tech
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Technician Management</h1>
          <p className="text-gray-600 mt-2">Manage skills, certifications, and availability</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          <Plus className="w-5 h-5" />
          Add Technician
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Technicians</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {technicians.filter(t => t.isActive).length}
              </p>
            </div>
            <Users className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg. Rating</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {(technicians.reduce((sum, t) => sum + t.rating, 0) / technicians.length).toFixed(1)} ★
              </p>
            </div>
            <Award className="w-10 h-10 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {technicians.reduce((sum, t) => sum + t.completedJobs, 0)}
              </p>
            </div>
            <Check className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Technician List */}
      <div className="space-y-4">
        {technicians.map((tech) => (
          <div
            key={tech.id}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition ${
              !tech.isActive ? 'opacity-60' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {tech.firstName[0]}{tech.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {tech.firstName} {tech.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{tech.email} • {tech.phoneNumber}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleTechnicianStatus(tech.id)}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    tech.isActive
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {tech.isActive ? 'Active' : 'Inactive'}
                </button>
                <button className="p-2 hover:bg-gray-100 rounded transition">
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded transition">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 pb-4 border-b border-gray-200">
              <div>
                <p className="text-gray-600 text-xs">Rating</p>
                <p className="text-lg font-semibold text-gray-900">{tech.rating} ★</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Completed Jobs</p>
                <p className="text-lg font-semibold text-gray-900">{tech.completedJobs}/{tech.totalJobs}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Success Rate</p>
                <p className="text-lg font-semibold text-gray-900">
                  {((tech.completedJobs / tech.totalJobs) * 100).toFixed(0)}%
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Hourly Rate</p>
                <p className="text-lg font-semibold text-gray-900">${tech.hourlyRate}/hr</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Jobs This Week</p>
                <p className="text-lg font-semibold text-gray-900">{Math.floor(Math.random() * 6) + 2}</p>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-900">Skills & Certifications</h4>
                {showAddSkill !== tech.id && (
                  <button
                    onClick={() => setShowAddSkill(tech.id)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Skill
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {tech.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                    <button className="hover:text-blue-600">×</button>
                  </span>
                ))}
              </div>

              {showAddSkill === tech.id && (
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Skill name"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => addSkillToTechnician(tech.id)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddSkill(null)}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium transition"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {tech.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    <Award className="w-3 h-3" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicianManagementPage;
