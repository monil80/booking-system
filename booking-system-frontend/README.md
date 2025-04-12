# 📆 Booking System Frontend

This is the **Frontend** of the Booking System built using **Next.js App Router**. It handles user signup, login, booking creation, and displays a list of bookings with filters and validations.

---

## 🚀 Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Form Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Code Quality**: ESLint + Prettier

---

## 🧑‍💻 Features

### 🔐 Authentication (Sign Up / Login)

- Signup and login pages
- Fields: First Name, Last Name, Email, Password
- Duplicate emails are not allowed
- Email verification required before login
- Auth state persisted using Zustand
- After login → redirects to booking page

---

### 📋 Booking Entry Page

- Fields:
  - Customer Name
  - Customer Email
  - Booking Date (date picker)
  - Booking Type (Full Day / Half Day / Custom)
  - Booking Slot (First Half / Second Half) → visible only if Half Day
  - Booking Time (From, To) → visible only if Custom
- **Protected Route**: Accessible only after login
- **API Integration** with backend using React Query
- **Validation** for required fields and format

---

### ✅ Booking Rules (Important!)

- Full Day: no other booking allowed for that date.
- Half Day: same slot & full-day bookings are blocked.
- Custom Time: overlaps with existing full, half, or custom are blocked.
- Efficient rule-checking for high-volume booking data (10k+/day)

---

### 📄 Booking List Page

- View all bookings in paginated table
- Filters: Date, Customer Name, Email, Booking Type
- Overlapping bookings visually marked
- React Query used for fetching paginated data
- Fake data seeded for live preview/testing

---

## 🧪 Preview (Fake Data)

- The app shows **fake demo data** to preview the booking list and form behavior without actual backend interaction.
- Once backend is ready, just plug in your API URLs.

---

## 🛠 Setup Instructions

```bash
# 1. Clone the project
git clone https://github.com/monil80/booking-system.git
# 2. Navigate to the project folder
cd booking-system-frontend

# 3. Install dependencies
npm install

# 4. Run development server
npm run dev
