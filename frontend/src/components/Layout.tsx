import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../hooks/useRedux'
import { logout } from '../store/authSlice'
import { Icons } from './Icons'
import './Layout.css'

interface NavGroup {
  title: string
  icon: React.ReactNode
  items: Array<{
    path: string
    label: string
    icon: React.ReactNode
  }>
}

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['main-features']))
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
  }

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  const isActive = (path: string) => location.pathname === path

  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false)
    }
  }

  const navGroups: NavGroup[] = [
    {
      title: 'Main Features',
      icon: <Icons.Home className="group-icon" />,
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: <Icons.BarChart /> },
        { path: '/jobs', label: 'Jobs', icon: <Icons.Wrench /> },
        { path: '/calendar', label: 'Calendar', icon: <Icons.Calendar /> },
        { path: '/invoices', label: 'Invoices', icon: <Icons.FileText /> },
        { path: '/customers', label: 'Customers', icon: <Icons.Users /> },
        { path: '/bookings', label: 'Bookings', icon: <Icons.Calendar /> },
        { path: '/leads', label: 'Leads', icon: <Icons.TrendingUp /> },
      ]
    },
    {
      title: 'Operations',
      icon: <Icons.Wrench className="group-icon" />,
      items: [
        { path: '/scheduling', label: 'Scheduling', icon: <Icons.Calendar /> },
        { path: '/service-areas', label: 'Service Areas', icon: <Icons.MapPin /> },
        { path: '/technicians', label: 'Technicians', icon: <Icons.Users /> },
        { path: '/time-entries', label: 'Time Entries', icon: <Icons.Clock /> },
        { path: '/photos', label: 'Photos', icon: <Icons.Camera /> },
      ]
    },
    {
      title: 'Financial',
      icon: <Icons.DollarSign className="group-icon" />,
      items: [
        { path: '/payments', label: 'Payments', icon: <Icons.CreditCard /> },
        { path: '/job-costing', label: 'Job Costing', icon: <Icons.TrendingDown /> },
        { path: '/inventory', label: 'Inventory', icon: <Icons.Package /> },
      ]
    },
    {
      title: 'Analytics',
      icon: <Icons.BarChart3 className="group-icon" />,
      items: [
        { path: '/notifications', label: 'Notifications', icon: <Icons.Bell /> },
        { path: '/messages', label: 'Messages', icon: <Icons.MessageSquare /> },
        { path: '/reviews', label: 'Reviews', icon: <Icons.Star /> },
        { path: '/analytics', label: 'Analytics', icon: <Icons.BarChart3 /> },
      ]
    },
    {
      title: 'Business Tools',
      icon: <Icons.Zap className="group-icon" />,
      items: [
        { path: '/pricing', label: 'Dynamic Pricing', icon: <Icons.TrendingUp /> },
        { path: '/automation', label: 'Automation', icon: <Icons.Zap /> },
      ]
    },
    {
      title: 'Admin',
      icon: <Icons.Settings className="group-icon" />,
      items: [
        { path: '/teams', label: 'Teams', icon: <Icons.Users /> },
        { path: '/roles', label: 'Roles', icon: <Icons.Shield /> },
        { path: '/integrations', label: 'Integrations', icon: <Icons.Plug /> },
        { path: '/settings', label: 'Settings', icon: <Icons.Settings /> },
      ]
    },
  ]

  return (
    <div className="layout">
      {isAuthenticated && (
        <>
          {sidebarOpen && window.innerWidth <= 768 && (
            <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
          )}
          <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
              <h2>HandimanApp</h2>
              <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Icons.Menu className="sidebar-menu-icon" />
              </button>
            </div>

            <nav className="sidebar-nav">
              {navGroups.map((group, idx) => {
                const groupId = `group-${idx}`
                const isExpanded = expandedGroups.has(groupId)
                return (
                  <div key={groupId} className="nav-group">
                    <button
                      className="nav-group-header"
                      onClick={() => toggleGroup(groupId)}
                    >
                      {group.icon}
                      <span className="group-title">{group.title}</span>
                      <Icons.ChevronDown className={`chevron ${isExpanded ? 'expanded' : ''}`} />
                    </button>
                    {isExpanded && (
                      <div className="nav-group-items">
                        {group.items.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                            onClick={closeSidebar}
                          >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-text">{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
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
        </>
      )}

      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Icons.Menu className="mobile-menu-icon" />
            </button>
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
