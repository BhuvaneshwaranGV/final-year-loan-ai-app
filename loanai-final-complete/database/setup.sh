#!/bin/bash
# ============================================
# COMPLETE DATABASE SETUP SCRIPT
# Run this to set up the entire database
# ============================================

echo "=========================================="
echo "LoanAI Database Setup"
echo "=========================================="
echo ""

# Database credentials
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="loan_system"
DB_USER="postgres"
DB_PASSWORD="gvB@2004"

echo "Step 1: Creating tables..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f 01_create_tables.sql

if [ $? -eq 0 ]; then
    echo "✓ Tables created successfully"
else
    echo "✗ Error creating tables"
    exit 1
fi

echo ""
echo "Step 2: Seeding sample users..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f 02_seed_users.sql

if [ $? -eq 0 ]; then
    echo "✓ Sample users created"
else
    echo "✗ Error creating users"
    exit 1
fi

echo ""
echo "=========================================="
echo "Database Setup Complete!"
echo "=========================================="
echo ""
echo "Test Credentials:"
echo "Customer: user_600800906 / password123"
echo "Admin: admin / password123"
echo "Manager: manager / password123"
echo ""
echo "Next steps:"
echo "1. Start backend: cd backend && mvn spring-boot:run"
echo "2. Start ML service: cd ml-service && python ml_service.py"
echo "3. Start frontend: cd frontend && npm run dev"
echo ""
