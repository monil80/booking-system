This is the backend of a full-stack booking system built with NestJS, PostgreSQL, and Prisma. It handles:

✅ User authentication (with email verification)

✅ JWT-based login/session

✅ Booking management with overlap prevention

✅ Scalable and performant API design

🧰 Tech Stack
Framework: NestJS

Database: PostgreSQL

ORM: Prisma

Email: Mailtrap (for dev email verification)

Validation: Zod 

Auth: JWT-based authentication



Getting Started
1. Clone the repo
bash
Copy
Edit
git clone https://github.com/monil80/booking-system.git
cd backend
2. Install dependencies
npm install
3. Setup .env
4. Setup DB and Prisma
npx prisma migrate dev --name init
5. Start the server
npm run dev