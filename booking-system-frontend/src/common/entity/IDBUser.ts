import { z } from 'zod'

export const IUserZod = z.object({
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  email: z.string().email(),
  password_hash: z.string().min(6),
  is_verified: z.boolean().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).nullable(),
  token: z.string().nullable(),
  id: z.number(),
  jwt_token: z.string().optional()
})
export type IUser = z.infer<typeof IUserZod>

export const userDefaultValue: IUser = {
  first_name: '',
  last_name: '',
  email: '',
  password_hash: '',
  is_verified: false,
  created_at: '',
  id: 0,
  token: null
}
