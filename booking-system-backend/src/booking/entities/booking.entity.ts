import { z } from "zod";

export const IBookingZod = z.object({
  id: z.number(),
  customer_name: z.string().min(1),
  customer_email: z.string().email(),
  booking_date: z.string(), // can be refined to `.refine(...)` for date format
  booking_type: z.enum(["full_day", "half_day", "custom"]),
  booking_slot: z.enum(["first_half", "second_half"]).optional(),
  from_time: z.string().nullable(), // ISO time string (e.g., "10:00")
  to_time: z.string().nullable(),
  created_at: z.string(),
  user_id: z.number(),
});
export type IBooking = z.infer<typeof IBookingZod>;

export const bookingDefaultValue: IBooking = {
  customer_name: "",
  customer_email: "",
  booking_date: "",
  booking_type: "custom",
  created_at: "",
  id: 0,
  user_id: 0,
  from_time:null,
  to_time:null
};
