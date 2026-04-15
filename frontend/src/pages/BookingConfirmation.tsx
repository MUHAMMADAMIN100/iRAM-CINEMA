import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import api from '../api/axios'
import { Booking } from '../types'
import { optimizePoster } from '../utils/image'

export default function BookingConfirmation() {
  const { id } = useParams<{ id: string }>()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) api.get(`/bookings/${id}`).then(r => { setBooking(r.data); setLoading(false) })
  }, [id])

  if (loading) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="inline-block w-8 h-8 border-2 border-cinema-red border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!booking) return <div className="text-center py-20 text-gray-500">Бронирование не найдено</div>

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-900/30 border border-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <h1 className="text-2xl font-black text-white mb-2">Бронирование подтверждено!</h1>
        <p className="text-gray-500 text-sm">Покажите QR-код на кассе при входе</p>
      </div>

      {/* Booking info */}
      <div className="card p-6 mb-4">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-cinema-border">
          {booking.session.movie.poster && (
            <img src={optimizePoster(booking.session.movie.poster, 200)} alt="" referrerPolicy="no-referrer" className="w-14 h-20 object-cover rounded-lg" />
          )}
          <div>
            <h2 className="font-bold text-white">{booking.session.movie.titleRu}</h2>
            <p className="text-sm text-gray-400 mt-1">
              {format(new Date(booking.session.startTime), 'dd MMMM yyyy', { locale: ru })}
            </p>
            <p className="text-sm text-gray-400">
              {format(new Date(booking.session.startTime), 'HH:mm')} · {booking.session.hall.name}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {booking.tickets.map(ticket => (
            <div key={ticket.id} className="flex justify-between text-sm">
              <span className="text-gray-400">Ряд {ticket.seat.row}, место {ticket.seat.number}</span>
              <span className="text-white">{booking.session.price} сом.</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold pt-3 border-t border-cinema-border">
          <span className="text-white">Итого</span>
          <span className="text-cinema-gold">{booking.total} сом.</span>
        </div>
      </div>

      {/* QR codes */}
      {booking.tickets.map((ticket, i) => ticket.qrCode && (
        <div key={ticket.id} className="card p-6 mb-3 text-center">
          <p className="text-xs text-gray-500 mb-3">Билет {i + 1} — Ряд {ticket.seat.row}, место {ticket.seat.number}</p>
          <img src={ticket.qrCode} alt="QR Code" className="w-40 h-40 mx-auto rounded-xl" />
          <p className="text-xs text-gray-600 mt-2">#{ticket.id.slice(-8).toUpperCase()}</p>
        </div>
      ))}

      <div className="flex gap-3 mt-6">
        <Link to="/profile" className="btn-outline flex-1 text-center text-sm py-3">Мои билеты</Link>
        <Link to="/movies" className="btn-primary flex-1 text-center text-sm py-3">К фильмам</Link>
      </div>
    </div>
  )
}
