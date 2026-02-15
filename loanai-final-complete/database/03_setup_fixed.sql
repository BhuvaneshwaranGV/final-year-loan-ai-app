-- ============================================
-- FIXED DATABASE SETUP SCRIPT
-- Creates missing master tables and seeds data
-- ============================================

\c loan_system;

-- 1. Create CUSTOMER_MASTER
CREATE TABLE IF NOT EXISTS customer_master (
    customer_id VARCHAR(50) PRIMARY KEY,
    cif_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(200),
    dob DATE,
    age INTEGER,
    gender VARCHAR(10),
    pan_number VARCHAR(20),
    aadhaar_masked VARCHAR(20),
    mobile VARCHAR(15),
    email VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(100),
    employment_type VARCHAR(50),
    employer_name VARCHAR(200),
    monthly_income_declared DECIMAL(15,2),
    risk_profile VARCHAR(50),
    kyc_status VARCHAR(50),
    young_first_borrower_flag INTEGER
);

-- 2. Create ACCOUNT_MASTER
CREATE TABLE IF NOT EXISTS account_master (
    account_number VARCHAR(20) PRIMARY KEY,
    cif_number VARCHAR(50),
    bank_name VARCHAR(100),
    branch_name VARCHAR(100),
    branch_code VARCHAR(20),
    ifsc_code VARCHAR(20),
    micr_code VARCHAR(20),
    account_type VARCHAR(50),
    account_open_date DATE,
    account_status VARCHAR(50),
    current_balance DECIMAL(15,2),
    FOREIGN KEY (cif_number) REFERENCES customer_master(cif_number)
);

-- 3. Create TRANSACTION_HISTORY
CREATE TABLE IF NOT EXISTS transaction_history (
    transaction_id VARCHAR(50) PRIMARY KEY,
    account_number VARCHAR(20),
    bank_name VARCHAR(100),
    transaction_date DATE,
    value_date DATE,
    txn_reference_number VARCHAR(100),
    narration TEXT,
    cheque_number VARCHAR(20),
    debit_amount DECIMAL(15,2),
    credit_amount DECIMAL(15,2),
    balance_after DECIMAL(15,2),
    channel VARCHAR(50),
    counterparty_name VARCHAR(200),
    counterparty_bank VARCHAR(100),
    counterparty_ifsc VARCHAR(20),
    fraud_flag INTEGER,
    fraud_type VARCHAR(100),
    FOREIGN KEY (account_number) REFERENCES account_master(account_number)
);

-- 4. Recreate USERS with correct schema
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'admin', 'manager')),
    account_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- 5. Seed Data
-- Seed Customer
INSERT INTO customer_master (customer_id, cif_number, full_name, email, mobile)
VALUES (99999, 'CIF12345678', 'Test Customer', 'test@example.com', '9876543210')
ON CONFLICT (cif_number) DO NOTHING;

-- Seed Account (Linked to Customer)
INSERT INTO account_master (account_number, cif_number, bank_name, current_balance, account_status)
VALUES ('600800906', 'CIF12345678', 'LoanAI Bank', 50000.00, 'ACTIVE')
ON CONFLICT (account_number) DO NOTHING;

-- Seed Users (Linked to Account)
INSERT INTO users (username, password_hash, role, account_number) VALUES
('user_600800906', '$2a$10$rO8qDXvMxC6EjqZ.k1gGfu5yN6vKzE4sH7lJxL9WxN5YxPyP0J4Ua', 'customer', '600800906'),
('admin', '$2a$10$rO8qDXvMxC6EjqZ.k1gGfu5yN6vKzE4sH7lJxL9WxN5YxPyP0J4Ua', 'admin', NULL),
('manager', '$2a$10$rO8qDXvMxC6EjqZ.k1gGfu5yN6vKzE4sH7lJxL9WxN5YxPyP0J4Ua', 'manager', NULL);

COMMIT;
