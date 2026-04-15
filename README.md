# 🎬 IRAM CINEMA

Полноценная система бронирования билетов в кинотеатр.

## Стек технологий

| Слой | Технология | Хостинг |
|------|-----------|---------|
| Frontend | React + TypeScript + Vite + TailwindCSS | Vercel |
| Backend  | NestJS + Prisma ORM | Railway |
| База данных | PostgreSQL | Railway |

---

## Быстрый старт

### 1. База данных (Railway)

1. Зайди на [railway.app](https://railway.app) → New Project → PostgreSQL
2. Скопируй `DATABASE_URL` из вкладки Variables

### 2. Backend (NestJS)

```bash
cd backend
cp .env.example .env
# Заполни .env своими значениями

npm install
npx prisma generate
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts   # заполнит тестовые данные

npm run start:dev             # разработка на http://localhost:3001
```

**Деплой на Railway:**
1. New Project → GitHub репо → выбери папку `backend`
2. Добавь переменные окружения из `.env`
3. Railway автоматически запустит `npm run start:prod`

### 3. Frontend (React)

```bash
cd frontend
cp .env.example .env
# VITE_API_URL=https://твой-backend.railway.app/api

npm install
npm run dev                   # разработка на http://localhost:5173
npm run build                 # production сборка
```

**Деплой на Vercel:**
1. Зайди на [vercel.com](https://vercel.com) → New Project → GitHub репо
2. Root Directory: `frontend`
3. Добавь `VITE_API_URL` в Environment Variables

---

## Переменные окружения

### Backend `.env`
```
DATABASE_URL="postgresql://..."
JWT_SECRET="super-secret-key-минимум-32-символа"
JWT_EXPIRES_IN="7d"
PORT=3001
FRONTEND_URL="https://твой-сайт.vercel.app"
```

### Frontend `.env`
```
VITE_API_URL="https://твой-backend.railway.app/api"
```

---

## Структура проекта

```
iram-cinema/
├── backend/                 # NestJS API
│   ├── prisma/
│   │   ├── schema.prisma    # Схема базы данных
│   │   └── seed.ts          # Тестовые данные
│   └── src/
│       ├── auth/            # JWT авторизация
│       ├── movies/          # Фильмы CRUD
│       ├── halls/           # Залы и схема мест
│       ├── sessions/        # Сеансы
│       ├── bookings/        # Бронирование + QR
│       └── users/           # Пользователи
└── frontend/                # React приложение
    └── src/
        ├── components/
        │   ├── Navbar.tsx
        │   ├── SeatMap.tsx  # Схема зала (8 рядов)
        │   ├── MovieCard.tsx
        │   └── Footer.tsx
        ├── pages/
        │   ├── Home.tsx
        │   ├── Movies.tsx
        │   ├── MovieDetail.tsx
        │   ├── SessionBooking.tsx  # Выбор мест
        │   ├── BookingConfirmation.tsx  # QR-код
        │   ├── Profile.tsx
        │   └── admin/
        │       ├── Dashboard.tsx
        │       ├── ManageMovies.tsx
        │       ├── ManageSessions.tsx
        │       └── ManageBookings.tsx
        └── store/
            └── authStore.ts  # Zustand
```

---

## Схема зала IRAM CINEMA

```
           ══════════ ЭКРАН ══════════

Ряд 1:  1-2  3-4  5-6  [1 ряд]  7-8  9-10  11-12
Ряд 2:  1-2  3-4  5-6  [2 ряд]  7-8  9-10  11-12
Ряд 3:  1-2  3-4  5-6  [3 ряд]  7-8  9-10  11-12
Ряд 4:  1-2  3-4       [4 ряд]  5-6         7-8
Ряд 5:  1-2  3-4  5-6  7-8  [5 ряд]  9-10 ... 15-16
Ряд 6:  1-2  3-4  5-6  7-8  9-10  [6 ряд]  ... 19-20
Ряд 7:  1-2  3-4  5-6  7-8  9-10  [7 ряд]  ... 19-20
Ряд 8:  1-2  3-4  5-6  7-8  9-10  11-12  [8 ряд]  ... 23-24

                   ↑ ВХОД
```

Итого: **124 места**

---

## API документация

Swagger доступен по адресу: `http://localhost:3001/api/docs`

### Основные эндпоинты

```
POST   /api/auth/register        # Регистрация
POST   /api/auth/login           # Вход
GET    /api/auth/me              # Текущий пользователь

GET    /api/movies               # Список фильмов
GET    /api/movies/:id           # Детали фильма
POST   /api/movies               # [ADMIN] Создать фильм
PUT    /api/movies/:id           # [ADMIN] Обновить
DELETE /api/movies/:id           # [ADMIN] Удалить

GET    /api/sessions             # Список сеансов
GET    /api/sessions/:id         # Детали сеанса
POST   /api/sessions             # [ADMIN] Создать сеанс

GET    /api/halls/:id/seats/:sessionId  # Места с статусами

POST   /api/bookings             # Забронировать
GET    /api/bookings/my          # Мои бронирования
DELETE /api/bookings/:id         # Отменить
GET    /api/bookings/stats       # [ADMIN] Статистика
GET    /api/bookings/admin/all   # [ADMIN] Все бронирования
```

---

## Тестовые аккаунты (после seed)

| Роль | Email | Пароль |
|------|-------|--------|
| 👑 Администратор | admin@iramcinema.tj | admin123 |
| 👤 Пользователь | user@test.com | user123 |

---

## Функционал

- ✅ Авторизация (JWT)
- ✅ Каталог фильмов с фильтрацией
- ✅ Интерактивная схема зала (8 рядов, 124 места)
- ✅ Онлайн-бронирование мест
- ✅ Защита от двойного бронирования
- ✅ QR-код билет
- ✅ Личный кабинет с историей
- ✅ Отмена бронирования
- ✅ Админ-панель: фильмы, сеансы, бронирования
- ✅ Статистика выручки
- ✅ Dark theme дизайн
- ✅ Полностью адаптивный (mobile-first)
- ✅ Swagger документация

---

## Контакты

📧 info@iramcinema.tj  
📞 +992 93 454 00 00  
📍 Душанбе, Таджикистан
