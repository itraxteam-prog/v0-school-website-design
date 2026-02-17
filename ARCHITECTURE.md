# Architecture Overview

This document describes the technical architecture and design patterns of the Vibe School Management System.

## 🏛 Directory Structure

- `/app`: Next.js App Router pages and API routes.
- `/backend`: Core server-side logic (Services, Routes, Utils).
- `/components`: Reusable UI components (Shadcn, Layouts).
- `/context`: React Context providers (Auth, etc.).
- `/hooks`: Custom React hooks (useRequireAuth, etc.).
- `/utils`: Common utility functions.

## 🛠 Backend Pattern

We follow a modular Service-Route pattern:
1. **Services** (`/backend/services`): Contain pure business logic and database interactions.
2. **Routes** (`/backend/routes`): Handle response formatting, error logging, and high-level authorization.
3. **API Controllers** (`/app/api/...`): Entry points that enforce middleware and call the corresponding routes.

## 🔐 Security Model

### Authentication
- JWT stored in `HttpOnly` cookies.
- CSRF protection via middleware.
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
- **Caching**: `unstable_cache` is used for read-heavy API responses (Classes, Announcements).
- **Optimization**: Specific column selection in SQL queries to reduce payload size.
- **Skeletons**: Seamless loading experience across all portals.

## 📊 Analytics
Interactive dashboards are powered by `recharts`, fetching aggregated data from the backend to visualize attendance, grade distributions, and enrollment trends.
