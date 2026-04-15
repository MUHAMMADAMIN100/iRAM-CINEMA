import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuthStore } from '../store/authStore'
import { Booking } from '../types'

export default function Profile() {
  const { user } = useAuthStore()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeQr, setActiveQr] = useState<string | null>(null)

  useEffect(() => {
    api.get('/bookings/my').then(r => { setBookings(r.data); setLoading(false) })
  }, [])

  const cancelBooking = async (id: string) => {
    if (!confirm('Отменить бронирование?')) return
    try {
      await api.delete(`/bookings/${id}`)
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b))
      toast.success('Бронирование отменено')
    } catch { toast.error('Ошибка') }
  }

  const statusLabel = (s: string) => ({ CONFIRMED: '✅ Подтверждено', PENDING: '⏳ Ожидает', CANCELLED: '❌ Отменено' }[s] || s)
  const statusColor = (s: string) => ({ CONFIRMED: 'text-green-400', PENDING: 'text-yellow-400', CANCELLED: 'text-red-400' }[s] || 'text-gray-400')

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* User info */}
      <div className="card p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-cinema-red rounded-full flex items-center justify-center text-white font-black text-xl">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{user?.name}</h1>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className={`text-xs font-medium ${user?.role === 'ADMIN' ? 'text-cinema-gold' : 'text-gray-500'}`}>
              {user?.role === 'ADMIN' ? '👑 Администратор' : '👤 Пользователь'}
            </span>
          </div>
        </div>
      </div>

      {/* Bookings */}
      <h2 className="text-xl font-bold text-white mb-4">Мои билеты</h2>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="card h-24 animate-pulse" />)}
        </div>
      ) : bookings.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-3">🎫</div>
          <p className="text-gray-500">У вас пока нет билетов</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map(booking => (
            <div key={booking.id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white text-sm">{booking.session.movie.titleRu}</h3>
                    <span className={`text-xs font-medium ${statusColor(booking.status)}`}>
                      {statusLabel(booking.status)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {format(new Date(booking.session.startTime), 'dd MMMM yyyy, HH:mm', { locale: ru })} · {booking.session.hall.name}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Места: {booking.tickets.map(t => `р.${t.seat.row} м.${t.seat.number}`).join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cinema-gold font-bold text-sm">{booking.total} сом.</span>
                  {booking.status === 'CONFIRMED' && (
                    <>
                      <button
                        onClick={() => setActiveQr(activeQr === booking.id ? null : booking.id)}
                        className="text-xs text-gray-400 hover:text-white border border-cinema-border rounded-lg px-3 py-1.5 transition-colors"
                      >
                        QR
                      </button>
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="text-xs text-cinema-red hover:text-red-400 transition-colors"
                      >
                        Отменить
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* QR codes */}
              {activeQr === booking.id && (
                <div className="mt-4 pt-4 border-t border-cinema-border flex flex-wrap gap-4 justify-center">
                  {booking.tickets.map(t => t.qrCode && (
                    <div key={t.id} className="text-center">
                      <img src={t.qrCode} alt="QR" className="w-28 h-28 rounded-lg mx-auto" />
                      <p className="text-xs text-gray-600 mt-1">р.{t.seat.row} м.{t.seat.number}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
