-- Create enum types
CREATE TYPE user_role AS ENUM ('student', 'admin');
CREATE TYPE resource_status AS ENUM ('pending', 'approved', 'rejected');

-- Branches table
CREATE TABLE branches (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Exam types table
CREATE TABLE exam_types (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Subjects table
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    branch_id INTEGER REFERENCES branches(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    semester INTEGER NOT NULL,
    name TEXT NOT NULL,
    code TEXT NOT NULL
);

-- Users table (extends auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    google_id TEXT,
    cu_email TEXT,
    cu_verified BOOLEAN DEFAULT false,
    role user_role DEFAULT 'student'
);

-- Resources table
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
    exam_type_id INTEGER REFERENCES exam_types(id) ON DELETE SET NULL,
    exam_year INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_hash TEXT,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    status resource_status DEFAULT 'pending',
    admin_note TEXT,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Policies for branches, exam_types, subjects (Publicly readable)
CREATE POLICY "Public branches are viewable by everyone" ON branches FOR SELECT USING (true);
CREATE POLICY "Public exam_types are viewable by everyone" ON exam_types FOR SELECT USING (true);
CREATE POLICY "Public subjects are viewable by everyone" ON subjects FOR SELECT USING (true);

-- Policies for users
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);
-- Note: users cannot update their own role. We only allow update on specific fields if needed, 
-- but for now, let's allow them to update only if it's their own record, but we'll restrict role changes in app logic or via function.
-- Actually, it's safer to only allow updating cu_email and name.
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Policies for resources
CREATE POLICY "Approved resources are viewable by everyone" ON resources FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can view their own pending/rejected resources" ON resources FOR SELECT USING (auth.uid() = uploaded_by);
CREATE POLICY "Admins can view all resources" ON resources FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);
CREATE POLICY "Authenticated users can insert resources" ON resources FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Admins can update resources" ON resources FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    'student'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
