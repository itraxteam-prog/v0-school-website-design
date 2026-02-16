-- =====================================================
-- Seed Users with New Credentials for Supabase
-- =====================================================
-- This script inserts or updates the three default users
-- with new secure passwords for the School Management System
-- 
-- New Credentials:
-- - Admin:   admin@school.com   / Admin@2024!
-- - Teacher: teacher@school.com / Teacher@2024!
-- - Student: student@school.com / Student@2024!
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
    '$2b$10$aUXP3ilFSUwvljx7WKGODe5RSl6Ifs2uM.G30NfzsmnCuWHHwrOYm', -- Admin@2024!
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
    '$2b$10$1p7fHeBWRZAx4EXBMo05iuutSO2H9wcAUN/PBb8DAsMuMVD0AG26m', -- Teacher@2024!
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
    '$2b$10$dr44IHTfKT.HpXKfs0yOXumHHHqD.CycCoKtK5nLQS/yAPzx5/bo.', -- Student@2024!
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
