import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

export default function Register() {
  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Минимум 6 символов'); return }
    try {
      await register(form.name, form.email, form.password, form.phone)
      toast.success('Аккаунт создан!')
      navigate('/')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Ошибка регистрации')
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎟️</div>
          <h1 className="text-2xl font-black text-white">Создать аккаунт</h1>
          <p className="text-gray-500 text-sm mt-2">Регистрация для онлайн-бронирования</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: 'Имя', type: 'text', placeholder: 'Иван Иванов', required: true },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', required: true },
              { key: 'phone', label: 'Телефон', type: 'tel', placeholder: '+992 900 000 000', required: false },
              { key: 'password', label: 'Пароль (мин. 6 символов)', type: 'password', placeholder: '••••••••', required: true },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm text-gray-400 mb-1.5">{f.label}</label>
                <input type={f.type} required={f.required}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} className="input" />
              </div>
            ))}
            <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
              {isLoading ? 'Создаём...' : 'Зарегистрироваться'}
            </button>
          </form>
          <div className="mt-4 pt-4 border-t border-cinema-border text-center">
            <p className="text-sm text-gray-500">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-cinema-red hover:text-red-400 font-medium">Войти</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
