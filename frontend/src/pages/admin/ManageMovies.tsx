import { useEffect, useState, FormEvent } from 'react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import { Movie } from '../../types'

const EMPTY = { title: '', titleRu: '', description: '', poster: '', trailer: '', duration: 120, ageLimit: '12+', language: 'RU', genres: '' }

export default function ManageMovies() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Movie | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [deleteTarget, setDeleteTarget] = useState<Movie | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => api.get('/movies').then(r => { setMovies(r.data); setLoading(false) })
  useEffect(() => { load() }, [])

  const openEdit = (m: Movie) => {
    setEditing(m)
    setForm({ title: m.title, titleRu: m.titleRu, description: m.description, poster: m.poster || '', trailer: m.trailer || '', duration: m.duration, ageLimit: m.ageLimit, language: m.language, genres: m.genres.map(g => g.name).join(', ') })
    setShowForm(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const payload = { ...form, duration: Number(form.duration), genres: form.genres.split(',').map(s => s.trim()).filter(Boolean) }
    try {
      if (editing) {
        await api.put(`/movies/${editing.id}`, payload)
        toast.success('Фильм обновлён')
      } else {
        await api.post('/movies', payload)
        toast.success('Фильм добавлен')
      }
      setShowForm(false); setEditing(null); setForm(EMPTY); load()
    } catch { toast.error('Ошибка сохранения') }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.delete(`/movies/${deleteTarget.id}`)
      setMovies(prev => prev.filter(m => m.id !== deleteTarget.id))
      toast.success(`«${deleteTarget.titleRu}» удалён`)
      setDeleteTarget(null)
    } catch {
      toast.error('Не удалось удалить')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white">Фильмы ({movies.length})</h2>
        <button onClick={() => { setEditing(null); setForm(EMPTY); setShowForm(!showForm) }} className="btn-primary py-2 px-4 text-sm">
          {showForm ? '✕ Закрыть' : '+ Добавить'}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <h3 className="font-bold text-white mb-4">{editing ? 'Редактировать' : 'Новый фильм'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { k: 'titleRu', label: 'Название (рус)', required: true },
              { k: 'title', label: 'Название (eng)', required: true },
              { k: 'poster', label: 'URL постера' },
              { k: 'trailer', label: 'URL трейлера' },
              { k: 'genres', label: 'Жанры (через запятую)' },
            ].map(f => (
              <div key={f.k}>
                <label className="block text-xs text-gray-500 mb-1">{f.label}</label>
                <input required={f.required} className="input text-sm" value={(form as any)[f.k]}
                  onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} />
              </div>
            ))}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Длительность (мин)</label>
              <input type="number" required className="input text-sm" value={form.duration}
                onChange={e => setForm(p => ({ ...p, duration: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Возрастной рейтинг</label>
              <select className="input text-sm" value={form.ageLimit}
                onChange={e => setForm(p => ({ ...p, ageLimit: e.target.value }))}>
                {['0+','6+','12+','16+','18+'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Описание</label>
              <textarea required rows={3} className="input text-sm" value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary py-2 px-6 text-sm">{editing ? 'Сохранить' : 'Добавить'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="btn-outline py-2 px-4 text-sm">Отмена</button>
            </div>
          </form>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="card p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-cinema-red/20 flex items-center justify-center text-cinema-red text-xl flex-shrink-0">⚠</div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-base mb-1">Удалить фильм?</h3>
                <p className="text-sm text-gray-400 break-words">Вы уверены, что хотите удалить «<span className="text-white">{deleteTarget.titleRu}</span>»? Это действие нельзя отменить.</p>
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

      {loading ? <div className="text-gray-500 text-sm">Загрузка...</div> : (
        <div className="space-y-3">
          {movies.map(m => (
            <div key={m.id} className="card p-4 flex items-center gap-4">
              {m.poster
                ? <img src={m.poster} alt="" className="w-12 h-16 object-cover rounded-lg flex-shrink-0" />
                : <div className="w-12 h-16 bg-cinema-border rounded-lg flex items-center justify-center text-xl flex-shrink-0">🎬</div>
              }
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-sm truncate">{m.titleRu}</h3>
                <p className="text-xs text-gray-500">{m.title} · {m.duration}мин · {m.ageLimit}</p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {m.genres.map(g => <span key={g.id} className="badge bg-cinema-border text-gray-400 text-[10px]">{g.name}</span>)}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <span className={`text-xs ${m.isActive ? 'text-green-400' : 'text-gray-600'}`}>{m.isActive ? '● Активен' : '● Скрыт'}</span>
                <button onClick={() => openEdit(m)} className="text-xs text-gray-400 hover:text-white border border-cinema-border rounded px-2 py-1">✎</button>
                <button onClick={() => setDeleteTarget(m)} className="text-xs text-cinema-red hover:text-red-400 border border-cinema-border rounded px-2 py-1">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
