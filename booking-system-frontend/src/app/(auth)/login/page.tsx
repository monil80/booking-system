'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { authLogin } from '@/common/services/auth'
import { navPath } from '@/common/config/nav-path'
import { useAuth } from '@/common/context/auth-context'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password_hash: z.string().min(1, 'Password is required')
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setUser } = useAuth()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password_hash: ''
    }
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)

    try {
      // Find user
      const user = await authLogin(data)

      // Check if user exists
      if (!user?.data) {
        toast.error(user?.message || 'Invalid credentials The email or password you entered is incorrect.')
        return
      }
      // Check if user is verified
      if (user.data.is_verified) {
        setUser(user.data)
        toast.success('Login successful! Redirecting to dashboard...')
        router.push(navPath.home)
        return
      }
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Welcome back</h1>
          <p className='text-sm text-slate-500 mt-2'>Enter your credentials to access your account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='business@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password_hash'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='••••••••' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex items-center justify-end'>
              <Button variant='link' className='p-0 h-auto' asChild>
                <Link href='/forgot-password'>Forgot password?</Link>
              </Button>
            </div>

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Form>

        <div className='text-center text-sm'>
          Don&apos;t have an account?{' '}
          <Link href='/signup' className='font-medium text-primary hover:underline'>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
