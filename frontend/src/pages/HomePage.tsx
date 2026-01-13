import React from 'react'
import { Link } from 'react-router-dom'
import { Icons } from '@/components/Icons'

const HomePage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16 lg:py-24">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-20">
          <div className="inline-block mb-4 sm:mb-6">
            <span className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700">
              Professional Trade Business Management
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            Manage Your Trade Business <span className="text-blue-600">Effortlessly</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto px-2 leading-relaxed">
            All-in-one platform to track jobs, manage customers, send invoices, and monitor payments. Built for modern tradespeople.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
            >
              Get Started Now
            </Link>
            <Link 
              to="/signup" 
              className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-blue-600 font-bold py-3 px-8 rounded-lg transition duration-200 border-2 border-gray-300"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
          <div className="group bg-white p-8 sm:p-10 rounded-lg shadow hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition text-gray-700">
              <Icons.Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Job Management</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Track and manage all your jobs in one place with real-time status updates and material tracking.</p>
          </div>

          <div className="group bg-white p-8 sm:p-10 rounded-lg shadow hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition text-gray-700">
              <Icons.DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Invoice Tracking</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Generate professional invoices, track payments, and send them automatically via email.</p>
          </div>

          <div className="group bg-white p-8 sm:p-10 rounded-lg shadow hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition text-gray-700">
              <Icons.Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Customer Management</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Organize customer details, contact information, and complete job history in one place.</p>
          </div>

          <div className="group bg-white p-8 sm:p-10 rounded-lg shadow hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition text-gray-700">
              <Icons.BarChart className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Analytics Dashboard</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">View real-time dashboards with key metrics like revenue, pending jobs, and payments.</p>
          </div>

          <div className="group bg-white p-8 sm:p-10 rounded-lg shadow hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-600 group-hover:text-white transition text-gray-700">
              <Icons.Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Time Tracking</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Track labor hours on jobs with a built-in timer for accurate billing and invoicing.</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 sm:mt-20 bg-blue-600 rounded-lg shadow p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">Ready to Transform Your Business?</h2>
          <p className="text-base sm:text-lg text-blue-100 mb-8 max-w-2xl mx-auto">Start managing your trade business more efficiently today. Sign up in minutes and get immediate access to all features.</p>
          <Link 
            to="/signup" 
            className="inline-flex items-center justify-center bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-lg transition duration-200"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
