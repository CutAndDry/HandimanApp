import { useState, useEffect } from 'react'
import { MessageSquare, Send, Trash2, Filter } from 'lucide-react'

interface Message {
  id: string
  message: string
  senderType: string
  attachmentUrl?: string
  createdAt: string
  customerName: string
  technicianEmail?: string
}

interface MessageStats {
  totalMessages: number
  sentMessages: number
  receivedMessages: number
  systemMessages: number
  jobsWithMessages: number
  averageMessagesPerJob: number
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [stats, setStats] = useState<MessageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedJobId, setSelectedJobId] = useState<string>('')
  const [messageText, setMessageText] = useState('')
  const [jobs, setJobs] = useState<Array<{ id: string; title: string }>>([])
  const [senderFilter, setSenderFilter] = useState<string>('all')

  useEffect(() => {
    fetchStats()
    fetchJobs()
  }, [])

  useEffect(() => {
    if (selectedJobId) {
      fetchMessages(selectedJobId)
    }
  }, [selectedJobId, senderFilter])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data.slice(0, 10))
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  const fetchMessages = async (jobId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/chat-messages/job/${jobId}`)
      if (response.ok) {
        let data = await response.json()
        if (senderFilter !== 'all') {
          data = data.filter((m: Message) => m.senderType === senderFilter)
        }
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/chat-messages/statistics/summary')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJobId || !messageText.trim()) return

    try {
      const response = await fetch('/api/chat-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: selectedJobId,
          message: messageText,
          senderType: 'customer'
        })
      })

      if (response.ok) {
        setMessageText('')
        if (selectedJobId) {
          fetchMessages(selectedJobId)
          fetchStats()
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return

    try {
      const response = await fetch(`/api/chat-messages/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setMessages(messages.filter(m => m.id !== id))
        if (selectedJobId) {
          fetchStats()
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const getSenderColor = (senderType: string) => {
    const colors: { [key: string]: string } = {
      'customer': 'bg-blue-100 text-blue-900',
      'technician': 'bg-green-100 text-green-900',
      'system': 'bg-gray-100 text-gray-900'
    }
    return colors[senderType] || 'bg-gray-100 text-gray-900'
  }

  const getSenderIcon = (senderType: string) => {
    const icons: { [key: string]: string } = {
      'customer': '👤',
      'technician': '🔧',
      'system': '⚙️'
    }
    return icons[senderType] || '📬'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
          <MessageSquare className="w-10 h-10 text-blue-600" />
          Messages
        </h1>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="text-gray-500 text-xs font-medium">Total</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalMessages}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="text-gray-500 text-xs font-medium">Sent</div>
            <div className="text-2xl font-bold text-gray-900">{stats.sentMessages}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <div className="text-gray-500 text-xs font-medium">Received</div>
            <div className="text-2xl font-bold text-gray-900">{stats.receivedMessages}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
            <div className="text-gray-500 text-xs font-medium">System</div>
            <div className="text-2xl font-bold text-gray-900">{stats.systemMessages}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500">
            <div className="text-gray-500 text-xs font-medium">Jobs</div>
            <div className="text-2xl font-bold text-gray-900">{stats.jobsWithMessages}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-pink-500">
            <div className="text-gray-500 text-xs font-medium">Avg/Job</div>
            <div className="text-2xl font-bold text-gray-900">{stats.averageMessagesPerJob.toFixed(1)}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Job</h2>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4"
          >
            <option value="">Choose a job to view messages...</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>

          {selectedJobId && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter by Sender
                </label>
                <select
                  value={senderFilter}
                  onChange={(e) => setSenderFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Messages</option>
                  <option value="customer">My Messages</option>
                  <option value="technician">Technician</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="lg:col-span-2 space-y-4">
          {!selectedJobId ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Select a job to view messages</p>
            </div>
          ) : (
            <>
              {/* Messages List */}
              <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-96">
                {loading ? (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    No messages yet
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.senderType === 'customer' ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <div className={`px-3 py-1 rounded text-xs font-semibold ${getSenderColor(message.senderType)} flex-shrink-0 w-6 h-6 flex items-center justify-center`}>
                          {getSenderIcon(message.senderType)[0]}
                        </div>
                        <div className={`flex-1 max-w-xs`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-600">
                              {message.senderType === 'customer' ? 'You' : message.customerName}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className={`${getSenderColor(message.senderType)} rounded-lg p-3`}>
                            <p className="text-sm break-words">{message.message}</p>
                          </div>
                        </div>
                        {message.senderType === 'customer' && (
                          <button
                            onClick={() => handleDeleteMessage(message.id)}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Send Message Form */}
              <form onSubmit={handleSendMessage} className="bg-white rounded-lg shadow p-4 flex gap-3">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatPage
