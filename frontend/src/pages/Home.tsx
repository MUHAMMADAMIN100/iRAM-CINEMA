import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { Movie } from '../types'
import MovieCard from '../components/MovieCard'

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/movies?active=true').then(r => { setMovies(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cinema-dark via-cinema-card to-cinema-dark" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cinema-red rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cinema-gold rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-cinema-red/10 border border-cinema-red/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-cinema-red rounded-full animate-pulse" />
              <span className="text-sm text-cinema-red font-medium">Сейчас в кино</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-6">
              <span className="text-white">Лучший кинотеатр</span>
              <br />
              <span className="text-gradient">Душанбе</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Самый большой экран Таджикистана · Залы премиум-класса · Онлайн-бронирование
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/movies" className="btn-primary text-base px-8 py-4">
                🎬 Смотреть расписание
              </Link>
              <a href="tel:+992934540000" className="btn-outline text-base px-8 py-4">
                📞 +992 93 454 00 00
              </a>
            </div>
            <div className="flex gap-8 mt-10">
              {[['4', 'Залы'], ['124', 'Мест в зале'], ['08:00–03:00', 'Режим работы']].map(([v, l]) => (
                <div key={l}>
                  <div className="text-2xl font-black text-cinema-red">{v}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Now showing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white">Сейчас в кино</h2>
            <p className="text-gray-500 text-sm mt-1">Актуальные фильмы в прокате</p>
          </div>
          <Link to="/movies" className="text-sm text-cinema-red hover:text-red-400 font-medium transition-colors">
            Все фильмы →
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-[2/3] bg-cinema-border" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-cinema-border rounded w-3/4" />
                  <div className="h-3 bg-cinema-border rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-cinema-card border-y border-cinema-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🎭', title: 'Онлайн-бронирование', desc: 'Выберите лучшее место в зале и купите билет за минуту' },
              { icon: '📱', title: 'QR-билет', desc: 'Получите QR-код и проходите без бумажных билетов' },
              { icon: '🎬', title: 'Премьеры в первый день', desc: 'Мировые новинки в день официального выхода' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
