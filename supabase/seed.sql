-- Insert Branch
INSERT INTO branches (name) VALUES ('BE-CSE') ON CONFLICT (name) DO NOTHING;

-- Insert Exam Types
INSERT INTO exam_types (name) VALUES ('MST1'), ('MST2'), ('EST') ON CONFLICT (name) DO NOTHING;

-- Insert Subjects (Year 1, Sem 1 placeholders)
-- We fetch the branch_id for 'BE-CSE' to link the subjects correctly.
DO $$
DECLARE
    cse_branch_id INTEGER;
BEGIN
    SELECT id INTO cse_branch_id FROM branches WHERE name = 'BE-CSE' LIMIT 1;
    
    INSERT INTO subjects (branch_id, year, semester, name, code) VALUES
    (cse_branch_id, 1, 1, 'Biology', 'BIO101'),
    (cse_branch_id, 1, 1, 'Communication Skills', 'COM101'),
    (cse_branch_id, 1, 1, 'Engineering Chemistry/LTPS', 'CHM101');
END $$;
