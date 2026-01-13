import React, { useEffect, useState } from 'react'
import { Icons } from '../components/Icons'

interface Permission {
  id: string
  name: string
  category: string
  description?: string
}

interface Role {
  id: string
  name: string
  description: string
  level: number
  userCount: number
  permissions: Permission[]
  createdAt: string
}

interface RoleStats {
  totalRoles: number
  totalUsers: number
  totalPermissions: number
  rolesWithCustomPermissions: number
  averagePermissionsPerRole: number
}

const RoleHierarchyPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([])
  const [stats, setStats] = useState<RoleStats | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({ name: '', description: '', level: 0, selectedPermissions: [] as string[] })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const rolesResponse = await fetch('/api/roles')
        if (rolesResponse.ok) {
          const rolesData = await rolesResponse.json()
          setRoles(rolesData)
          if (rolesData.length > 0) setSelectedRole(rolesData[0])
        }
        const permissionsResponse = await fetch('/api/roles/permissions/available')
        if (permissionsResponse.ok) {
          const permsData = await permissionsResponse.json()
          setAvailablePermissions(permsData)
        }
        const statsResponse = await fetch('/api/roles/statistics/summary')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }
      } catch (err) {
        setError('Failed to fetch roles')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          level: formData.level,
          permissions: formData.selectedPermissions
        })
      })
      if (response.ok) {
        setFormData({ name: '', description: '', level: 0, selectedPermissions: [] })
        setShowCreateForm(false)
        const res = await fetch('/api/roles')
        if (res.ok) setRoles(await res.json())
      }
    } catch (err) {
      setError('Failed to create role')
    }
  }

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role)
  }

  const handleDeleteRole = async () => {
    if (!selectedRole || !window.confirm(`Are you sure you want to delete the "${selectedRole.name}" role?`)) {
      return
    }
    try {
      const response = await fetch(`/api/roles/${selectedRole.id}`, { method: 'DELETE' })
      if (response.ok) {
        setSelectedRole(null)
        const res = await fetch('/api/roles')
        if (res.ok) setRoles(await res.json())
      }
    } catch (err) {
      setError('Failed to delete role')
    }
  }

  const togglePermission = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedPermissions: prev.selectedPermissions.includes(permissionId)
        ? prev.selectedPermissions.filter((id) => id !== permissionId)
        : [...prev.selectedPermissions, permissionId]
    }))
  }

  if (loading) return <div className="p-8">Loading roles...</div>

  const permissionsByCategory = availablePermissions.reduce(
    (acc, perm) => {
      if (!acc[perm.category]) acc[perm.category] = []
      acc[perm.category].push(perm)
      return acc
    },
    {} as Record<string, Permission[]>
  )

  return (
    <div className="p-8 bg-white">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Icons.Shield className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Role & Permissions</h1>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          + Create Role
        </button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-gray-600 text-sm">Total Roles</div>
            <div className="text-2xl font-bold text-purple-600">{stats.totalRoles}</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-gray-600 text-sm">Total Users</div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-gray-600 text-sm">Permissions</div>
            <div className="text-2xl font-bold text-green-600">{stats.totalPermissions}</div>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <div className="text-gray-600 text-sm">Avg Permissions</div>
            <div className="text-2xl font-bold text-amber-600">{stats.averagePermissionsPerRole}</div>
          </div>
          <div className="p-4 bg-pink-50 rounded-lg">
            <div className="text-gray-600 text-sm">Custom Roles</div>
            <div className="text-2xl font-bold text-pink-600">{stats.rolesWithCustomPermissions}</div>
          </div>
        </div>
      )}

      {/* Create Role Form */}
      {showCreateForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Create New Role</h2>
          <form onSubmit={handleCreateRole} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Role Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="p-2 border border-gray-300 rounded"
                required
              />
              <input
                type="number"
                placeholder="Hierarchy Level"
                min="1"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                className="p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <textarea
              placeholder="Role Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              rows={2}
            />

            {/* Permissions Selection */}
            <div>
              <h3 className="font-bold mb-3 text-gray-900">Select Permissions</h3>
              {Object.entries(permissionsByCategory).map(([category, perms]) => (
                <div key={category} className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">{category}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {perms.map((perm) => (
                      <label key={perm.id} className="flex items-center gap-2 text-gray-700">
                        <input
                          type="checkbox"
                          checked={formData.selectedPermissions.includes(perm.id)}
                          onChange={() => togglePermission(perm.id)}
                          className="w-4 h-4"
                        />
                        <span>{perm.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                Create Role
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

      <div className="grid grid-cols-4 gap-8">
        {/* Roles List */}
        <div className="col-span-1">
          <h2 className="text-xl font-bold mb-4">Roles</h2>
          <div className="space-y-2">
            {roles.map((role) => (
              <div
                key={role.id}
                onClick={() => handleSelectRole(role)}
                className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedRole?.id === role.id ? 'bg-purple-100 border-purple-500' : 'border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900">{role.name}</div>
                <div className="text-xs text-gray-500">Level {role.level}</div>
                <div className="text-xs text-gray-600">{role.userCount} users</div>
              </div>
            ))}
          </div>
        </div>

        {/* Role Details */}
        {selectedRole && (
          <div className="col-span-3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedRole.name}</h2>
              <button
                onClick={handleDeleteRole}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Role
              </button>
            </div>

            {/* Role Info */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Hierarchy Level</div>
                  <div className="text-2xl font-bold text-gray-900">{selectedRole.level}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Assigned Users</div>
                  <div className="text-2xl font-bold text-gray-900">{selectedRole.userCount}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Permissions</div>
                  <div className="text-2xl font-bold text-gray-900">{selectedRole.permissions.length}</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-600">Description</div>
                <div className="text-gray-900">{selectedRole.description}</div>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h3 className="text-lg font-bold mb-4">Assigned Permissions</h3>
              {selectedRole.permissions && selectedRole.permissions.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {selectedRole.permissions.map((perm) => (
                    <div key={perm.id} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="font-semibold text-gray-900">{perm.name}</div>
                      <div className="text-xs text-gray-600">{perm.category}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-gray-100 text-gray-600 rounded">No permissions assigned</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoleHierarchyPage
