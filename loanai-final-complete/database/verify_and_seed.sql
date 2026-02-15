-- ============================================
-- LOANAI DATABASE VERIFICATION & SEED SCRIPT
-- Run this to verify and populate test data
-- ============================================

\c loan_system;

-- ============================================
-- STEP 1: VERIFY TABLES EXIST
-- ============================================
SELECT 'Checking tables...' AS status;

SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('customer_master', 'account_master', 'transaction_history', 'users', 'otp_records', 'loan_applications')
        THEN '✓ EXISTS'
        ELSE '✗ MISSING'
    END AS status
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('customer_master', 'account_master', 'transaction_history', 'users', 'otp_records', 'loan_applications')
ORDER BY table_name;

-- ============================================
-- STEP 2: SEED TEST CUSTOMER
-- ============================================
SELECT 'Seeding test customer...' AS status;

INSERT INTO customer_master (
    customer_id, 
    cif_number, 
    full_name, 
    email, 
    mobile,
    age,
    employment_type,
    young_first_borrower_flag
)
VALUES (
    '99999', 
    'CIF12345678', 
    'Test Customer', 
    'test@example.com', 
    '9876543210',
    30,
    'Salaried',
    false
)
ON CONFLICT (cif_number) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    mobile = EXCLUDED.mobile,
    age = EXCLUDED.age,
    employment_type = EXCLUDED.employment_type;

-- ============================================
-- STEP 3: SEED TEST ACCOUNTS
-- ============================================
SELECT 'Seeding test accounts...' AS status;

INSERT INTO account_master (
    account_number, 
    cif_number, 
    bank_name, 
    current_balance, 
    account_status
)
VALUES 
    ('600800906', 'CIF12345678', 'LoanAI Bank', 125000.50, 'ACTIVE'),
    ('8714686276983823', 'CIF12345678', 'LoanAI Bank', 250000.00, 'ACTIVE')
ON CONFLICT (account_number) DO UPDATE SET
    current_balance = EXCLUDED.current_balance,
    account_status = EXCLUDED.account_status;

-- ============================================
-- STEP 4: SEED USERS (for login)
-- ============================================
SELECT 'Seeding users...' AS status;

-- Password for all users: password123
INSERT INTO users (username, password_hash, role, account_number) 
VALUES
    ('user_600800906', '$2a$10$rO8qDXvMxC6EjqZ.k1gGfu5yN6vKzE4sH7lJxL9WxN5YxPyP0J4Ua', 'customer', '600800906'),
    ('admin', '$2a$10$rO8qDXvMxC6EjqZ.k1gGfu5yN6vKzE4sH7lJxL9WxN5YxPyP0J4Ua', 'admin', NULL),
    ('manager', '$2a$10$rO8qDXvMxC6EjqZ.k1gGfu5yN6vKzE4sH7lJxL9WxN5YxPyP0J4Ua', 'manager', NULL)
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- STEP 5: VERIFY DATA WAS INSERTED
-- ============================================
SELECT 'Verification Results:' AS status;

SELECT '=== CUSTOMERS ===' AS section;
SELECT customer_id, cif_number, full_name, email, age FROM customer_master WHERE cif_number = 'CIF12345678';

SELECT '=== ACCOUNTS ===' AS section;
SELECT account_number, cif_number, bank_name, current_balance FROM account_master WHERE account_number IN ('600800906', '8714686276983823');

SELECT '=== USERS ===' AS section;
SELECT username, role, account_number FROM users WHERE username IN ('user_600800906', 'admin', 'manager');

-- ============================================
-- STEP 6: TEST ACCOUNT VERIFICATION QUERY
-- ============================================
SELECT 'Testing account verification query...' AS status;

SELECT 
    a.account_number,
    a.bank_name,
    a.current_balance,
    c.cif_number,
    c.full_name,
    c.age,
    c.mobile,
    c.email,
    c.employment_type,
    c.young_first_borrower_flag
FROM account_master a
JOIN customer_master c ON a.cif_number = c.cif_number
WHERE a.account_number = '600800906';

-- ============================================
-- SUMMARY
-- ============================================
SELECT '✓ Database setup complete!' AS status;
SELECT 'Test Account 1: 600800906' AS info;
SELECT 'Test Account 2: 8714686276983823' AS info;
SELECT 'All users password: password123' AS info;
