import { useState, useEffect } from 'react'
import { Package, Plus, Minus, Trash2, Filter, AlertTriangle } from 'lucide-react'

interface InventoryItem {
  id: string
  name: string
  category: string
  description: string
  quantityOnHand: number
  reorderLevel: number
  unitPrice: number
  unit: string
  totalValue: number
  isLowStock: boolean
}

interface InventoryStats {
  totalItems: number
  totalValue: number
  averageItemValue: number
  lowStockCount: number
  categoriesCount: number
  categoryBreakdown: Array<{ category: string; itemCount: number; totalValue: number }>
  topItems: Array<{ name: string; category: string; quantityOnHand: number; value: number }>
}

export function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [stats, setStats] = useState<InventoryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [lowStockOnly, setLowStockOnly] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    quantityOnHand: 0,
    reorderLevel: 0,
    unitPrice: 0,
    unit: 'pcs'
  })
  const [adjustItemId, setAdjustItemId] = useState<string | null>(null)
  const [adjustmentQty, setAdjustmentQty] = useState(0)

  useEffect(() => {
    fetchItems()
    fetchStats()
  }, [categoryFilter, lowStockOnly])

  const fetchItems = async () => {
    try {
      setLoading(true)
      let url = '/api/inventory'
      const params = new URLSearchParams()
      if (categoryFilter !== 'all') params.append('category', categoryFilter)
      if (lowStockOnly) params.append('lowStockOnly', 'true')
      if (params.toString()) url += '?' + params.toString()

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Error fetching inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/inventory/statistics/summary')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.category) {
      alert('Name and category are required')
      return
    }

    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowForm(false)
        setFormData({
          name: '',
          category: '',
          description: '',
          quantityOnHand: 0,
          reorderLevel: 0,
          unitPrice: 0,
          unit: 'pcs'
        })
        fetchItems()
        fetchStats()
      }
    } catch (error) {
      console.error('Error creating item:', error)
    }
  }

  const handleAdjustQuantity = async (id: string) => {
    if (adjustmentQty === 0) return

    try {
      const response = await fetch(`/api/inventory/${id}/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adjustmentQuantity: adjustmentQty })
      })

      if (response.ok) {
        setAdjustItemId(null)
        setAdjustmentQty(0)
        fetchItems()
        fetchStats()
      }
    } catch (error) {
      console.error('Error adjusting quantity:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this inventory item?')) return

    try {
      const response = await fetch(`/api/inventory/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setItems(items.filter(item => item.id !== id))
        fetchStats()
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const categories = stats?.categoryBreakdown.map(c => c.category) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
          <Package className="w-10 h-10 text-indigo-600" />
          Inventory Management
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Add Item'}
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
            <div className="text-gray-500 text-sm font-medium">Total Items</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{stats.totalItems}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="text-gray-500 text-sm font-medium">Total Value</div>
            <div className="text-3xl font-bold text-green-600 mt-2">${stats.totalValue}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="text-gray-500 text-sm font-medium">Avg Item Value</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">${stats.averageItemValue}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="text-gray-500 text-sm font-medium">Categories</div>
            <div className="text-3xl font-bold text-orange-600 mt-2">{stats.categoriesCount}</div>
          </div>
          <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${stats.lowStockCount > 0 ? 'border-red-500' : 'border-green-500'}`}>
            <div className="text-gray-500 text-sm font-medium">Low Stock Items</div>
            <div className={`text-3xl font-bold mt-2 ${stats.lowStockCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {stats.lowStockCount}
            </div>
          </div>
        </div>
      )}

      {/* Add Item Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Add Inventory Item</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Tools, Parts, Supplies"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                <input
                  type="number"
                  value={formData.quantityOnHand}
                  onChange={(e) => setFormData({ ...formData, quantityOnHand: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reorder Level</label>
                <input
                  type="number"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="pcs, box, etc."
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Add Item
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={lowStockOnly}
                onChange={(e) => setLowStockOnly(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Show Low Stock Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading inventory...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No items in inventory</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className={`bg-white rounded-lg shadow p-6 border-l-4 ${item.isLowStock ? 'border-red-500' : 'border-gray-300'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                    {item.isLowStock && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                        <AlertTriangle className="w-3 h-3" />
                        Low Stock
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.category}</p>
                  {item.description && <p className="text-sm text-gray-600 mb-3">{item.description}</p>}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">On Hand</p>
                      <p className="text-lg font-bold text-gray-900">{item.quantityOnHand} {item.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Reorder Level</p>
                      <p className="text-lg font-bold text-gray-900">{item.reorderLevel} {item.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Unit Price</p>
                      <p className="text-lg font-bold text-gray-900">${item.unitPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Value</p>
                      <p className="text-lg font-bold text-indigo-600">${item.totalValue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {adjustItemId === item.id ? (
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => setAdjustmentQty(Math.max(adjustmentQty - 1, 0))}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        value={adjustmentQty}
                        onChange={(e) => setAdjustmentQty(parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                      />
                      <button
                        onClick={() => setAdjustmentQty(adjustmentQty + 1)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAdjustQuantity(item.id)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setAdjustItemId(null)
                          setAdjustmentQty(0)
                        }}
                        className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setAdjustItemId(item.id)
                          setAdjustmentQty(0)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                        title="Adjust quantity"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default InventoryPage
