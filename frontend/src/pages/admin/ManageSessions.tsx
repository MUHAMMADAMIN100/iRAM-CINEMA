import { useEffect, useState, FormEvent } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import { Session, Movie, Hall } from '../../types'

export default function ManageSessions() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [halls, setHalls] = useState<Hall[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ movieId: '', hallId: '', startTime: '', price: '45' })

  const load = () => {
    Promise.all([api.get('/sessions'), api.get('/movies'), api.get('/halls')]).then(([s, m, h]) => {
      setSessions(s.data); setMovies(m.data); setHalls(h.data); setLoading(false)
    })
  }
  useEffect(() => { load() }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const startDate = new Date(form.startTime)
    if (isNaN(startDate.getTime())) { toast.error('Неверная дата'); return }
    if (startDate.getTime() < Date.now()) { toast.error('Время сеанса уже прошло'); return }
    try {
      await api.post('/sessions', {
        movieId: form.movieId,
        hallId: form.hallId,
        startTime: startDate.toISOString(),
        price: Number(form.price),
      })
      toast.success('Сеанс создан'); setShowForm(false); load()
    } catch (err: any) { toast.error(err.response?.data?.message || 'Ошибка') }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить сеанс?')) return
    try { await api.delete(`/sessions/${id}`); toast.success('Удалено'); load() }
    catch { toast.error('Ошибка') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white">Сеансы ({sessions.length})</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary py-2 px-4 text-sm">
          {showForm ? '✕ Закрыть' : '+ Добавить'}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <h3 className="font-bold text-white mb-4">Новый сеанс</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Фильм</label>
              <select required className="input text-sm" value={form.movieId}
                onChange={e => setForm(p => ({ ...p, movieId: e.target.value }))}>
                <option value="">— Выберите фильм —</option>
                {movies.map(m => <option key={m.id} value={m.id}>{m.titleRu}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Зал</label>
              <select required className="input text-sm" value={form.hallId}
                onChange={e => setForm(p => ({ ...p, hallId: e.target.value }))}>
                <option value="">— Выберите зал —</option>
                {halls.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Дата и время начала</label>
              <input type="datetime-local" required className="input text-sm" value={form.startTime}
                onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Цена билета (сом.)</label>
              <input type="number" required className="input text-sm" value={form.price}
                onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary py-2 px-6 text-sm">Создать</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline py-2 px-4 text-sm">Отмена</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="text-gray-500 text-sm">Загрузка...</div> : (
        <div className="space-y-3">
          {sessions.length === 0 && <p className="text-gray-500 text-sm">Сеансов нет</p>}
          {sessions.map(s => (
            <div key={s.id} className="card p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-sm truncate">{s.movie?.titleRu}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {format(new Date(s.startTime), 'dd MMM yyyy, HH:mm', { locale: ru })} → {format(new Date(s.endTime), 'HH:mm')}
                </p>
                <p className="text-xs text-gray-600">{s.hall?.name} · {s.price} сом.</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {s._count && (
                  <span className="text-xs text-gray-500">{s._count.tickets} билетов</span>
                )}
                <button onClick={() => handleDelete(s.id)} className="text-xs text-cinema-red hover:text-red-400 border border-cinema-border rounded px-2 py-1">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
