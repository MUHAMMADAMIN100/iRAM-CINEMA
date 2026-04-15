import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

interface Stats {
  totalBookings: number
  totalRevenue: number
  todayBookings: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [movies, setMovies] = useState<number>(0)
  const [sessions, setSessions] = useState<number>(0)

  useEffect(() => {
    api.get('/bookings/stats').then(r => setStats(r.data)).catch(() => {})
    api.get('/movies').then(r => setMovies(r.data.length)).catch(() => {})
    api.get('/sessions').then(r => setSessions(r.data.length)).catch(() => {})
  }, [])

  const cards = [
    { label: 'Бронирований всего', value: stats?.totalBookings ?? '—', icon: '🎫', color: 'text-green-400' },
    { label: 'Выручка (сом.)', value: stats?.totalRevenue ? `${stats.totalRevenue.toLocaleString()}` : '—', icon: '💰', color: 'text-cinema-gold' },
    { label: 'Сегодня', value: stats?.todayBookings ?? '—', icon: '📅', color: 'text-blue-400' },
    { label: 'Фильмов в каталоге', value: movies || '—', icon: '🎬', color: 'text-cinema-red' },
    { label: 'Активных сеансов', value: sessions || '—', icon: '🕐', color: 'text-purple-400' },
  ]

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-5">Статистика</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{c.icon}</span>
              <span className={`text-2xl font-black ${c.color}`}>{c.value}</span>
            </div>
            <p className="text-sm text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h3 className="font-bold text-white mb-3">Быстрые действия</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: '/admin/movies', label: '+ Добавить фильм' },
            { href: '/admin/sessions', label: '+ Создать сеанс' },
            { href: '/admin/bookings', label: '📋 Все бронирования' },
            { href: '/movies', label: '🎬 Открыть сайт' },
          ].map(a => (
            <Link key={a.label} to={a.href}
              className="card hover:border-cinema-red transition-colors p-3 text-sm text-gray-400 hover:text-white text-center">
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
