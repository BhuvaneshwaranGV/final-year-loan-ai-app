-- ============================================
-- LOANAI COMPLETE DATABASE SCHEMA
-- PostgreSQL 18
-- Database: loan_system
-- ============================================

-- Connect to database
\c loan_system;

-- ============================================
-- 1. USERS TABLE (Login for all roles)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'admin', 'manager')),
    account_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- 2. CUSTOMER_MASTER (Your existing table)
-- ============================================
-- Assuming this exists with your CSV data
-- Just adding indexes if not present

CREATE INDEX IF NOT EXISTS idx_customer_cif ON customer_master(cif_number);
CREATE INDEX IF NOT EXISTS idx_customer_email ON customer_master(email);

-- ============================================
-- 3. ACCOUNT_MASTER (Your existing table)
-- ============================================
-- Assuming this exists with your CSV data

CREATE INDEX IF NOT EXISTS idx_account_number ON account_master(account_number);
CREATE INDEX IF NOT EXISTS idx_account_cif ON account_master(cif_number);

-- ============================================
-- 4. TRANSACTION_HISTORY (Your existing table)
-- ============================================
-- Assuming this exists with your CSV data

CREATE INDEX IF NOT EXISTS idx_txn_account ON transaction_history(account_number);
CREATE INDEX IF NOT EXISTS idx_txn_date ON transaction_history(transaction_date);
CREATE INDEX IF NOT EXISTS idx_txn_fraud ON transaction_history(fraud_flag);

-- ============================================
-- 5. OTP_RECORDS (New - for OTP verification)
-- ============================================
CREATE TABLE IF NOT EXISTS otp_records (
    otp_id SERIAL PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT false,
    attempts INTEGER DEFAULT 0,
    ip_address VARCHAR(50)
);

CREATE INDEX idx_otp_account ON otp_records(account_number);
CREATE INDEX idx_otp_email ON otp_records(email);
CREATE INDEX idx_otp_expires ON otp_records(expires_at);

-- ============================================
-- 6. LOAN_APPLICATIONS (New - stores ALL applications)
-- ============================================
CREATE TABLE IF NOT EXISTS loan_applications (
    application_id SERIAL PRIMARY KEY,
    
    -- Customer Info
    cif_number VARCHAR(50),
    account_number VARCHAR(20),
    applicant_name VARCHAR(200),
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    
    -- Personal Info (from form)
    age INTEGER,
    marital_status VARCHAR(20),
    dependents INTEGER,
    education_level VARCHAR(50),
    
    -- Financial Info (from form)
    monthly_income DECIMAL(15,2),
    employment_years INTEGER,
    employment_type VARCHAR(50),
    credit_score INTEGER,
    existing_debt DECIMAL(15,2),
    has_property BOOLEAN,
    
    -- Loan Details (from form)
    loan_amount DECIMAL(15,2) NOT NULL,
    loan_purpose VARCHAR(50),
    tenure_years INTEGER,
    
    -- Calculated Fields
    foir DECIMAL(5,2),
    calculated_emi DECIMAL(15,2),
    
    -- Transaction Analysis Results
    simulated_cibil INTEGER,
    salary_credit_count INTEGER,
    savings_rate DECIMAL(5,2),
    avg_balance DECIMAL(15,2),
    fraud_transaction_count INTEGER,
    cash_dependency_rate DECIMAL(5,2),
    
    -- ML Results
    risk_score INTEGER,
    risk_category VARCHAR(20),
    approval_probability DECIMAL(5,2),
    recommended_interest_rate DECIMAL(5,2),
    
    -- DECISION (CRITICAL - stores approved AND rejected)
    decision VARCHAR(50) NOT NULL CHECK (decision IN ('APPROVED', 'REJECTED', 'MANUAL_REVIEW')),
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'PROCESSED', 'MANUAL_REVIEW_PENDING', 'DISBURSED', 'CANCELLED')),
    
    -- Fraud Detection
    fraud_score INTEGER,
    fraud_flags JSONB,  -- Array of detected fraud patterns
    
    -- Rejection Details (if rejected)
    rejection_reason TEXT,
    primary_rejection_reason VARCHAR(200),
    improvement_suggestions TEXT,
    
    -- Admin Review
    reviewed_by VARCHAR(100),
    reviewed_at TIMESTAMP,
    review_comments TEXT,
    original_decision VARCHAR(50),
    
    -- Audit Trail
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (cif_number) REFERENCES customer_master(cif_number),
    FOREIGN KEY (account_number) REFERENCES account_master(account_number)
);

CREATE INDEX idx_loan_decision ON loan_applications(decision);
CREATE INDEX idx_loan_status ON loan_applications(status);
CREATE INDEX idx_loan_email ON loan_applications(email);
CREATE INDEX idx_loan_cif ON loan_applications(cif_number);
CREATE INDEX idx_loan_date ON loan_applications(applied_at);

-- ============================================
-- 7. FRAUD_STATISTICS (Optional - for dashboard)
-- ============================================
CREATE TABLE IF NOT EXISTS fraud_statistics (
    stat_id SERIAL PRIMARY KEY,
    fraud_pattern VARCHAR(100),
    detection_count INTEGER DEFAULT 0,
    amount_prevented DECIMAL(15,2) DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initialize fraud patterns
INSERT INTO fraud_statistics (fraud_pattern, detection_count, amount_prevented) VALUES
('AGE_EMPLOYMENT_MISMATCH', 1234, 8500000.00),
('FAKE_SALARY_CREDITS', 892, 6200000.00),
('EXCESSIVE_CASH_TRANSACTIONS', 567, 3800000.00),
('HIGH_FOIR', 2145, 15000000.00),
('MULTIPLE_APPLICATIONS_24H', 423, 2900000.00),
('INCOME_LOAN_MISMATCH', 1876, 32000000.00),
('SUSPICIOUS_TRANSACTION_PATTERNS', 334, 2300000.00),
('LOW_AVERAGE_BALANCE', 756, 5200000.00),
('HISTORICAL_FRAUD_FLAGS', 1567, 45000000.00)
ON CONFLICT DO NOTHING;

-- ============================================
-- Verification Queries
-- ============================================

-- Check if customer_master exists
SELECT 'customer_master' as table_name, COUNT(*) as record_count 
FROM customer_master;

-- Check if account_master exists
SELECT 'account_master' as table_name, COUNT(*) as record_count 
FROM account_master;

-- Check if transaction_history exists
SELECT 'transaction_history' as table_name, COUNT(*) as record_count 
FROM transaction_history;

COMMIT;
