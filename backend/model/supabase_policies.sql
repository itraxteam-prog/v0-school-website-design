-- Enable Row Level Security on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Note: Since the application handles authentication via a custom backend service (using bcrypt/jwt),
-- these policies are designed for a standard Supabase Auth implementation.
-- The backend API uses the Service Role Key to bypass these policies when serving requests,
-- ensuring that the application logic (RBAC in code) is the primary enforcement mechanism.
-- These RLS policies act as a defense-in-depth layer if direct database access is ever exposed.

-- STUDENTS TABLE POLICIES
-- Policy: Students can only read their own records
CREATE POLICY "Students can view own profile" ON public.students
FOR SELECT
USING (auth.uid() = id);

-- Policy: Teachers can read students in their classes
-- Assumes a function `is_student_in_teacher_class(student_id, teacher_id)` exists or direct query
-- Simplified: Teachers can view all students (as per some implementations) or restricted by class.
-- Here we use a subquery approach (assuming auth.uid() is the teacher's ID)
CREATE POLICY "Teachers can view class students" ON public.students
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.classes c
    WHERE c.classTeacherId = auth.uid()
    AND id = public.students.classId
  )
);

-- Policy: Admins can do everything
-- We assume Admin role is checked via a custom claim or a roles table lookup
-- For simplicity in this SQL example, we assume a custom claim 'role'
CREATE POLICY "Admins have full access to students" ON public.students
USING (auth.jwt() ->> 'role' = 'admin');


-- ANNOUNCEMENTS TABLE POLICIES
-- Policy: Students and Teachers can read announcements targeted to them
CREATE POLICY "View announcements" ON public.announcements
FOR SELECT
USING (
  targetAudience = 'all' 
  OR targetAudience = (auth.jwt() ->> 'role') || 's' -- e.g. 'students', 'teachers'
);

-- Policy: Admins can manage announcements
CREATE POLICY "Admins manage announcements" ON public.announcements
USING (auth.jwt() ->> 'role' = 'admin');


-- CLASSES TABLE POLICIES
-- Policy: Everyone can view classes
CREATE POLICY "View classes" ON public.classes
FOR SELECT
USING (true);

-- Policy: Only Admins can modify classes
CREATE POLICY "Admins manage classes" ON public.classes
USING (auth.jwt() ->> 'role' = 'admin');


-- USERS TABLE POLICIES (Data protection)
-- Users can read their own user record
CREATE POLICY "Users view own record" ON public.users
FOR SELECT
USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins view all users" ON public.users
FOR SELECT
USING (auth.jwt() ->> 'role' = 'admin');
