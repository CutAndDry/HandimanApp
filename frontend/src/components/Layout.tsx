import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../hooks/useRedux'
import { logout } from '../store/authSlice'
import { Icons } from './Icons'
import './Layout.css'

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="layout">
      {isAuthenticated && (
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <h2>HandimanApp</h2>
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Icons.Menu className="sidebar-menu-icon" />
            </button>
          </div>

          <nav className="sidebar-nav">
            <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
              <Icons.BarChart className="nav-icon" />
              <span className="nav-text">Dashboard</span>
            </Link>
            <Link to="/jobs" className={`nav-item ${isActive('/jobs') ? 'active' : ''}`}>
              <Icons.Wrench className="nav-icon" />
              <span className="nav-text">Jobs</span>
            </Link>
            <Link to="/calendar" className={`nav-item ${isActive('/calendar') ? 'active' : ''}`}>
              <Icons.Calendar className="nav-icon" />
              <span className="nav-text">Calendar</span>
            </Link>
            <Link to="/invoices" className={`nav-item ${isActive('/invoices') ? 'active' : ''}`}>
              <Icons.FileText className="nav-icon" />
              <span className="nav-text">Invoices</span>
            </Link>
            <Link to="/customers" className={`nav-item ${isActive('/customers') ? 'active' : ''}`}>
              <Icons.Users className="nav-icon" />
              <span className="nav-text">Customers</span>
            </Link>
            <Link to="/settings" className={`nav-item ${isActive('/settings') ? 'active' : ''}`}>
              <Icons.Settings className="nav-icon" />
              <span className="nav-text">Settings</span>
            </Link>
          </nav>

          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">{user?.email?.[0].toUpperCase() || 'U'}</div>
              <div className="user-details">
                <p className="user-email">{user?.email}</p>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <Icons.LogOut className="logout-icon" />
              Logout
            </button>
          </div>
        </aside>
      )}

      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <h1>HandimanApp</h1>
          </div>
          <div className="header-right">
            <div className="breadcrumb">
              {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/' && (
                <p>{location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(2)}</p>
              )}
            </div>
          </div>
        </header>

        <main className="main">
          <Outlet />
        </main>

        <footer className="footer">
          <p>&copy; 2026 HandimanApp. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}

export default Layout
