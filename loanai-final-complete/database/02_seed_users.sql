-- ============================================
-- SAMPLE USERS FOR TESTING
-- Password: "password123" (hashed with BCrypt)
-- ============================================

\c loan_system;

-- BCrypt hash of "password123"
-- In production, generate these with: BCrypt.hashpw("password123", BCrypt.gensalt())

INSERT INTO users (username, password_hash, role, account_number) VALUES
-- Customer users (linked to accounts from your CSV)
('user_600800906', '$2a$10$rO8qDXvMxC6EjqZ.k1gGfu5yN6vKzE4sH7lJxL9WxN5YxPyP0J4Ua', 'customer', '600800906'),

-- Admin user
('admin', '$2a$10$rO8qDXvMxC6EjqZ.k1gGfu5yN6vKzE4sH7lJxL9WxN5YxPyP0J4Ua', 'admin', NULL),

-- Manager user
('manager', '$2a$10$rO8qDXvMxC6EjqZ.k1gGfu5yN6vKzE4sH7lJxL9WxN5YxPyP0J4Ua', 'manager', NULL)

ON CONFLICT (username) DO NOTHING;

-- Verify
SELECT username, role, account_number, created_at FROM users;

COMMIT;

-- ============================================
-- LOGIN CREDENTIALS FOR TESTING
-- ============================================
/*
CUSTOMER LOGIN:
Username: user_600800906
Password: password123

ADMIN LOGIN:
Username: admin
Password: password123

MANAGER LOGIN:
Username: manager
Password: password123
*/
