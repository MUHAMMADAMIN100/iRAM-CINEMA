import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/admin', label: '📊 Дашборд', end: true },
  { to: '/admin/movies', label: '🎬 Фильмы' },
  { to: '/admin/sessions', label: '🕐 Сеансы' },
  { to: '/admin/bookings', label: '🎫 Бронирования' },
  { to: '/admin/individual-bookings', label: '🎉 Индивидуальные' },
]

export default function AdminLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">
          <span className="text-cinema-gold">👑</span> Панель администратора
        </h1>
        <p className="text-gray-500 text-sm mt-1">IRAM CINEMA Management</p>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-48 flex-shrink-0">
          <nav className="card p-2 space-y-1">
            {links.map(l => (
              <NavLink
                key={l.to} to={l.to} end={l.end}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-cinema-red text-white' : 'text-gray-400 hover:text-white hover:bg-cinema-border'
                  }`
                }
              >{l.label}</NavLink>
            ))}
          </nav>
        </aside>
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
