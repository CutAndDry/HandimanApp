import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import JobsPage from './pages/JobsPage'
import JobDetailPage from './pages/JobDetailPage'
import CalendarPage from './pages/CalendarPage'
import InvoicesPage from './pages/InvoicesPage'
import CustomerPage from './pages/CustomerPage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import OnlineBookingPage from './pages/OnlineBookingPage'
import LeadPipelinePage from './pages/LeadPipelinePage'
import CustomerPortalPage from './pages/CustomerPortalPage'
import SchedulingPage from './pages/SchedulingPage'
import MapServiceAreasPage from './pages/MapServiceAreasPage'
import TechnicianManagementPage from './pages/TechnicianManagementPage'
import { PaymentsPage } from './pages/PaymentsPage'
import { JobCostingPage } from './pages/JobCostingPage'
import NotificationsPage from './pages/NotificationsPage'
import ReviewsPage from './pages/ReviewsPage'
import ChatPage from './pages/ChatPage'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/customers" element={<CustomerPage />} />
            <Route path="/customers/:customerId/portal" element={<CustomerPortalPage />} />
            <Route path="/bookings" element={<OnlineBookingPage />} />
            <Route path="/leads" element={<LeadPipelinePage />} />
            <Route path="/scheduling" element={<SchedulingPage />} />
            <Route path="/service-areas" element={<MapServiceAreasPage />} />
            <Route path="/technicians" element={<TechnicianManagementPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/job-costing" element={<JobCostingPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/messages" element={<ChatPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
