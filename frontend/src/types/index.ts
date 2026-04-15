export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: 'USER' | 'ADMIN'
}

export interface Genre {
  id: string
  name: string
}

export interface Movie {
  id: string
  title: string
  titleRu: string
  description: string
  poster?: string
  trailer?: string
  duration: number
  rating: number
  language: string
  ageLimit: string
  isActive: boolean
  genres: Genre[]
  sessions?: Session[]
}

export interface Hall {
  id: string
  name: string
  rows: number
}

export interface Seat {
  id: string
  hallId: string
  row: number
  number: number
  type: string
  status?: 'AVAILABLE' | 'BOOKED' | 'RESERVED'
}

export interface Session {
  id: string
  movieId: string
  hallId: string
  movie: Movie
  hall: Hall
  startTime: string
  endTime: string
  price: number
  isActive: boolean
  _count?: { tickets: number }
}

export interface Ticket {
  id: string
  seatId: string
  seat: Seat
  sessionId: string
  qrCode?: string
  status: string
}

export interface Booking {
  id: string
  userId: string
  sessionId: string
  session: Session
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  total: number
  tickets: Ticket[]
  createdAt: string
}
