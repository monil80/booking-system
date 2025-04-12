import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format } from 'date-fns'
import { IBooking } from '@/common/entity/IDBBooking'

interface BookingState {
  bookings: IBooking[]
  addBooking: (booking: IBooking) => void
  removeBooking: (id: number) => void
  checkAvailability: (params: IBooking) => boolean
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],

      addBooking: booking =>
        set(state => ({
          bookings: [...state.bookings, { ...booking }]
        })),

      removeBooking: id =>
        set(state => ({
          bookings: state.bookings.filter(booking => booking.id !== id)
        })),

      checkAvailability: ({ booking_date, booking_type, booking_slot, from_time, to_time }) => {
        const { bookings } = get()
        if (!booking_date) return false

        const dateStr = format(new Date(booking_date), 'yyyy-MM-dd')

        const bookingsOnSameDay = bookings.filter(
          booking => format(new Date(booking.booking_date ?? ''), 'yyyy-MM-dd') === dateStr
        )

        if (bookingsOnSameDay.length === 0) return true

        const hasFullDayBooking = bookingsOnSameDay.some(booking => booking.booking_type === 'full_day')
        if (hasFullDayBooking) return false

        if (booking_type === 'full_day') {
          return bookingsOnSameDay.length === 0
        }

        if (booking_type === 'half_day') {
          const hasConflictingHalfDay = bookingsOnSameDay.some(
            booking => booking.booking_type === 'half_day' && booking.booking_slot === booking_slot
          )
          if (hasConflictingHalfDay) return false

          const morningEnd = '12:00 PM'
          const afternoonStart = '12:00 PM'

          return !bookingsOnSameDay.some(booking => {
            if (booking.booking_type !== 'custom') return false

            if (booking_slot === 'first_half') {
              return parseTimeToMinutes(booking.from_time!) < parseTimeToMinutes(morningEnd)
            } else {
              return parseTimeToMinutes(booking.to_time!) > parseTimeToMinutes(afternoonStart)
            }
          })
        }

        if (booking_type === 'custom') {
          const hasConflictingHalfDay = bookingsOnSameDay.some(booking => {
            if (booking.booking_type !== 'half_day') return false

            if (booking.booking_slot === 'first_half') {
              return parseTimeToMinutes(from_time!) < parseTimeToMinutes('12:00 PM')
            } else {
              return parseTimeToMinutes(to_time!) > parseTimeToMinutes('12:00 PM')
            }
          })

          if (hasConflictingHalfDay) return false

          return !bookingsOnSameDay.some(booking => {
            if (booking.booking_type !== 'custom') return false
            return (
              parseTimeToMinutes(from_time!) < parseTimeToMinutes(booking.to_time!) &&
              parseTimeToMinutes(to_time!) > parseTimeToMinutes(booking.from_time!)
            )
          })
        }

        return true
      }
    }),
    {
      name: 'booking-storage'
    }
  )
)

// Helper: Convert 12-hour time string to minutes
function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0
  const [time, period] = timeStr.split(' ')
  const [hoursStr, minutesStr] = time.split(':')
  let hours = Number(hoursStr)
  const minutes = Number(minutesStr)

  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0

  return hours * 60 + minutes
}
