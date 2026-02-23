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
- **Database:** [Neon](https://neon.tech/) (PostgreSQL, serverless)
- **ORM:** [Prisma](https://www.prisma.io/) v6
- **Auth:** [NextAuth.js](https://next-auth.js.org/) v4
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Monitoring:** [Sentry](https://sentry.io/)

## 🏁 Getting Started

### Prerequisites

- Node.js >= 20.x
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
   Copy `.env.example` to `.env` and fill in real values:
   ```bash
   cp .env.example .env
   ```
   Required variables:
   ```env
   # Neon pooled URL (runtime queries)
   DATABASE_URL="postgresql://USER:PASS@HOST-pooler.region.aws.neon.tech/DBNAME?sslmode=require&channel_binding=require"
   # Neon direct URL (schema engine / migrations)
   DIRECT_URL="postgresql://USER:PASS@HOST.region.aws.neon.tech/DBNAME?sslmode=require&channel_binding=require"
   NEXTAUTH_SECRET="<openssl rand -hex 32>"
   NEXTAUTH_URL="http://localhost:3000"
   CSRF_SECRET="<openssl rand -hex 32>"
   ```

4. Apply migrations (first run):
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

## 🗄 Database Migrations

### ⚠️ Production Rule — NEVER use `db push` in production

| Command | When to use |
|---|---|
| `npx prisma migrate dev --name <name>` | Local development only — creates new migration files |
| `npx prisma migrate deploy` | **Production & Vercel** — applies pending migrations safely |
| `npx prisma migrate status` | Check for drift or unapplied migrations |
| `npx prisma db pull` | Sync schema from DB during setup |
| ~~`npx prisma db push`~~ | ❌ **NEVER in production** — bypasses migration history |

### Vercel Deployment

In Vercel → Project Settings → Build & Development Settings, the build command is:
```bash
npx prisma migrate deploy && next build
```

This ensures migrations run before each deployment.

## 🏗 Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a detailed technical overview.

## 🔒 Security

- **RLS:** All database tables have Row Level Security enabled.
- **Auth:** JWT-based authentication with cookie storage.
- **2FA:** Optional Two-Factor Authentication via TOTP.

## 📄 License

This project is licensed under the MIT License.
