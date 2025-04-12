import API from './api'
import { IUser } from '../entity/IDBUser'
import { IHttpResponse } from '../entity/IHttpResponse'

export const signup = async (data: Pick<IUser, 'email' | 'password_hash' | 'first_name' | 'last_name'>) => {
  try {
    const response = await API.post<IHttpResponse<IUser | null>>('/auth/signup', data)
    return response.data
  } catch (error) {
    console.error('Signup error:', error)
   return null
  }
}

export const authLogin = async (data: Partial<IUser>) => {
  try {
    const response = await API.post<IHttpResponse<IUser | null>>('/auth/login', data)
    return response.data
  } catch (error) {
    console.error('Login error:', error)
    return null
  }
}
 
 export const verifyJwt = async (data: { token: string }) => {
   try {
     const response = await API.post<IHttpResponse<IUser | null>>('/auth/verify', data)
     return response.data
   } catch (error) {
     console.error('Verification error:', error)
     return null
   }
 }

export const verifyEmail = async (data: { email: string }) => {
  try {
    const response = await API.post<IHttpResponse<IUser | null>>('/auth/email/verify', data)
    return response.data
  } catch (error) {
    console.error('Verification error:', error)
    return null
  }
}

export const ResendEmail = async (data: { email: string }) => {
  try {
    const response = await API.post<IHttpResponse<IUser | null>>('/auth/email/resend', data)
    return response.data
  } catch (error) {
    console.error('Verification error:', error)
    return null
  }
}
