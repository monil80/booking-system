'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

import { bookingData } from './_component/data'

export default function PreviewPage() {
  return (
    <div className='bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden p-8'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Time/Slot</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookingData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className='text-center py-8 text-muted-foreground'>
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookingData.map(booking => (
                <TableRow key={booking.id} className={cn('')}>
                  <TableCell>
                    <div>
                      <div className='font-medium'>{booking.customer_name}</div>
                      <div className='text-sm text-muted-foreground'>{booking.customer_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{format(booking.created_at||new Date().toUTCString(), 'PPP')}</TableCell>
                  <TableCell>
                    {booking.booking_type === 'full_day' && 'Full Day'}
                    {booking.booking_type === 'half_day' && 'Half Day'}
                    {booking.booking_type === 'custom' && 'Custom'}
                  </TableCell>
                  <TableCell>
                    {booking.booking_type === 'half_day' &&
                      (booking.booking_slot === 'first_half' ? 'Morning' : 'Afternoon')}
                  </TableCell>
                  <TableCell>{format(booking.created_at||new Date().toUTCString(), 'PPP')}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
