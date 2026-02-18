-- =====================================================
-- Complete Database Schema for School Management System
-- =====================================================
-- This script creates all necessary tables for authentication
-- Run this FIRST before running seed_users.sql
-- =====================================================

-- Create roles table (if using role-based joins)
CREATE TABLE IF NOT EXISTS public.roles (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default roles
INSERT INTO public.roles (id, name) VALUES 
    ('role-admin', 'admin'),
    ('role-teacher', 'teacher'),
    ('role-student', 'student')
ON CONFLICT (id) DO NOTHING;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    failed_login_attempts INTEGER DEFAULT 0,
    lock_until TIMESTAMPTZ,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret TEXT,
    recovery_codes TEXT[],
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Create index on role for filtering
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users view own record" ON public.users;
DROP POLICY IF EXISTS "Admins view all users" ON public.users;
DROP POLICY IF EXISTS "Service role bypass" ON public.users;

-- RLS Policy: Users can read their own record
CREATE POLICY "Users view own record" ON public.users
FOR SELECT
USING (auth.uid()::text = id);

-- RLS Policy: Admins can view all users
CREATE POLICY "Admins view all users" ON public.users
FOR SELECT
USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policy: Service role can do everything (for backend API)
CREATE POLICY "Service role bypass" ON public.users
USING (auth.role() = 'service_role');

-- Verification query
SELECT 'Schema created successfully!' as status;
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
