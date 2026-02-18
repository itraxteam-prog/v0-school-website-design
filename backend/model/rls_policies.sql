-- RLS Policies Audit & Hardening

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements CONFIRM ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 1. Users Table
-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
FOR SELECT USING (auth.uid() = id);

-- Admins can read all user data
CREATE POLICY "Admins can view all users" ON users
FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- 2. Classes Table
-- Everyone can view classes
CREATE POLICY "Public classes view" ON classes
FOR SELECT TO authenticated USING (true);

-- Only admins can modify classes
CREATE POLICY "Admins manage classes" ON classes
FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- 3. Announcements Table
-- Users can view announcements targeted at them or 'all'
CREATE POLICY "View relevant announcements" ON announcements
FOR SELECT TO authenticated USING (
  target_audience IN ('all', (SELECT role || 's' FROM users WHERE id = auth.uid()))
);

-- Teachers and Admins can create announcements
CREATE POLICY "Staff manage announcements" ON announcements
FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- 4. Settings Table
-- Only admins can view/edit institution settings
CREATE POLICY "Admins manage settings" ON settings
FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Hardening: Ensure service_role bypass is only used intentionally in backend services.
-- All client-side queries will strictly follow these policies.
