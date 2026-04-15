import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import api from '../../api/axios'
import { Booking } from '../../types'

export default function ManageBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    api.get('/bookings/admin/all').then(r => { setBookings(r.data); setLoading(false) })
  }, [])

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter)

  const statusColor: Record<string, string> = {
    CONFIRMED: 'bg-green-900/30 text-green-400 border-green-800',
    PENDING: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
    CANCELLED: 'bg-red-900/30 text-red-400 border-red-800',
  }
  const statusLabel: Record<string, string> = { CONFIRMED: 'Подтверждено', PENDING: 'Ожидает', CANCELLED: 'Отменено' }

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-lg font-bold text-white">Бронирования ({filtered.length})</h2>
        <div className="flex gap-2">
          {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === f ? 'bg-cinema-red text-white' : 'border border-cinema-border text-gray-400 hover:text-white'
              }`}>
              {f === 'ALL' ? 'Все' : statusLabel[f]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Загрузка...</div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center text-gray-500">Нет бронирований</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(b => (
            <div key={b.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-sm">{b.session?.movie?.titleRu}</span>
                    <span className={`badge border text-xs ${statusColor[b.status] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                      {statusLabel[b.status] || b.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {b.session?.startTime && format(new Date(b.session.startTime), 'dd MMM yyyy HH:mm', { locale: ru })} · {b.session?.hall?.name}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    👤 {(b as any).user?.name} ({(b as any).user?.email})
                  </p>
                  <p className="text-xs text-gray-600">
                    Места: {b.tickets?.map(t => `р.${t.seat?.row} м.${t.seat?.number}`).join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-cinema-gold font-bold">{b.total} сом.</p>
                  <p className="text-xs text-gray-600 mt-1">#{b.id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-600">{b.tickets?.length} билет(а)</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
