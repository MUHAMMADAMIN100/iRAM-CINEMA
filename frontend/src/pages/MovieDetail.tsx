import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import api from '../api/axios'
import { Movie, Session } from '../types'
import { optimizePoster } from '../utils/image'

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string>('')

  useEffect(() => {
    if (id) api.get(`/movies/${id}`).then(r => { setMovie(r.data); setLoading(false) })
  }, [id])

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
      <div className="h-8 bg-cinema-border rounded w-1/3 mb-4" />
      <div className="h-4 bg-cinema-border rounded w-1/2" />
    </div>
  )

  if (!movie) return <div className="text-center py-20 text-gray-500">Фильм не найден</div>

  const sessions = movie.sessions || []
  const dates = [...new Set(sessions.map(s => format(new Date(s.startTime), 'yyyy-MM-dd')))]
  const activeSessions = selectedDate
    ? sessions.filter(s => format(new Date(s.startTime), 'yyyy-MM-dd') === selectedDate)
    : sessions.filter(s => format(new Date(s.startTime), 'yyyy-MM-dd') === dates[0])

  return (
    <div>
      {/* Hero banner */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        {movie.poster && (
          <img src={optimizePoster(movie.poster, 600)} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover object-top blur-sm scale-110 opacity-30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/60 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 -mt-32 relative z-10 pb-16">
          {/* Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="w-48 sm:w-56 card overflow-hidden">
              {movie.poster
                ? <img src={optimizePoster(movie.poster, 500)} alt={movie.titleRu} referrerPolicy="no-referrer" className="w-full aspect-[2/3] object-cover" />
                : <div className="aspect-[2/3] bg-cinema-border flex items-center justify-center text-4xl">🎬</div>
              }
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 md:pt-32">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="badge bg-cinema-red/20 text-cinema-red border border-cinema-red/30">{movie.ageLimit}</span>
              {movie.genres.map(g => (
                <span key={g.id} className="badge bg-cinema-border text-gray-400">{g.name}</span>
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">{movie.titleRu}</h1>
            <p className="text-gray-400 mb-4">{movie.title}</p>
            <div className="flex gap-6 text-sm text-gray-500 mb-6">
              <span>⏱ {Math.floor(movie.duration / 60)}ч {movie.duration % 60}мин</span>
              <span>🌐 {movie.language}</span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-2xl">{movie.description}</p>

            {movie.trailer && (
              <a href={movie.trailer} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-sm text-cinema-red hover:text-red-400 transition-colors">
                ▶ Смотреть трейлер
              </a>
            )}
          </div>
        </div>

        {/* Sessions */}
        {sessions.length > 0 && (
          <div className="mb-16">
            <h2 className="text-xl font-bold text-white mb-6">Расписание сеансов</h2>

            {/* Date tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {dates.map(date => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    (selectedDate || dates[0]) === date
                      ? 'bg-cinema-red text-white'
                      : 'bg-cinema-card border border-cinema-border text-gray-400 hover:text-white'
                  }`}
                >
                  {format(new Date(date), 'dd MMM, EEE', { locale: ru })}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {activeSessions.map(session => (
                <Link
                  key={session.id}
                  to={`/sessions/${session.id}/book`}
                  className="card hover:border-cinema-red transition-colors p-4 flex flex-col items-center gap-1 min-w-[120px]"
                >
                  <span className="text-lg font-bold text-white">
                    {format(new Date(session.startTime), 'HH:mm')}
                  </span>
                  <span className="text-xs text-gray-500">{session.hall?.name}</span>
                  <span className="text-sm font-semibold text-cinema-gold mt-1">{session.price} сом.</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
