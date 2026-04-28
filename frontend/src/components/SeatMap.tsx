import { Seat } from '../types'

interface Props {
  seats: Seat[]
  selectedSeats: string[]
  onToggle: (seat: Seat) => void
}

type Pair = number[] | null

type RowDef = {
  row: number
  left: Pair[]
  right: Pair[]
}

const HALL_LAYOUT: RowDef[] = [
  { row: 1, left: [[1,2],[3,4],[5,6]], right: [[7,8],[9,10],[11,12]] },
  { row: 2, left: [[1,2],[3,4],[5,6]], right: [[7,8],[9,10],[11,12]] },
  { row: 3, left: [[1,2],[3,4],[5,6]], right: [[7,8],[9,10],[11,12]] },
  { row: 4, left: [[1,2], null, [3,4]], right: [[5,6], null, [7,8]] },
  { row: 5, left: [[1,2],[3,4],[5,6],[7,8]], right: [[9,10],[11,12],[13,14],[15,16]] },
  { row: 6, left: [[1,2],[3,4],[5,6],[7,8],[9,10]], right: [[11,12],[13,14],[15,16],[17,18],[19,20]] },
  { row: 7, left: [[1,2],[3,4],[5,6],[7,8],[9,10]], right: [[11,12],[13,14],[15,16],[17,18],[19,20]] },
  { row: 8, left: [[1,2],[3,4],[5,6],[7,8],[9,10],[11,12]], right: [[13,14],[15,16],[17,18],[19,20],[21,22],[23,24]] },
]

export default function SeatMap({ seats, selectedSeats, onToggle }: Props) {
  const seatMap = new Map(seats.map(s => [`${s.row}-${s.number}`, s]))

  const getSeatClass = (seat: Seat | undefined) => {
    if (!seat) return 'seat-booked'
    const status = seat.status || 'AVAILABLE'
    if (selectedSeats.includes(seat.id)) return 'seat-selected'
    if (status === 'BOOKED' || status === 'RESERVED') return 'seat-booked'
    return 'seat-available'
  }

  const renderPair = (row: number, pair: Pair, key: number) => {
    if (pair === null) {
      return <div key={key} className="w-7 sm:w-8 md:w-10 lg:w-11" aria-hidden />
    }
    return (
      <div key={key} className="flex">
        {pair.map(num => {
          const seat = seatMap.get(`${row}-${num}`)
          const cls = getSeatClass(seat)
          const isClickable = seat && (seat.status === 'AVAILABLE' || !seat.status || selectedSeats.includes(seat.id))
          return (
            <button
              key={num}
              type="button"
              title={`Ряд ${row}, Место ${num}`}
              onClick={() => isClickable && seat && onToggle(seat)}
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-[22px] lg:h-[22px] text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-semibold flex items-center justify-center ${cls}`}
            >
              {num}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="select-none w-full">
      {/* Screen */}
      <div className="mb-5 text-center">
        <div className="mx-auto w-3/4 h-2 bg-gradient-to-r from-transparent via-cinema-red to-transparent rounded-full mb-2" />
        <p className="text-xs text-gray-500 tracking-widest uppercase">Экран</p>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mb-5 flex-wrap">
        {[
          { cls: 'bg-gray-700', label: 'Свободно' },
          { cls: 'bg-cinema-red', label: 'Выбрано' },
          { cls: 'bg-red-900 opacity-50', label: 'Занято' },
        ].map(({ cls, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${cls}`} />
            <span className="text-xs text-gray-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Seat map */}
      <div className="relative w-full">
        {/* Entrance label (top-left, arrow pointing left) */}
        <div className="hidden md:flex absolute left-0 top-2 items-center gap-1 text-[10px] text-cinema-gold/80 font-bold tracking-wider">
          <span>←</span>
          <span>ВХОД</span>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2 mx-auto min-w-max">
            {HALL_LAYOUT.map(({ row, left, right }) => (
              <div key={row} className="flex items-center justify-center gap-[6px] sm:gap-2 md:gap-2.5 lg:gap-3">
                {/* Left section */}
                <div className="flex items-center gap-[6px] sm:gap-2 md:gap-2.5 lg:gap-3">
                  {left.map((pair, i) => renderPair(row, pair, i))}
                </div>

                {/* Center "stairs" — row label */}
                <div className="flex items-center justify-center flex-shrink-0">
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] font-bold text-gray-300 px-1 sm:px-1.5 md:px-2 py-0.5 rounded bg-cinema-card/40 border border-cinema-border/40 whitespace-nowrap">
                    {row} ряд
                  </span>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-[6px] sm:gap-2 md:gap-2.5 lg:gap-3">
                  {right.map((pair, i) => renderPair(row, pair, i))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom entrance bar */}
      <div className="mt-5 flex flex-col items-center">
        <div className="w-3/4 h-1.5 bg-cinema-red rounded-full mb-2" />
        <span className="text-[11px] text-gray-500 border border-dashed border-gray-700 px-4 py-1 rounded">↑ ВХОД</span>
      </div>
    </div>
  )
}
