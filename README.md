# Vibe School Management System

A modern, high-performance School Management System built with Next.js 14, Supabase, and Tailwind CSS.

## 🚀 Features

- **Portals:** Dedicated interfaces for Admins, Teachers, Students, and Parents.
- **Security:** 2FA authentication, role-based access control (RBAC), and RLS-hardened database.
- **Analytics:** Institutional performance tracking with interactive charts (Recharts).
- **Communication:** Announcement system with automated email and SMS notifications.
- **Settings:** Detailed institutional profile and academic configuration management.
- **Reporting:** Exportable performance and attendance reports.

## 🛠 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Database/Auth:** [Supabase](https://supabase.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Monitoring:** [Sentry](https://sentry.io/)

## 🏁 Getting Started

### Prerequisites

- Node.js >= 22.14.0
- pnpm 10

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/v0-school-website-design.git
   cd v0-school-website-design
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following:
   ```env
   DATABASE_URL=your_postgres_connection_string
   JWT_SECRET=your_jwt_secret
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. Set up the database:
   Run `backend/model/create_users_table.sql` and `backend/model/seed_users.sql` against your database.
   Default credentials: admin@school.com / NewAdmin@2025!, teacher@school.com / NewTeacher@2025!, student@school.com / NewStudent@2025!

5. Run the development server:
   ```bash
   pnpm run dev
   ```

## 🏗 Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a detailed technical overview.

## 🔒 Security

- **RLS:** All database tables have Row Level Security enabled.
- **Auth:** JWT-based authentication with cookie storage.
- **2FA:** Optional Two-Factor Authentication via TOTP.

## 📄 License

This project is licensed under the MIT License.
