import { Link } from 'react-router-dom'
import { Movie } from '../types'

interface Props { movie: Movie }

export default function MovieCard({ movie }: Props) {
  return (
    <Link to={`/movies/${movie.id}`} className="card group block hover:border-cinema-red transition-colors">
      <div className="relative aspect-[2/3] overflow-hidden">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.titleRu}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-cinema-border flex items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="badge bg-cinema-red/90 text-white">{movie.ageLimit}</span>
          {movie.sessions && movie.sessions.length > 0 && (
            <span className="badge bg-green-700/90 text-white">Сейчас в кино</span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex flex-wrap gap-1">
            {movie.genres.slice(0, 2).map(g => (
              <span key={g.id} className="badge bg-black/60 text-gray-300">{g.name}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-white text-sm leading-tight mb-1 line-clamp-2">{movie.titleRu}</h3>
        <p className="text-xs text-gray-500">{Math.floor(movie.duration / 60)}ч {movie.duration % 60}мин</p>
      </div>
    </Link>
  )
}
