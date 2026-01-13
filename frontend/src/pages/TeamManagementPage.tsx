import React, { useEffect, useState } from 'react'
import { Icons } from '../components/Icons'

interface Team {
  id: string
  name: string
  description: string
  manager: string
  memberCount: number
  active: boolean
  createdAt: string
}

interface TeamMember {
  memberId: string
  name: string
  email: string
  role: string
  joinDate: string
  status: string
}

interface TeamDetail extends Team {
  members: TeamMember[]
  budget: number
  budgetUsed: number
  jobsCompleted: number
  revenue: number
}

interface TeamStats {
  totalTeams: number
  activeTeams: number
  totalMembers: number
  totalBudget: number
  budgetUsed: number
  budgetRemaining: number
  totalJobsCompleted: number
  totalRevenue: number
}

const TeamManagementPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([])
  const [stats, setStats] = useState<TeamStats | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<TeamDetail | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showAddMemberForm, setShowAddMemberForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({ name: '', description: '', manager: '', active: true })
  const [memberData, setMemberData] = useState({ name: '', email: '', role: '' })

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/teams')
        if (response.ok) {
          const data = await response.json()
          setTeams(data)
        }
        const statsResponse = await fetch('/api/teams/statistics/summary')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }
      } catch (err) {
        setError('Failed to fetch teams')
      } finally {
        setLoading(false)
      }
    }
    fetchTeams()
  }, [])

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        setFormData({ name: '', description: '', manager: '', active: true })
        setShowCreateForm(false)
        // Refresh teams
        const res = await fetch('/api/teams')
        if (res.ok) setTeams(await res.json())
      }
    } catch (err) {
      setError('Failed to create team')
    }
  }

  const handleSelectTeam = async (teamId: string) => {
    try {
      const response = await fetch(`/api/teams/${teamId}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedTeam(data)
      }
    } catch (err) {
      setError('Failed to fetch team details')
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTeam) return
    try {
      const response = await fetch(`/api/teams/${selectedTeam.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      })
      if (response.ok) {
        setMemberData({ name: '', email: '', role: '' })
        setShowAddMemberForm(false)
        // Refresh team details
        const res = await fetch(`/api/teams/${selectedTeam.id}`)
        if (res.ok) setSelectedTeam(await res.json())
      }
    } catch (err) {
      setError('Failed to add team member')
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!selectedTeam) return
    try {
      const response = await fetch(`/api/teams/${selectedTeam.id}/members/${memberId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        // Refresh team details
        const res = await fetch(`/api/teams/${selectedTeam.id}`)
        if (res.ok) setSelectedTeam(await res.json())
      }
    } catch (err) {
      setError('Failed to remove team member')
    }
  }

  const handleDeleteTeam = async (teamId: string) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        const response = await fetch(`/api/teams/${teamId}`, { method: 'DELETE' })
        if (response.ok) {
          setSelectedTeam(null)
          const res = await fetch('/api/teams')
          if (res.ok) setTeams(await res.json())
        }
      } catch (err) {
        setError('Failed to delete team')
      }
    }
  }

  if (loading) return <div className="p-8">Loading teams...</div>

  return (
    <div className="p-8 bg-white">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Icons.Users className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Create Team
        </button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-gray-600 text-sm">Total Teams</div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalTeams}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-gray-600 text-sm">Total Members</div>
            <div className="text-2xl font-bold text-green-600">{stats.totalMembers}</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-gray-600 text-sm">Jobs Completed</div>
            <div className="text-2xl font-bold text-purple-600">{stats.totalJobsCompleted}</div>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <div className="text-gray-600 text-sm">Total Revenue</div>
            <div className="text-2xl font-bold text-amber-600">${(stats.totalRevenue / 1000).toFixed(1)}K</div>
          </div>
        </div>
      )}

      {/* Create Team Form */}
      {showCreateForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Create New Team</h2>
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Team Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="p-2 border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                placeholder="Manager Name"
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <textarea
              placeholder="Team Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              rows={2}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-gray-700">Active Team</label>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Create Team
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-3 gap-8">
        {/* Teams List */}
        <div className="col-span-1">
          <h2 className="text-xl font-bold mb-4">Teams</h2>
          <div className="space-y-2">
            {teams.map((team) => (
              <div
                key={team.id}
                onClick={() => handleSelectTeam(team.id)}
                className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedTeam?.id === team.id ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900">{team.name}</div>
                <div className="text-sm text-gray-600">{team.memberCount} members</div>
                <div className="text-xs text-gray-500">{team.manager}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Details */}
        {selectedTeam && (
          <div className="col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedTeam.name}</h2>
              <button
                onClick={() => handleDeleteTeam(selectedTeam.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Team
              </button>
            </div>

            {/* Team Info */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Manager</div>
                  <div className="font-semibold text-gray-900">{selectedTeam.manager}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Members</div>
                  <div className="font-semibold text-gray-900">{selectedTeam.memberCount}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Budget Used</div>
                  <div className="font-semibold text-gray-900">${selectedTeam.budgetUsed}/${selectedTeam.budget}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Revenue</div>
                  <div className="font-semibold text-gray-900">${selectedTeam.revenue}</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-600">Description</div>
                <div className="text-gray-900">{selectedTeam.description}</div>
              </div>
            </div>

            {/* Members */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Team Members</h3>
                <button
                  onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  + Add Member
                </button>
              </div>

              {showAddMemberForm && (
                <form onSubmit={handleAddMember} className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Member Name"
                      value={memberData.name}
                      onChange={(e) => setMemberData({ ...memberData, name: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={memberData.email}
                      onChange={(e) => setMemberData({ ...memberData, email: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Role (e.g., Lead Technician)"
                      value={memberData.role}
                      onChange={(e) => setMemberData({ ...memberData, role: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Add Member
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddMemberForm(false)}
                        className="flex-1 px-3 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {selectedTeam.members.map((member) => (
                  <div key={member.memberId} className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-600">{member.email}</div>
                      <div className="text-xs text-gray-500">{member.role}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(member.memberId)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamManagementPage
