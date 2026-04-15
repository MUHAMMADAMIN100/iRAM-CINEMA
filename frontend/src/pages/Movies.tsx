import { useEffect, useState } from 'react'
import api from '../api/axios'
import { Movie } from '../types'
import MovieCard from '../components/MovieCard'

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [filtered, setFiltered] = useState<Movie[]>([])
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/movies').then(r => { setMovies(r.data); setFiltered(r.data); setLoading(false) })
  }, [])

  useEffect(() => {
    let res = movies
    if (search) res = res.filter(m => m.titleRu.toLowerCase().includes(search.toLowerCase()) || m.title.toLowerCase().includes(search.toLowerCase()))
    if (genre) res = res.filter(m => m.genres.some(g => g.name === genre))
    setFiltered(res)
  }, [search, genre, movies])

  const allGenres = [...new Set(movies.flatMap(m => m.genres.map(g => g.name)))]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Все фильмы</h1>
        <p className="text-gray-500">Выберите фильм и забронируйте место онлайн</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Поиск фильмов..."
          className="input max-w-xs"
        />
        <select value={genre} onChange={e => setGenre(e.target.value)} className="input max-w-[180px]">
          <option value="">Все жанры</option>
          {allGenres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        {(search || genre) && (
          <button onClick={() => { setSearch(''); setGenre('') }} className="text-sm text-cinema-red hover:text-red-400 transition-colors">
            × Сбросить
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-[2/3] bg-cinema-border" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-cinema-border rounded" />
                <div className="h-3 bg-cinema-border rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">🎬</div>
          <p>Фильмы не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(m => <MovieCard key={m.id} movie={m} />)}
        </div>
      )}
    </div>
  )
}
