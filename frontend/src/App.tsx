import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetail from './pages/MovieDetail'
import SessionBooking from './pages/SessionBooking'
import BookingConfirmation from './pages/BookingConfirmation'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import IndividualBooking from './pages/IndividualBooking'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import ManageMovies from './pages/admin/ManageMovies'
import ManageSessions from './pages/admin/ManageSessions'
import ManageBookings from './pages/admin/ManageBookings'
import ManageIndividualBookings from './pages/admin/ManageIndividualBookings'

function ProtectedRoute({ children, admin }: { children: JSX.Element; admin?: boolean }) {
  const { user, token } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (admin && user?.role !== 'ADMIN') return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { token, fetchMe } = useAuthStore()

  useEffect(() => {
    if (token) fetchMe()
  }, [token])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/sessions/:id/book" element={
            <ProtectedRoute><SessionBooking /></ProtectedRoute>
          } />
          <Route path="/bookings/:id" element={
            <ProtectedRoute><BookingConfirmation /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/individual" element={<IndividualBooking />} />
          <Route path="/admin" element={
            <ProtectedRoute admin><AdminLayout /></ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="movies" element={<ManageMovies />} />
            <Route path="sessions" element={<ManageSessions />} />
            <Route path="bookings" element={<ManageBookings />} />
            <Route path="individual-bookings" element={<ManageIndividualBookings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
