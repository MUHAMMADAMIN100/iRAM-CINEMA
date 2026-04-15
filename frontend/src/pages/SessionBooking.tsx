import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { Session, Seat } from '../types'
import SeatMap from '../components/SeatMap'

export default function SessionBooking() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [session, setSession] = useState<Session | null>(null)
  const [seats, setSeats] = useState<Seat[]>([])
  const [selected, setSelected] = useState<string[]>()
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([
      api.get(`/sessions/${id}`),
    ]).then(([sRes]) => {
      const s = sRes.data as Session
      setSession(s)
      return api.get(`/halls/${s.hallId}/seats/${id}`)
    }).then(r => {
      setSeats(r.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const toggleSeat = (seat: Seat) => {
    const status = seat.status || 'AVAILABLE'
    if (status === 'BOOKED' || status === 'RESERVED') return
    if (selectedSeats.find(s => s.id === seat.id)) {
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id))
    } else {
      setSelectedSeats(prev => [...prev, seat])
    }
  }

  const handleBook = async () => {
    if (!session || selectedSeats.length === 0) return
    setBooking(true)
    try {
      const { data } = await api.post('/bookings', {
        sessionId: session.id,
        seatIds: selectedSeats.map(s => s.id),
      })
      toast.success('Бронирование успешно!')
      navigate(`/bookings/${data.id}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Ошибка бронирования')
    } finally {
      setBooking(false)
    }
  }

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="inline-block w-8 h-8 border-2 border-cinema-red border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!session) return <div className="text-center py-20 text-gray-500">Сеанс не найден</div>

  const total = selectedSeats.length * session.price

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-1">{session.movie.titleRu}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
          <span>📅 {format(new Date(session.startTime), 'dd MMMM yyyy, EEEE', { locale: ru })}</span>
          <span>🕐 {format(new Date(session.startTime), 'HH:mm')} – {format(new Date(session.endTime), 'HH:mm')}</span>
          <span>🎭 {session.hall.name}</span>
          <span className="text-cinema-gold font-semibold">💳 {session.price} сом./место</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Seat map */}
        <div className="lg:col-span-2 card p-6">
          <SeatMap
            seats={seats}
            selectedSeats={selectedSeats.map(s => s.id)}
            onToggle={toggleSeat}
          />
        </div>

        {/* Order summary */}
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="font-bold text-white text-lg mb-4">Ваш заказ</h2>
            {selectedSeats.length === 0 ? (
              <p className="text-gray-500 text-sm">Выберите места на схеме зала</p>
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  {selectedSeats.map(s => (
                    <div key={s.id} className="flex justify-between text-sm">
                      <span className="text-gray-400">Ряд {s.row}, место {s.number}</span>
                      <span className="text-white font-medium">{session.price} сом.</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-cinema-border pt-4">
                  <div className="flex justify-between font-bold">
                    <span className="text-white">Итого</span>
                    <span className="text-cinema-gold text-lg">{total} сом.</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{selectedSeats.length} {selectedSeats.length === 1 ? 'место' : 'мест'}</p>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleBook}
            disabled={selectedSeats.length === 0 || booking}
            className="btn-primary w-full text-base py-4 disabled:opacity-40"
          >
            {booking ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Оформляем...
              </span>
            ) : `Купить ${selectedSeats.length > 0 ? `(${total} сом.)` : ''}`}
          </button>

          <p className="text-xs text-gray-600 text-center">
            Нажимая кнопку, вы соглашаетесь с правилами кинотеатра
          </p>
        </div>
      </div>
    </div>
  )
}
