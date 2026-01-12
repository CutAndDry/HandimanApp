import React from 'react'
import { Outlet } from 'react-router-dom'
import './Layout.css'

const Layout: React.FC = () => {
  return (
    <div className="layout">
      <header className="header">
        <h1>HandimanApp</h1>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
