# Architecture Overview

This document describes the technical architecture and design patterns of the Vibe School Management System.

## 🏛 Directory Structure

- `/app`: Next.js App Router pages and API routes.
- `/backend`: Core server-side logic (Services, Controllers, Utils).
- `/components`: Reusable UI components (Shadcn, Layouts).
- `/context`: React Context providers (Auth, etc.).
- `/hooks`: Custom React hooks (useRequireAuth, etc.).
- `/utils`: Common utility functions.

## 🛠 Backend Pattern

We follow a modular Service-Controller pattern:
1. **Services** (`/backend/services`): Contain pure business logic and database interactions.
2. **Controllers** (`/backend/controllers`): Handle response formatting, error logging, and high-level authorization.
3. **API Endpoints** (`/app/api/...`): Entry points that enforce middleware and call the corresponding controllers.

## 🔐 Security Model

### Authentication
- JWT (JSON Web Tokens) managed via `jose` library, stored in `HttpOnly` cookies.
- CSRF protection via middleware checks.
- 2FA support using `speakeasy` and `qrcode`.

### Authorization (RBAC)
- Client-side: `useRequireAuth` hook.
- Server-side: `requireRole` middleware.
- Database: Supabase Row Level Security (RLS).

## 🗄 Database Design

The schema is optimized for a school environment:
- `users`: Core profile and role data.
- `students`/`teachers`: Role-specific extensions.
- `classes`/`periods`: Academic organization.
- `announcements`: Communication layer.
- `settings`: Global institutional config.

## 🚀 Performance
- **Caching**: Next.js `unstable_cache` is implemented at the Service layer for read-heavy operations (e.g., Announcements, Classes, and Academic records) to minimize Supabase load.
- **Data Fetching**: Specific column selection and efficient joins are used in Supabase queries to reduce payload size.
- **UX**: React Skeletons provide a seamless loading experience across all portals.

## 📊 Analytics
Interactive dashboards are powered by `recharts`, fetching aggregated data from the backend to visualize attendance, grade distributions, and enrollment trends.
