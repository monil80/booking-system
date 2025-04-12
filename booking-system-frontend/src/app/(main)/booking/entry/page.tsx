'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { format } from 'date-fns'
import { CalendarIcon, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useBookingStore } from '@/lib/stores/booking-store'
import { TimePickerDemo } from '@/common/components/time-picker'
import { toast } from 'sonner'
import { navPath } from '@/common/config/nav-path'
import { IBooking } from '@/common/entity/IDBBooking'
import { useAuth } from '@/common/context/auth-context'

const bookingSchema = z
  .object({
    customer_name: z.string().min(2, 'Customer name must be at least 2 characters'),
    customer_email: z.string().email('Please enter a valid email address'),
    booking_date: z.date({
      required_error: 'Please select a date'
    }),
    booking_type: z.enum(['full_day', 'half_day', 'custom'], {
      required_error: 'Please select a booking type'
    }),
    booking_slot: z.enum(['first_half', 'second_half']).optional(),
    from_time: z.string().nullable(),
    to_time: z.string().nullable()
  })
  .refine(
    data => {
      if (data.booking_type === 'half_day' && !data.booking_slot) {
        return false
      }
      return true
    },
    {
      message: 'Please select a booking slot',
      path: ['bookingSlot']
    }
  )
  .refine(
    data => {
      if (data.booking_type === 'custom' && (!data.from_time || !data.to_time)) {
        return false
      }
      return true
    },
    {
      message: 'Please select start and end times',
      path: ['startTime']
    }
  )

type BookingFormValues = z.infer<typeof bookingSchema>

export default function BookingEntryPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { addBooking, checkAvailability } = useBookingStore()

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customer_name: '',
      customer_email: '',
      booking_type: undefined
    }
  })
  const auth = useAuth()

  const bookingType = form.watch('booking_type')

  async function onSubmit(data: BookingFormValues) {
    setIsLoading(true)

    try {
      // Check availability based on booking type

      const isAvailable = checkAvailability({
        ...data,
        id: 0,
        created_at: new Date(),
        user_id: auth.user?.id || 0
      })

      if (!isAvailable) {
        toast.error(
          'Booking not available The selected time slot is already booked or conflicts with existing bookings.'
        )
        setIsLoading(false)
        return
      }

      // Add booking
      const newBooking: IBooking = {
        id: 0,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        booking_date: data.booking_date,
        booking_type: data.booking_type,
        booking_slot: data.booking_slot,
        from_time: data.from_time,
        to_time: data.to_time,
        created_at: new Date(),
        user_id: auth.user?.id || 0
      }

      addBooking(newBooking)

      // Show success message

      toast.error('Booking created successfully!')

      // Reset form
      form.reset()

      // Redirect to booking list
      setTimeout(() => {
        router.push(navPath.bookingList)
      }, 1500)
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='max-w-2xl mx-auto p-2'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold'>Create New Booking</h1>
        <p className='text-slate-500'>Enter booking details below</p>
      </div>

      <div className='bg-white p-6 rounded-lg border border-slate-200 shadow-sm'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='customer_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder='John Doe' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='customer_email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Email</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='business@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='booking_date'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Booking Date</FormLabel>
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
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={date => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='booking_type'
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
                      <SelectItem value='fullDay'>Full Day</SelectItem>
                      <SelectItem value='halfDay'>Half Day</SelectItem>
                      <SelectItem value='custom'>Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the type of booking you want to create</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {bookingType === 'half_day' && (
              <FormField
                control={form.control}
                name='booking_slot'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Slot</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select booking slot' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='firstHalf'>First Half (Morning)</SelectItem>
                        <SelectItem value='secondHalf'>Second Half (Afternoon)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {bookingType === 'custom' && (
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='from_time'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <div className='flex items-center'>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value || 'Select time'}
                                <Clock className='ml-auto h-4 w-4 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-4' align='start'>
                            <TimePickerDemo setTime={time => field.onChange(time)} current={field.value || ''} />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='to_time'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <div className='flex items-center'>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value || 'Select time'}
                                <Clock className='ml-auto h-4 w-4 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-4' align='start'>
                            <TimePickerDemo setTime={time => field.onChange(time)} current={field.value || ''} />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? 'Creating booking...' : 'Create Booking'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
