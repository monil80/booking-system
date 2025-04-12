'use client'

import { navPath } from '@/common/config/nav-path'
import { IBooking } from '@/common/entity/IDBBooking'
import { IListPage } from '@/common/entity/IListPage'
import { getBookings } from '@/common/services/booking'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useBookingStore } from '@/lib/stores/booking-store'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const filterSchema = z.object({
  search: z.string().optional(),
  date: z.date().optional(),
  bookingType: z.enum(['all', 'fullDay', 'halfDay', 'custom']).default('all')
})

type FilterValues = z.infer<typeof filterSchema>

export default function BookingListPage() {
  const router = useRouter()
  const [pageDetail, setPageDetail] = useState<IListPage>({
    currentPage: 1,
    globalSearch: '',
    rowPerPage: 10,
    sortBy: 'id',
    sortOrder: 'asc'
  })
  const [bookingData, setBookingData] = useState<IBooking[]>([])

  const { bookings } = useBookingStore()

  useEffect(() => {
    ;(async () => {
      const res = await getBookings(pageDetail)
      if (res?.data) setBookingData(res.data)
    })()
  }, [pageDetail])

  const form = useForm<FilterValues>({
    // resolver: zodResolver(filterSchema),
    defaultValues: {
      search: '',
      bookingType: 'all'
    }
  })

  return (
    <div>
      <div className='mb-8 flex justify-between gap-3 p-2'>
        <div>
          <p className='text-slate-500'>View and manage all bookings</p>
        </div>
        <div>
          <Button
            onClick={() => {
              router.push(navPath.bookingEntry + `?id=0`)
            }}
          >
            Create
          </Button>
        </div>
      </div>

      <div className='bg-white p-6 rounded-lg border border-slate-200 shadow-sm mb-6'>
        <Form {...form}>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <FormField
              control={form.control}
              name='search'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                      <Input placeholder='Search by name or email' className='pl-8' {...field} />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='date'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar mode='single' selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='bookingType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select booking type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='all'>All Types</SelectItem>
                      <SelectItem value='fullDay'>Full Day</SelectItem>
                      <SelectItem value='halfDay'>Half Day</SelectItem>
                      <SelectItem value='custom'>Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </Form>
      </div>

      <div className='bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden'>
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
                    <TableCell>{format(booking.booking_date || new Date().toUTCString(), 'PPP')}</TableCell>
                    <TableCell>
                      {booking.booking_type === 'full_day' && 'Full Day'}
                      {booking.booking_type === 'half_day' && 'Half Day'}
                      {booking.booking_type === 'custom' && 'Custom'}
                    </TableCell>
                    <TableCell>
                      {booking.booking_type === 'half_day' &&
                        (booking.booking_slot === 'first_half' ? 'Morning' : 'Afternoon')}
                      {booking.booking_type === 'custom' && `${booking.from_time} - ${booking.to_time}`}
                      {booking.booking_type === 'full_day' && 'All Day'}
                    </TableCell>
                    <TableCell>{format(booking.created_at || new Date().toUTCString(), 'PPP')}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {Math.ceil(pageDetail.total_records || 0 / pageDetail.rowPerPage) > 1 && (
          <div className='py-4 border-t'>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setPageDetail(prev => {
                        const res: IListPage = { ...prev, currentPage: prev.currentPage - 1 }
                        return res
                      })
                    }
                    className={cn(pageDetail.currentPage === 1 && 'pointer-events-none opacity-50')}
                  />
                </PaginationItem>

                {Array.from({
                  length: Math.min(5, Math.ceil(pageDetail.total_records || 0 / pageDetail.rowPerPage))
                }).map((_, i) => {
                  let pageNumber: number

                  if (Math.ceil(pageDetail.total_records || 0 / pageDetail.rowPerPage) <= 5) {
                    pageNumber = i + 1
                  } else if (pageDetail.currentPage <= 3) {
                    pageNumber = i + 1
                  } else if (
                    pageDetail.currentPage >=
                    Math.ceil(pageDetail.total_records || 0 / pageDetail.rowPerPage) - 2
                  ) {
                    pageNumber = Math.ceil(pageDetail.total_records || 0 / pageDetail.rowPerPage) - 4 + i
                  } else {
                    pageNumber = Math.ceil(pageDetail.total_records || 0 / pageDetail.rowPerPage) - 2 + i
                  }

                  if (pageNumber > Math.ceil(pageDetail.total_records || 0 / pageDetail.rowPerPage)) return null

                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => {
                          setPageDetail(prev => {
                            const res: IListPage = { ...prev, currentPage: pageNumber }
                            return res
                          })
                        }}
                        isActive={pageDetail.currentPage === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                {Math.ceil(pageDetail.total_records || 0 / pageDetail.rowPerPage) > 5 &&
                  pageDetail.currentPage < Math.ceil(pageDetail.total_records || 0 / pageDetail.rowPerPage) - 2 && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => {
                            setPageDetail(prev => {
                              const res: IListPage = {
                                ...prev,
                                currentPage: Math.ceil(pageDetail.total_records || 0 / pageDetail.rowPerPage)
                              }
                              return res
                            })
                          }}
                        >
                          {Math.ceil(pageDetail.total_records || 0 / pageDetail.rowPerPage)}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      setPageDetail(prev => {
                        const res: IListPage = {
                          ...prev,
                          currentPage: Math.min(
                            prev.currentPage + 1,
                            Math.ceil(pageDetail.total_records || 0 / pageDetail.rowPerPage)
                          )
                        }
                        return res
                      })
                    }}
                    className={cn(
                      pageDetail.currentPage === Math.ceil(pageDetail.total_records || 0 / pageDetail.rowPerPage) &&
                        'pointer-events-none opacity-50'
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
