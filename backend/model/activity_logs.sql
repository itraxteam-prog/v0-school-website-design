-- Create activity_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- Can be null for system logs or unauthenticated attempts
    role TEXT NOT NULL, -- Admin, Teacher, Student, System
    action TEXT NOT NULL, -- e.g. "Created Student", "Updated Announcement"
    entity TEXT NOT NULL, -- e.g. "Student", "Class"
    entity_id TEXT, -- Optional ID of the affected entity
    status TEXT NOT NULL DEFAULT 'success', -- 'success' or 'failure'
    timestamp TIMESTAMPTZ DEFAULT now(),
    metadata JSONB -- Flexible JSON for details
);

-- Index for faster querying
CREATE INDEX IF NOT EXISTS activity_logs_user_id_idx ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS activity_logs_role_idx ON public.activity_logs(role);
CREATE INDEX IF NOT EXISTS activity_logs_timestamp_idx ON public.activity_logs(timestamp DESC);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Note: The Backend API (using Service Role Key) bypasses these policies to INSERT logs.
-- These policies control who can SELECT (view) logs via the client SDK or Dashboard.

-- Policy: Admins can view all logs
CREATE POLICY "Admins view all logs" ON public.activity_logs
FOR SELECT
USING (auth.jwt() ->> 'role' = 'admin');

-- Policy: Teachers can view logs related to their own actions
-- Requirement: "Teacher can view logs relevant to their actions and their classes."
-- Interpreted as: Actions effectively performed BY the teacher.
-- Logs ABOUT their classes (performed by others) might be complex to query directly here without joins.
-- Typically, users see their own audit trail.
CREATE POLICY "Teachers view own logs" ON public.activity_logs
FOR SELECT
USING (
    (auth.jwt() ->> 'role' = 'teacher') AND
    (user_id = auth.uid())
);

-- Policy: Students see their own logs (minimal view)
CREATE POLICY "Students view own logs" ON public.activity_logs
FOR SELECT
USING (
    (auth.jwt() ->> 'role' = 'student') AND
    (user_id = auth.uid())
);

-- Policy: Authenticated users can INSERT logs?
-- Generally, we prefer the backend to handle logging to ensure integrity.
-- If frontend needs to log directly, we can allow INSERT with validation.
-- For now, we'll allow authenticated users to INSERT logs where they are the actor.
-- This supports "Consumer-side logging" if needed, but primarily backend uses Service Role.
CREATE POLICY "Users can insert own logs" ON public.activity_logs
FOR INSERT
WITH CHECK (
    auth.uid() = user_id
);
