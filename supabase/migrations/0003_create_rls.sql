-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Standard RLS Policies (Example)
-- In production, these should be more granular based on roles

-- Users can read their own profile
CREATE POLICY "Users can view own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

-- Service role has full access
-- Note: Supabase service role bypasses RLS by default, but explicit policies help clarity
