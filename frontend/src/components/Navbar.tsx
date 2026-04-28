import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }
  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="glass border-b border-cinema-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cinema-red rounded-lg flex items-center justify-center text-white font-black text-sm">IC</div>
            <span className="font-black text-xl tracking-tight">
              <span className="text-white">IRAM</span>
              <span className="text-cinema-red"> CINEMA</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-cinema-red' : 'text-gray-400 hover:text-white'}`}>Главная</Link>
            <Link to="/movies" className={`text-sm font-medium transition-colors ${isActive('/movies') ? 'text-cinema-red' : 'text-gray-400 hover:text-white'}`}>Фильмы</Link>
            <Link to="/individual" className={`text-sm font-medium transition-colors ${isActive('/individual') ? 'text-cinema-red' : 'text-gray-400 hover:text-white'}`}>Индивидуальный</Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="text-sm font-medium text-cinema-gold hover:text-yellow-400 transition-colors">Админ</Link>
            )}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-cinema-red rounded-full flex items-center justify-center text-white font-semibold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-cinema-red transition-colors">Выйти</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Войти</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Регистрация</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-cinema-border space-y-3">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-300 hover:text-white py-1">Главная</Link>
            <Link to="/movies" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-300 hover:text-white py-1">Фильмы</Link>
            <Link to="/individual" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-300 hover:text-white py-1">Индивидуальный</Link>
            {user?.role === 'ADMIN' && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block text-sm text-cinema-gold py-1">Админ</Link>}
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-300 hover:text-white py-1">Профиль</Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="block text-sm text-cinema-red">Выйти</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-300 py-1">Войти</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block text-sm text-cinema-red py-1">Регистрация</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
