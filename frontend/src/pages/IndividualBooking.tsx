import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios'

const EMPTY = {
  fullName: '',
  phone: '',
  email: '',
  movieTitle: '',
  preferredAt: '',
  guestsCount: 20,
  notes: '',
}

export default function IndividualBooking() {
  const [form, setForm] = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const update = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) =>
    setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return

    const date = new Date(form.preferredAt)
    if (isNaN(date.getTime())) { toast.error('Укажите корректную дату'); return }
    if (date.getTime() < Date.now()) { toast.error('Выбранная дата уже прошла'); return }

    setSubmitting(true)
    try {
      await api.post('/individual-bookings', {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        movieTitle: form.movieTitle.trim(),
        preferredAt: date.toISOString(),
        guestsCount: Number(form.guestsCount),
        notes: form.notes.trim() || undefined,
      })
      setSubmitted(true)
      setForm(EMPTY)
    } catch (err: any) {
      const msg = err?.response?.data?.message
      toast.error(Array.isArray(msg) ? msg[0] : msg || 'Не удалось отправить заявку')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
        <div className="card p-10 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-cinema-red/15 flex items-center justify-center text-4xl mb-5">✓</div>
          <h1 className="text-3xl font-black text-white mb-3">Заявка принята</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Спасибо! Наш менеджер свяжется с вами в течение нескольких часов
            для уточнения деталей и подтверждения брони зала.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => setSubmitted(false)} className="btn-outline py-2 px-5 text-sm">Отправить ещё одну</button>
            <Link to="/" className="btn-primary py-2 px-5 text-sm">На главную</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="mb-8">
        <span className="text-xs font-semibold tracking-widest text-cinema-gold uppercase">Индивидуальная аренда</span>
        <h1 className="text-3xl sm:text-4xl font-black text-white mt-2">Забронируй весь зал</h1>
        <p className="text-gray-400 mt-3 leading-relaxed max-w-2xl">
          День рождения, корпоратив, романтический вечер или закрытый показ — арендуй
          IRAM CINEMA целиком и выбери любой фильм, даже тот, которого нет в нашей библиотеке.
          Просто оставь заявку, и менеджер свяжется с тобой.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Имя и фамилия *</label>
            <input required minLength={2} maxLength={100} className="input text-sm"
              value={form.fullName} onChange={e => update('fullName', e.target.value)}
              placeholder="Например, Мухаммад Турсунзода" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Телефон *</label>
            <input required minLength={5} maxLength={30} className="input text-sm" type="tel"
              value={form.phone} onChange={e => update('phone', e.target.value)}
              placeholder="+992 ..." />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Email <span className="text-gray-600">(необязательно)</span></label>
            <input className="input text-sm" type="email"
              value={form.email} onChange={e => update('email', e.target.value)}
              placeholder="example@mail.com" />
          </div>
        </div>

        <div className="border-t border-cinema-border pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Какой фильм хотите показать? *</label>
              <input required maxLength={200} className="input text-sm"
                value={form.movieTitle} onChange={e => update('movieTitle', e.target.value)}
                placeholder="Любое название — даже того, которого нет в каталоге" />
              <p className="text-[11px] text-gray-600 mt-1">Можно ввести любой фильм. Если его нет в нашей библиотеке — обсудим источник видео.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Желаемая дата и время *</label>
              <input required type="datetime-local" className="input text-sm"
                value={form.preferredAt} onChange={e => update('preferredAt', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Сколько гостей будет? *</label>
              <input required type="number" min={1} max={500} className="input text-sm"
                value={form.guestsCount}
                onChange={e => update('guestsCount', Number(e.target.value) as any)} />
            </div>
          </div>
        </div>

        <div className="border-t border-cinema-border pt-5">
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Особые пожелания <span className="text-gray-600">(необязательно)</span></label>
          <textarea rows={4} maxLength={1000} className="input text-sm"
            value={form.notes} onChange={e => update('notes', e.target.value)}
            placeholder="Торт, оформление, попкорн, особое освещение, тип мероприятия и т.д." />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-3">
          <p className="text-[11px] text-gray-600 leading-relaxed sm:max-w-md">
            Нажимая кнопку, вы соглашаетесь с обработкой ваших персональных данных
            для связи с менеджером по поводу аренды.
          </p>
          <button type="submit" disabled={submitting}
            className="btn-primary py-3 px-8 text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
            {submitting ? 'Отправка...' : 'Оставить заявку'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-xs text-gray-500 text-center">
        Есть вопросы? Позвоните: <a href="tel:+992934540000" className="text-cinema-gold hover:underline">+992 93 454 00 00</a>
      </div>
    </div>
  )
}
