import React from 'react'
import { Link } from 'react-router-dom'

const HomePage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16 lg:py-24">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Welcome to <span className="text-blue-600">HandimanApp</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
            Manage your trades business efficiently with our mobile-first platform. Track jobs, invoices, customers, and payments all in one place.
          </p>
          <Link 
            to="/dashboard" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🔧</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Job Management</h3>
            <p className="text-sm sm:text-base text-gray-600">Track and manage all your jobs in one place with status updates and materials.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💰</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Invoice Tracking</h3>
            <p className="text-sm sm:text-base text-gray-600">Generate professional invoices, track payments, and send via email automatically.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">👥</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Customer Mgmt</h3>
            <p className="text-sm sm:text-base text-gray-600">Organize customer details, contact information, and job history in one database.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📊</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Analytics</h3>
            <p className="text-sm sm:text-base text-gray-600">View real-time dashboards with key metrics like revenue, pending jobs, and invoices.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📅</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Calendar View</h3>
            <p className="text-sm sm:text-base text-gray-600">See all your jobs on a calendar with color-coded status for quick planning.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⏱️</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Time Tracking</h3>
            <p className="text-sm sm:text-base text-gray-600">Track labor hours on each job with a built-in timer for accurate billing.</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Getting Started</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">All set to get started? Head to your dashboard to begin managing your business.</p>
          <Link 
            to="/dashboard" 
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition duration-200"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
