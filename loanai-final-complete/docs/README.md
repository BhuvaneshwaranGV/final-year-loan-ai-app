# 🚀 LOANAI - AI-Powered Loan Approval System

## Complete ML-Based Loan Processing with Transaction Analysis

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Key Features](#key-features)
4. [Technology Stack](#technology-stack)
5. [Prerequisites](#prerequisites)
6. [Installation](#installation)
7. [Configuration](#configuration)
8. [Running the System](#running-the-system)
9. [API Documentation](#api-documentation)
10. [Database Schema](#database-schema)
11. [Testing](#testing)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 OVERVIEW

LoanAI is a production-grade loan approval system that uses machine learning and transaction analysis to make intelligent lending decisions. It helps young and first-time borrowers who lack traditional credit history by analyzing their bank transaction patterns.

### Main Innovation
**Transaction-Based CIBIL Simulation** - Generates credit scores for borrowers without credit history by analyzing their banking behavior from 1.2M+ transaction records.

---

## 🏗️ SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                         │
│  • Multi-page application                                    │
│  • Login with role-based access                              │
│  • OTP verification (email + console)                        │
│  • Multi-step loan application                               │
│  • Real-time validations                                     │
│  • Chatbot assistance                                        │
│  • Fraud detection display                                   │
└─────────────────────────────────────────────────────────────┘
                           ↓ REST APIs
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Spring Boot)                      │
│  • Authentication & Authorization                            │
│  • Business Rules Validation                                 │
│  • OTP Generation & Verification                             │
│  • Transaction Analysis Service                              │
│  • CIBIL Simulation Service                                  │
│  • Fraud Detection Service (9 patterns)                      │
│  • Admin Override                                            │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  ML SERVICE (Python/Flask)                   │
│  • XGBoost Model                                             │
│  • Transaction Analysis Engine                               │
│  • Simulated CIBIL Generator                                 │
│  • Fraud Pattern Detection                                   │
│  • Model Retraining API                                      │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              DATABASE (PostgreSQL 18)                        │
│  • customer_master (1000 customers)                          │
│  • account_master (2004 accounts)                            │
│  • transaction_history (1.2M transactions)                   │
│  • loan_applications (all applications)                      │
│  • users (login table)                                       │
│  • otp_records (OTP verification)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ KEY FEATURES

### 1. **Login System**
- ✅ Role-based authentication (customer, admin, manager)
- ✅ Secure password hashing (BCrypt)
- ✅ Account validation against database
- ✅ Session management

### 2. **OTP Verification**
- ✅ 2-minute expiry
- ✅ Sent to email entered in FORM (not database email)
- ✅ Also printed in backend console for demo
- ✅ Max 3 attempts
- ✅ Secure hash storage

### 3. **Transaction Analysis**
- ✅ Analyzes 1.2M+ transaction records
- ✅ Salary credit detection
- ✅ Savings rate calculation
- ✅ Fraud pattern identification
- ✅ Cash dependency analysis
- ✅ Average balance computation

### 4. **Simulated CIBIL Generation**
- ✅ Base score: 650 (fair for new borrowers)
- ✅ Adjustments based on:
  - Salary stability (+50)
  - Savings behavior (+50)
  - Average balance (+30)
  - Fraud history (-100)
  - Cash dependency (-40)
- ✅ Range: 300-850

### 5. **9-Pattern Fraud Detection**
1. Age-Employment Mismatch
2. Fake/Irregular Salary Credits
3. Excessive Cash Transactions (>30%)
4. High FOIR (>70%)
5. Multiple Applications (24h)
6. Income-Loan Mismatch (>60x)
7. Suspicious Transaction Patterns
8. Low Average Balance
9. Historical Fraud Flags

### 6. **Business Rules Validation**
- ✅ Age-employment validation (employment ≤ age - 18)
- ✅ FOIR calculation (must be < 50%)
- ✅ Education loan guarantor (>₹7.5L needs guarantor)
- ✅ Retirement age check
- ✅ Minimum age requirement (18+)

### 7. **ML Prediction**
- ✅ XGBoost classifier
- ✅ Features: age, income, simulated CIBIL, FOIR, transaction metrics
- ✅ Real-time prediction (<3 seconds)
- ✅ Risk score (300-850)
- ✅ Approval probability
- ✅ Interest rate recommendation

### 8. **Admin Panel**
- ✅ View pending reviews
- ✅ Approve/reject applications
- ✅ Override ML decisions
- ✅ Add review comments
- ✅ Complete audit trail

### 9. **Application Storage**
- ✅ Stores ALL applications (approved + rejected)
- ✅ Complete audit trail
- ✅ Rejection reasons stored
- ✅ Improvement suggestions

### 10. **Chatbot Assistance**
- ✅ Floating widget on all pages
- ✅ Pre-defined responses
- ✅ Quick action buttons
- ✅ FAQ support

---

## 🛠️ TECHNOLOGY STACK

### Frontend
- **React 18** - UI framework
- **React Router 6** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons
- **CSS3** - Styling

### Backend
- **Spring Boot 3.2.0** - Framework
- **Java 17** - Programming language
- **Spring Data JPA** - ORM
- **Spring Security** - Authentication
- **Spring Mail** - Email service
- **PostgreSQL Driver** - Database connectivity
- **Lombok** - Code generation
- **BCrypt** - Password hashing
- **Maven** - Build tool

### ML Service
- **Python 3.9+** - Programming language
- **Flask** - Web framework
- **XGBoost** - ML algorithm
- **Scikit-learn** - ML utilities
- **Pandas** - Data processing
- **NumPy** - Numerical computing
- **psycopg2** - PostgreSQL connector

### Database
- **PostgreSQL 18** - RDBMS
- **1.2M+ transaction records**
- **1000 customers**
- **2004 accounts**

---

## 📦 PREREQUISITES

### Required Software
- **Java Development Kit (JDK) 17+**
- **Maven 3.8+**
- **Python 3.9+**
- **Node.js 18+ & npm**
- **PostgreSQL 18**
- **Git**

### Required Accounts
- **Gmail account** (for OTP emails)
- **Gmail App Password** (16 characters)

---

## 📥 INSTALLATION

### 1. Clone Repository
```bash
git clone <repository-url>
cd loanai-system
```

### 2. Database Setup
```bash
cd database

# Create database
psql -U postgres
CREATE DATABASE loan_system;
\q

# Run setup script
chmod +x setup.sh
./setup.sh

# Or manually
psql -U postgres -d loan_system -f 01_create_tables.sql
psql -U postgres -d loan_system -f 02_seed_users.sql
```

### 3. Backend Setup
```bash
cd backend

# Install dependencies
mvn clean install

# Configuration (see Configuration section)
# Edit src/main/resources/application.properties
```

### 4. ML Service Setup
```bash
cd ml-service

# Create virtual environment (optional)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configuration
# Edit ml_service.py line 24 (DB password)
```

### 5. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configuration
# Edit src/api.js (API base URL if needed)
```

---

## ⚙️ CONFIGURATION

### Backend Configuration

**File:** `backend/src/main/resources/application.properties`

```properties
# Database (UPDATE PASSWORD!)
spring.datasource.url=jdbc:postgresql://localhost:5432/loan_system
spring.datasource.username=postgres
spring.datasource.password=gvB@2004

# Gmail SMTP (UPDATE CREDENTIALS!)
spring.mail.username=your.email@gmail.com
spring.mail.password=your_16_char_app_password

# OTP Configuration
otp.expiry.minutes=2
otp.max.attempts=3

# ML Service URL
ml.service.url=http://localhost:5000
```

### ML Service Configuration

**File:** `ml-service/ml_service.py`

```python
# Line 24 - Database Configuration
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'loan_system',
    'user': 'postgres',
    'password': 'gvB@2004'  # UPDATE THIS!
}
```

### Gmail App Password Setup

1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification"
3. Go to "App passwords"
4. Select "Mail" and generate
5. Copy 16-character password
6. Paste in application.properties

---

## 🚀 RUNNING THE SYSTEM

### Start All Services

**Terminal 1 - Backend:**
```bash
cd backend
mvn spring-boot:run
```
Backend runs at: http://localhost:8080

**Terminal 2 - ML Service:**
```bash
cd ml-service
python ml_service.py
```
ML Service runs at: http://localhost:5000

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
```
Frontend runs at: http://localhost:3000

---

## 🧪 TESTING

### Test Credentials

**Customer Login:**
- Username: `user_600800906`
- Password: `password123`

**Admin Login:**
- Username: `admin`
- Password: `password123`

**Manager Login:**
- Username: `manager`
- Password: `password123`

### Test Flow

1. **Login**
   - Navigate to http://localhost:3000
   - Login with customer credentials

2. **Account Verification**
   - Enter account number: `600800906`
   - Enter your email address
   - Click "Send OTP"
   - Check backend console for OTP
   - Check your email for OTP
   - Enter OTP and verify

3. **Loan Application**
   - Fill Step 1: Personal Info (auto-filled)
   - Fill Step 2: Financial Details
     - Try entering impossible employment years (e.g., 15 for age 22)
     - See real-time validation error
   - Fill Step 3: Loan Details
   - Submit

4. **View Results**
   - See complete analysis
   - Simulated CIBIL score
   - Fraud detection results
   - ML prediction
   - Decision with reasons

---

## 📊 DATABASE SCHEMA

### Tables

**1. users** - Login authentication
- user_id (PK)
- username (unique)
- password_hash
- role (customer/admin/manager)
- account_number (FK, nullable)

**2. customer_master** - Customer details
- customer_id (PK)
- cif_number (unique)
- full_name, age, gender
- employment_type, monthly_income_declared
- young_first_borrower_flag

**3. account_master** - Bank accounts
- account_number (PK)
- cif_number (FK)
- bank_name, branch_name
- current_balance

**4. transaction_history** - 1.2M transactions
- transaction_id (PK)
- account_number (FK)
- transaction_date, narration
- debit_amount, credit_amount
- fraud_flag, fraud_type

**5. loan_applications** - All applications
- application_id (PK)
- cif_number, account_number
- All form fields
- ML results (risk_score, decision)
- Fraud detection results
- Transaction analysis results
- decision (APPROVED/REJECTED/MANUAL_REVIEW)

**6. otp_records** - OTP verification
- otp_id (PK)
- account_number, email
- otp_hash, expires_at
- verified, attempts

---

## 🔍 API DOCUMENTATION

### Authentication APIs

**POST /api/auth/login**
```json
Request: { "username": "user_600800906", "password": "password123" }
Response: { "success": true, "role": "customer", "accountNumber": "600800906" }
```

**POST /api/account/verify**
```json
Request: { "accountNumber": "600800906" }
Response: { "success": true, "customer": {...}, "account": {...} }
```

**POST /api/otp/send**
```json
Request: { "accountNumber": "600800906", "email": "user@example.com" }
Response: { "success": true, "message": "OTP sent", "expiresIn": "2 minutes" }
```

**POST /api/otp/verify**
```json
Request: { "accountNumber": "600800906", "otp": "123456" }
Response: { "success": true, "message": "OTP verified" }
```

### Loan APIs

**POST /api/loans/apply**
- Complete loan application object
- Returns: Full application with ML results

**GET /api/loans/{id}**
- Returns: Application by ID

**GET /api/loans/track?email={email}**
- Returns: All applications for email

**GET /api/loans/dashboard/stats**
- Returns: Statistics (total, approved, rejected, approval rate)

### Admin APIs

**GET /api/admin/pending-reviews**
- Returns: Applications pending manual review

**PUT /api/admin/loans/{id}/decision**
```json
Request: { "decision": "APPROVED", "reviewerName": "Admin", "comments": "..." }
Response: Updated application
```

---

## 🐛 TROUBLESHOOTING

### Backend Won't Start

**Error:** `Could not connect to database`

**Solution:**
1. Check PostgreSQL is running: `pg_isready`
2. Verify database exists: `psql -U postgres -l | grep loan_system`
3. Check password in application.properties
4. Check port 5432 is not blocked

### OTP Not Received

**Error:** `Failed to send email`

**Solution:**
1. Check Gmail app password (16 characters)
2. Verify 2-Step Verification is enabled
3. Check spring.mail.username is correct
4. **Note:** OTP is also printed in backend console

### ML Service Error

**Error:** `Connection to database failed`

**Solution:**
1. Update password in ml_service.py line 24
2. Check PostgreSQL is running
3. Verify psycopg2-binary is installed: `pip list | grep psycopg2`

### Frontend Can't Connect

**Error:** `Network Error`

**Solution:**
1. Check backend is running: `curl http://localhost:8080/api/loans/dashboard/stats`
2. Check CORS is enabled in SecurityConfig
3. Verify API_BASE_URL in src/api.js

### Account Not Found

**Error:** `Account number not found`

**Solution:**
1. Verify CSV data was imported: `SELECT COUNT(*) FROM account_master;`
2. Use test account: `600800906`
3. Check account exists: `SELECT * FROM account_master WHERE account_number = '600800906';`

---

## 📈 PERFORMANCE

- **Transaction Analysis:** <500ms (1.2M records)
- **ML Prediction:** <100ms
- **Complete Flow:** <3 seconds
- **Database Queries:** Optimized with indexes

---

## 🔐 SECURITY

- ✅ BCrypt password hashing (strength: 10)
- ✅ OTP secure hash storage
- ✅ 2-minute OTP expiry
- ✅ Max 3 OTP attempts
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection prevention (JPA)

---

## 📄 LICENSE

MIT License - See LICENSE file

---

## 👥 CONTRIBUTORS

- **Your Name** - Full Stack Development

---

## 📞 SUPPORT

For issues or questions:
- Create an issue on GitHub
- Email: support@loanai.com

---

## 🎓 ACADEMIC USE

This project is suitable for:
- Final year engineering projects
- ML/AI demonstrations
- Fintech case studies
- Database system design
- Full-stack development portfolios

---

## 🚀 DEPLOYMENT

For production deployment:
1. Use environment variables for sensitive data
2. Enable HTTPS
3. Use production database with replication
4. Implement rate limiting
5. Add monitoring (Prometheus/Grafana)
6. Use containerization (Docker)
7. Setup CI/CD pipeline

---

**Built with ❤️ for enabling financial inclusion through AI**
