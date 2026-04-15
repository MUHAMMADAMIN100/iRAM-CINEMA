import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await login(form.email, form.password)
      toast.success('Добро пожаловать!')
      navigate('/')
    } catch {
      toast.error('Неверный email или пароль')
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎬</div>
          <h1 className="text-2xl font-black text-white">Вход в аккаунт</h1>
          <p className="text-gray-500 text-sm mt-2">Войдите, чтобы бронировать билеты</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email</label>
              <input type="email" required value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="your@email.com" className="input" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Пароль</label>
              <input type="password" required value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••" className="input" />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
              {isLoading ? 'Входим...' : 'Войти'}
            </button>
          </form>
          <div className="mt-4 pt-4 border-t border-cinema-border text-center">
            <p className="text-sm text-gray-500">
              Нет аккаунта?{' '}
              <Link to="/register" className="text-cinema-red hover:text-red-400 font-medium">Зарегистрироваться</Link>
            </p>
          </div>
          <div className="mt-3 p-3 bg-cinema-dark rounded-xl">
            <p className="text-xs text-gray-600 text-center">Тестовый аккаунт:</p>
            <p className="text-xs text-gray-500 text-center">user@test.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
