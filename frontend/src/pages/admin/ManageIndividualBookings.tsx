import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import toast from 'react-hot-toast'
import api from '../../api/axios'

type Status = 'NEW' | 'CONTACTED' | 'CONFIRMED' | 'CANCELLED'

interface IndividualBooking {
  id: string
  fullName: string
  phone: string
  email: string | null
  movieTitle: string
  preferredAt: string
  guestsCount: number
  notes: string | null
  status: Status
  createdAt: string
}

const STATUS_META: Record<Status, { label: string; cls: string }> = {
  NEW:       { label: 'Новая',         cls: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  CONTACTED: { label: 'Связались',     cls: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/40' },
  CONFIRMED: { label: 'Подтверждена',  cls: 'bg-green-500/15 text-green-300 border-green-500/40' },
  CANCELLED: { label: 'Отменена',      cls: 'bg-gray-500/15 text-gray-400 border-gray-500/40' },
}

const ALL_STATUSES: Status[] = ['NEW', 'CONTACTED', 'CONFIRMED', 'CANCELLED']

export default function ManageIndividualBookings() {
  const [items, setItems] = useState<IndividualBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Status | 'ALL'>('ALL')
  const [deleteTarget, setDeleteTarget] = useState<IndividualBooking | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const load = () => api.get('/individual-bookings').then(r => { setItems(r.data); setLoading(false) })
  useEffect(() => { load() }, [])

  const updateStatus = async (id: string, status: Status) => {
    setUpdatingId(id)
    try {
      const r = await api.patch(`/individual-bookings/${id}/status`, { status })
      setItems(prev => prev.map(b => b.id === id ? { ...b, status: r.data.status } : b))
      toast.success('Статус обновлён')
    } catch {
      toast.error('Не удалось обновить')
    } finally {
      setUpdatingId(null)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.delete(`/individual-bookings/${deleteTarget.id}`)
      setItems(prev => prev.filter(b => b.id !== deleteTarget.id))
      toast.success('Заявка удалена')
      setDeleteTarget(null)
    } catch {
      toast.error('Не удалось удалить')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = filter === 'ALL' ? items : items.filter(i => i.status === filter)
  const counts = ALL_STATUSES.reduce<Record<Status, number>>((acc, s) => {
    acc[s] = items.filter(i => i.status === s).length
    return acc
  }, { NEW: 0, CONTACTED: 0, CONFIRMED: 0, CANCELLED: 0 })

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-white">Индивидуальные заявки ({items.length})</h2>
          <p className="text-xs text-gray-500 mt-1">Аренда зала на закрытые показы</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        <button onClick={() => setFilter('ALL')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filter === 'ALL' ? 'bg-cinema-red text-white' : 'bg-cinema-card border border-cinema-border text-gray-400 hover:text-white'
          }`}>
          Все ({items.length})
        </button>
        {ALL_STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === s ? 'bg-cinema-red text-white' : 'bg-cinema-card border border-cinema-border text-gray-400 hover:text-white'
            }`}>
            {STATUS_META[s].label} ({counts[s]})
          </button>
        ))}
      </div>

      {loading ? <div className="text-gray-500 text-sm">Загрузка...</div> : (
        <div className="space-y-3">
          {filtered.length === 0 && <p className="text-gray-500 text-sm">Заявок нет</p>}
          {filtered.map(b => (
            <div key={b.id} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-white text-sm">{b.fullName}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_META[b.status].cls}`}>
                      {STATUS_META[b.status].label}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-0.5">
                    <a href={`tel:${b.phone}`} className="hover:text-cinema-gold">📞 {b.phone}</a>
                    {b.email && <a href={`mailto:${b.email}`} className="hover:text-cinema-gold">✉ {b.email}</a>}
                    <span>👥 {b.guestsCount} гостей</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <select
                    disabled={updatingId === b.id}
                    value={b.status}
                    onChange={e => updateStatus(b.id, e.target.value as Status)}
                    className="bg-cinema-card border border-cinema-border text-xs text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-cinema-red disabled:opacity-50"
                  >
                    {ALL_STATUSES.map(s => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
                  </select>
                  <button onClick={() => setDeleteTarget(b)} className="text-xs text-cinema-red hover:text-red-400 border border-cinema-border rounded px-2 py-1">✕</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mt-3 pt-3 border-t border-cinema-border">
                <div>
                  <p className="text-gray-600 mb-0.5">Фильм</p>
                  <p className="text-white font-medium break-words">{b.movieTitle}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-0.5">Желаемое время</p>
                  <p className="text-white font-medium">{format(new Date(b.preferredAt), 'dd MMMM yyyy, HH:mm', { locale: ru })}</p>
                </div>
                {b.notes && (
                  <div className="sm:col-span-2">
                    <p className="text-gray-600 mb-0.5">Комментарий клиента</p>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap break-words">{b.notes}</p>
                  </div>
                )}
              </div>

              <p className="text-[10px] text-gray-600 mt-3">
                Заявка от {format(new Date(b.createdAt), 'dd MMM yyyy, HH:mm', { locale: ru })}
              </p>
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="card p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-cinema-red/20 flex items-center justify-center text-cinema-red text-xl flex-shrink-0">⚠</div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-base mb-1">Удалить заявку?</h3>
                <p className="text-sm text-gray-400">Заявка от <span className="text-white">{deleteTarget.fullName}</span> будет удалена безвозвратно.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button type="button" disabled={deleting} onClick={() => setDeleteTarget(null)} className="btn-outline py-2 px-4 text-sm disabled:opacity-50">Отмена</button>
              <button type="button" disabled={deleting} onClick={confirmDelete} className="py-2 px-4 text-sm rounded-lg bg-cinema-red text-white hover:bg-red-600 transition disabled:opacity-50">
                {deleting ? 'Удаление...' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
