import { Seat } from '../types'

interface Props {
  seats: Seat[]
  selectedSeats: string[]
  onToggle: (seat: Seat) => void
}

// Layout from IRAM CINEMA hall image
const HALL_LAYOUT = [
  { row: 1, seats: [1,2,3,4,5,6,7,8,9,10,11,12], groups: [[1,2],[3,4],[5,6],[7,8],[9,10],[11,12]] },
  { row: 2, seats: [1,2,3,4,5,6,7,8,9,10,11,12], groups: [[1,2],[3,4],[5,6],[7,8],[9,10],[11,12]] },
  { row: 3, seats: [1,2,3,4,5,6,7,8,9,10,11,12], groups: [[1,2],[3,4],[5,6],[7,8],[9,10],[11,12]] },
  { row: 4, seats: [1,2,3,4,5,6,7,8], groups: [[1,2],[3,4],[5,6],[7,8]], gapAfter: 1 },
  { row: 5, seats: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], groups: [[1,2],[3,4],[5,6],[7,8],[9,10],[11,12],[13,14],[15,16]] },
  { row: 6, seats: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], groups: [[1,2],[3,4],[5,6],[7,8],[9,10],[11,12],[13,14],[15,16],[17,18],[19,20]] },
  { row: 7, seats: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], groups: [[1,2],[3,4],[5,6],[7,8],[9,10],[11,12],[13,14],[15,16],[17,18],[19,20]] },
  { row: 8, seats: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24], groups: [[1,2],[3,4],[5,6],[7,8],[9,10],[11,12],[13,14],[15,16],[17,18],[19,20],[21,22],[23,24]] },
]

export default function SeatMap({ seats, selectedSeats, onToggle }: Props) {
  const seatMap = new Map(seats.map(s => [`${s.row}-${s.number}`, s]))

  const getSeatClass = (seat: Seat | undefined, seatNum: number, row: number) => {
    if (!seat) return 'seat-booked'
    const key = seat.id
    const status = seat.status || 'AVAILABLE'
    if (selectedSeats.includes(key)) return 'seat-selected'
    if (status === 'BOOKED' || status === 'RESERVED') return 'seat-booked'
    return 'seat-available'
  }

  return (
    <div className="select-none">
      {/* Screen */}
      <div className="mb-8 text-center">
        <div className="mx-auto w-3/4 h-2 bg-gradient-to-r from-transparent via-cinema-red to-transparent rounded-full mb-2" />
        <p className="text-xs text-gray-500 tracking-widest uppercase">Экран</p>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
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

      {/* Seats */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-max mx-auto space-y-2">
          {HALL_LAYOUT.map(({ row, groups, gapAfter }) => {
            const half = gapAfter ? Math.ceil(groups.length / 2) : null
            return (
              <div key={row} className="flex items-center gap-3">
                {/* Row label left */}
                <span className="text-xs text-gray-600 w-6 text-right flex-shrink-0">{row}</span>

                {/* Groups left side */}
                <div className="flex gap-1.5 items-center">
                  {groups.slice(0, half ?? groups.length).map((group, gi) => (
                    <div key={gi} className="flex gap-0.5">
                      {group.map(num => {
                        const seat = seatMap.get(`${row}-${num}`)
                        const cls = getSeatClass(seat, num, row)
                        const isClickable = seat && (seat.status === 'AVAILABLE' || !seat.status || selectedSeats.includes(seat.id))
                        return (
                          <button
                            key={num}
                            title={`Ряд ${row}, Место ${num}`}
                            onClick={() => isClickable && seat && onToggle(seat)}
                            className={`w-6 h-6 text-[9px] font-medium flex items-center justify-center ${cls}`}
                          >
                            {num}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>

                {/* Row label center */}
                <span className="text-xs font-semibold text-gray-400 w-10 text-center flex-shrink-0">{row} ряд</span>

                {/* Groups right side */}
                <div className="flex gap-1.5 items-center">
                  {groups.slice(half ?? groups.length).map((group, gi) => (
                    <div key={gi} className="flex gap-0.5">
                      {group.map(num => {
                        const seat = seatMap.get(`${row}-${num}`)
                        const cls = getSeatClass(seat, num, row)
                        const isClickable = seat && (seat.status === 'AVAILABLE' || !seat.status || selectedSeats.includes(seat.id))
                        return (
                          <button
                            key={num}
                            title={`Ряд ${row}, Место ${num}`}
                            onClick={() => isClickable && seat && onToggle(seat)}
                            className={`w-6 h-6 text-[9px] font-medium flex items-center justify-center ${cls}`}
                          >
                            {num}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>

                {/* Row label right */}
                <span className="text-xs text-gray-600 w-6 flex-shrink-0">{row}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Entrance */}
      <div className="text-center mt-4">
        <span className="text-xs text-gray-600 border border-dashed border-gray-700 px-4 py-1 rounded">↑ ВХОД</span>
      </div>
    </div>
  )
}
