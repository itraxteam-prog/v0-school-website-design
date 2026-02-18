-- =====================================================
-- Seed Users with New Credentials for Supabase
-- =====================================================
-- This script inserts or updates the three default users
-- with new secure passwords for the School Management System
-- 
-- New Credentials:
-- - Admin:   admin@school.com   / NewAdmin@2025!
-- - Teacher: teacher@school.com / NewTeacher@2025!
-- - Student: student@school.com / NewStudent@2025!
-- =====================================================

-- First, ensure the roles exist (if roles table is being used)
-- If your system doesn't use a separate roles table, skip this section
INSERT INTO roles (id, name) VALUES 
    ('role-admin', 'admin'),
    ('role-teacher', 'teacher'),
    ('role-student', 'student')
ON CONFLICT (id) DO NOTHING;

-- Insert or update users with new credentials
-- Using UPSERT pattern (INSERT ... ON CONFLICT ... DO UPDATE)

-- Admin User
INSERT INTO users (
    id,
    email,
    password,
    name,
    role,
    failed_login_attempts,
    lock_until,
    two_factor_enabled,
    created_at,
    updated_at
) VALUES (
    'u-admin-1',
    'admin@school.com',
    '$2b$10$PfW8bkJsLtvXn2Bh6QEGje1U4zKsC.LTzM9Z7WQ2xEsiBreFCYR4e', -- NewAdmin@2025!
    'Dr. Ahmad Raza',
    'admin',
    0,
    NULL,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (email) 
DO UPDATE SET
    password = EXCLUDED.password,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    failed_login_attempts = 0,
    lock_until = NULL,
    two_factor_enabled = false,
    updated_at = NOW();

-- Teacher User
INSERT INTO users (
    id,
    email,
    password,
    name,
    role,
    failed_login_attempts,
    lock_until,
    two_factor_enabled,
    created_at,
    updated_at
) VALUES (
    'u-teacher-1',
    'teacher@school.com',
    '$2b$10$Wy0qLqUIgOPQN0mk1w0lKOzzmOEZAxmNCBj4bXGepl08cX74xqhTa', -- NewTeacher@2025!
    'Mr. Usman Sheikh',
    'teacher',
    0,
    NULL,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (email) 
DO UPDATE SET
    password = EXCLUDED.password,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    failed_login_attempts = 0,
    lock_until = NULL,
    two_factor_enabled = false,
    updated_at = NOW();

-- Student User
INSERT INTO users (
    id,
    email,
    password,
    name,
    role,
    failed_login_attempts,
    lock_until,
    two_factor_enabled,
    created_at,
    updated_at
) VALUES (
    'u-student-1',
    'student@school.com',
    '$2b$10$cRuVNu86gdIz1bR/1JrXnu5mTPki65aKU0YOsA7yHCAGLlpcFF5UK', -- NewStudent@2025!
    'Ahmed Khan',
    'student',
    0,
    NULL,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (email) 
DO UPDATE SET
    password = EXCLUDED.password,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    failed_login_attempts = 0,
    lock_until = NULL,
    two_factor_enabled = false,
    updated_at = NOW();

-- Verify the users were created/updated
SELECT id, email, name, role, two_factor_enabled, created_at 
FROM users 
WHERE email IN ('admin@school.com', 'teacher@school.com', 'student@school.com')
ORDER BY role;
