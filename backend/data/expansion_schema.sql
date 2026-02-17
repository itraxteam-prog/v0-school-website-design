-- Academic Data Expansion Schema

-- 1. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    code TEXT UNIQUE,
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Academic Records (Grades/Exams)
CREATE TABLE IF NOT EXISTS academic_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    term TEXT NOT NULL, -- e.g., 'Term 1', 'Term 2', 'Final'
    marks_obtained DECIMAL,
    total_marks DECIMAL DEFAULT 100,
    grade TEXT,
    exam_date DATE DEFAULT CURRENT_DATE,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Attendance Records
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('present', 'absent', 'late', 'excused')),
    date DATE DEFAULT CURRENT_DATE,
    recorded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, date)
);

-- RLS Policies for Expansion Tables

-- Subjects (Viewable by everyone authenticated)
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public subjects view" ON subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage subjects" ON subjects FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Academic Records
ALTER TABLE academic_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own records" ON academic_records FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
);
CREATE POLICY "Teachers manage assigned students records" ON academic_records FOR ALL USING (
    EXISTS (
        SELECT 1 FROM classes c 
        JOIN students s ON s.class_id = c.id
        WHERE s.id = academic_records.student_id AND c.classTeacherId = auth.uid()
    ) OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Attendance
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own attendance" ON attendance FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
);
CREATE POLICY "Staff manage attendance" ON attendance FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);
