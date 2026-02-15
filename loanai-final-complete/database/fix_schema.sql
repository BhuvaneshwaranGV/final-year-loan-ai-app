-- Fix for transaction_history table
ALTER TABLE transaction_history 
ALTER COLUMN fraud_flag TYPE integer 
USING (CASE WHEN fraud_flag::text IN ('true', '1') THEN 1 ELSE 0 END);

-- Ensuring loan_applications is also compatible (if it exists there)
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='loan_applications' AND column_name='fraud_flag') THEN
        ALTER TABLE loan_applications 
        ALTER COLUMN fraud_flag TYPE integer 
        USING (CASE WHEN fraud_flag::text IN ('true', '1') THEN 1 ELSE 0 END);
    END IF;
END $$;
