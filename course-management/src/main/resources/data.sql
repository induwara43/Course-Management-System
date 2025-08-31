DELETE FROM grades;
DELETE FROM student_enrollments;
DELETE FROM students;
DELETE FROM courses;


INSERT INTO courses (code, title, description, credits) VALUES
                                                            ('CS101', 'Introduction to Computer Science', 'Basic programming concepts and problem solving', 3),
                                                            ('CS201', 'Data Structures', 'Arrays, linked lists, stacks, queues, and trees', 3),
                                                            ('CS301', 'Database Systems', 'Database design, SQL, and database management', 3),
                                                            ('CS401', 'Software Engineering', 'Software development lifecycle and project management', 4);

INSERT INTO students (first_name, last_name, email, phone_number, student_id) VALUES
                                                                                  ('Kumara', 'Perera', 'kumara.perera@university.edu', '0712345678', 'STU001'),
                                                                                  ('Naduni', 'Fernando', 'naduni.fernando@university.edu', '0772345678', 'STU002'),
                                                                                  ('Chathura', 'Silva', 'chathura.silva@university.edu', '0763456789', 'STU003'),
                                                                                  ('Sanduni', 'Wijesinghe', 'sanduni.wijesinghe@university.edu', '0754567890', 'STU004'),
                                                                                  ('Pramuditha', 'Jayawardena', 'pramuditha.jayawardena@university.edu', '0715678901', 'STU005'),
                                                                                  ('Dilani', 'Kumarasinghe', 'dilani.kumarasinghe@university.edu', '0776789012', 'STU006'),
                                                                                  ('Sanath', 'Perera', 'sanath.perera@university.edu', '0767890123', 'STU007'),
                                                                                  ('Chamila', 'De Silva', 'chamila.desilva@university.edu', '0758901234', 'STU008'),
                                                                                  ('Tharindu', 'Senanayake', 'tharindu.senanayake@university.edu', '0719012345', 'STU009'),
                                                                                  ('Nirosha', 'Gunawardena', 'nirosha.gunawardena@university.edu', '0770123456', 'STU010');

INSERT INTO student_enrollments (student_id, course_id) VALUES
                                                            (1, 1), (1, 2), (1, 3), (1, 4),
                                                            (2, 1), (2, 2), (2, 3), (2, 4),
                                                            (3, 1), (3, 2), (3, 3), (3, 4),
                                                            (4, 1), (4, 2), (4, 3), (4, 4),
                                                            (5, 1), (5, 2), (5, 3), (5, 4),
                                                            (6, 1), (6, 2), (6, 3), (6, 4),
                                                            (7, 1), (7, 2), (7, 3), (7, 4),
                                                            (8, 1), (8, 2), (8, 3), (8, 4),
                                                            (9, 1), (9, 2), (9, 3), (9, 4),
                                                            (10,1), (10,2), (10,3), (10,4);

INSERT INTO grades (student_id, course_id, score, letter_grade, grade_point_value, status, grade_date, remarks) VALUES

(1, 1, 88.5, 'A+', 4.00, 'PASS', '2025-06-15', 'Great work'),
(1, 2, 72.0, 'A', 4.00, 'PASS', '2025-06-20', 'Well done'),
(1, 3, 65.0, 'A-', 3.70, 'PASS', '2025-06-25', 'Good'),
(1, 4, 58.0, 'B', 3.00, 'PASS', '2025-06-30', 'Satisfactory'),


(2, 1, 45.0, 'C+', 2.30, 'PASS', '2025-06-15', 'Adequate'),
(2, 2, 38.0, 'C-', 1.70, 'COMPLETE', '2025-06-20', 'Needs improvement'),
(2, 3, 32.0, 'D+', 1.30, 'COMPLETE', '2025-06-25', 'Partial understanding'),
(2, 4, 28.0, 'D', 1.00, 'COMPLETE', '2025-06-30', 'Incomplete tasks'),


(3, 1, 92.0, 'A+', 4.00, 'PASS', '2025-06-15', 'Excellent'),
(3, 2, 89.0, 'A+', 4.00, 'PASS', '2025-06-20', 'Outstanding'),
(3, 3, 85.0, 'A+', 4.00, 'PASS', '2025-06-25', 'Very good'),
(3, 4, 82.0, 'A', 4.00, 'PASS', '2025-06-30', 'Strong'),


(4, 1, 22.0, 'E', 0.00, 'INCOMPLETE', '2025-06-15', 'Absent exam'),
(4, 2, 35.0, 'C-', 1.70, 'COMPLETE', '2025-06-20', 'Minimal passing'),
(4, 3, 40.0, 'C', 2.00, 'PASS', '2025-06-25', 'Satisfactory'),
(4, 4, 55.0, 'B', 3.00, 'PASS', '2025-06-30', 'Good'),


(5, 1, 48.0, 'C+', 2.30, 'PASS', '2025-06-15', 'Adequate'),
(5, 2, 30.0, 'D+', 1.30, 'COMPLETE', '2025-06-20', 'Partial'),
(5, 3, 25.0, 'D', 1.00, 'COMPLETE', '2025-06-25', 'Basic'),
(5, 4, 18.0, 'E', 0.00, 'INCOMPLETE','2025-06-30','Missed assignments'),


(6, 1, 65.0, 'A-', 3.70, 'PASS', '2025-06-15', 'Good'),
(6, 2, 58.0, 'B', 3.00, 'PASS', '2025-06-20', 'Satisfactory'),
(6, 3, 45.0, 'C+', 2.30, 'PASS', '2025-06-25', 'Adequate'),
(6, 4, 33.0, 'D+', 1.30, 'COMPLETE', '2025-06-30', 'Partial'),


(7, 1, 72.0, 'A', 4.00, 'PASS', '2025-06-15', 'Good'),
(7, 2, 69.0, 'A-', 3.70, 'PASS', '2025-06-20', 'Good'),
(7, 3, 50.0, 'B-', 2.70, 'PASS', '2025-06-25', 'Satisfactory'),
(7, 4, 24.0, 'E', 0.00, 'INCOMPLETE','2025-06-30','Needs retake'),


(8, 1, 80.0, 'A', 4.00, 'PASS', '2025-06-15', 'Strong'),
(8, 2, 44.0, 'C', 2.00, 'PASS', '2025-06-20', 'Acceptable'),
(8, 3, 37.0, 'C-', 1.70, 'COMPLETE', '2025-06-25', 'Barely'),
(8, 4, 29.0, 'D', 1.00, 'COMPLETE', '2025-06-30', 'Basic');

