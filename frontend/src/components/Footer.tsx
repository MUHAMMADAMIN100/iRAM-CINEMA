import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-cinema-border bg-cinema-card mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-cinema-red rounded-lg flex items-center justify-center text-white font-black text-sm">IC</div>
              <span className="font-black text-xl"><span className="text-white">IRAM</span><span className="text-cinema-red"> CINEMA</span></span>
            </div>
            <p className="text-sm text-gray-500">Лучший кинотеатр Душанбе. Самый большой экран, залы премиум-класса.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Навигация</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-gray-500 hover:text-white transition-colors">Главная</Link>
              <Link to="/movies" className="block text-sm text-gray-500 hover:text-white transition-colors">Фильмы</Link>
              <Link to="/profile" className="block text-sm text-gray-500 hover:text-white transition-colors">Мои билеты</Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Контакты</h3>
            <div className="space-y-2 text-sm text-gray-500">
              <p>📍 Душанбе, Таджикистан</p>
              <p>📞 +992 93 454 00 00</p>
              <p>✉️ info@iramcinema.tj</p>
              <p>🕐 08:00 – 03:00 без выходных</p>
            </div>
          </div>
        </div>
        <div className="border-t border-cinema-border mt-8 pt-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} IRAM CINEMA. Все права защищены.
        </div>
      </div>
    </footer>
  )
}
