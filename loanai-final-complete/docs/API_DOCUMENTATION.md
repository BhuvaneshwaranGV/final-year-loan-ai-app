# 📡 LOANAI API DOCUMENTATION

Complete REST API reference for all endpoints.

---

## 🔑 AUTHENTICATION APIS

### POST /api/auth/login
**Description:** User login with username and password

**Request:**
```json
{
  "username": "user_600800906",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "username": "user_600800906",
  "role": "customer",
  "accountNumber": "600800906"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

---

### POST /api/account/verify
**Description:** Verify account exists and return customer data for auto-fill

**Request:**
```json
{
  "accountNumber": "600800906"
}
```

**Response (Success):**
```json
{
  "success": true,
  "account": {
    "accountNumber": "600800906",
    "bankName": "ICICI Bank",
    "balance": 22877.00
  },
  "customer": {
    "cifNumber": "CIF100009",
    "name": "K.Kamal",
    "age": 22,
    "phone": "+919876925617",
    "email": "kdg@gmail.com",
    "employmentType": "Salaried",
    "youngFirstBorrower": 1
  }
}
```

**Response (Error - Not Found):**
```json
{
  "success": false,
  "message": "Account number not found in our system",
  "accountNumber": "600800906"
}
```

---

### POST /api/otp/send
**Description:** Generate and send OTP to email (2-minute expiry)

**Request:**
```json
{
  "accountNumber": "600800906",
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to user@example.com and printed in console",
  "email": "user@example.com",
  "expiresIn": "2 minutes"
}
```

**Notes:**
- OTP is sent to the email provided in request (NOT from database)
- OTP is also printed in backend console
- Expiry: 2 minutes
- Max attempts: 3

---

### POST /api/otp/verify
**Description:** Verify OTP code

**Request:**
```json
{
  "accountNumber": "600800906",
  "otp": "123456"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "email": "user@example.com"
}
```

**Response (Error - Invalid):**
```json
{
  "success": false,
  "message": "Invalid OTP",
  "attemptsRemaining": 2
}
```

**Response (Error - Expired):**
```json
{
  "success": false,
  "message": "OTP expired. Please request a new one."
}
```

---

## 💰 LOAN APIS

### POST /api/loans/apply
**Description:** Submit loan application and get ML prediction

**Request:** (Complete LoanApplication object)
```json
{
  "cifNumber": "CIF100009",
  "accountNumber": "600800906",
  "applicantName": "K.Kamal",
  "email": "user@example.com",
  "phone": "+919876925617",
  "age": 22,
  "maritalStatus": "Single",
  "dependents": 0,
  "educationLevel": "Graduate",
  "monthlyIncome": 56556.00,
  "employmentYears": 4,
  "employmentType": "Salaried",
  "creditScore": 750,
  "existingDebt": 45000.00,
  "hasProperty": true,
  "loanAmount": 500000.00,
  "loanPurpose": "Home Loan",
  "tenureYears": 20
}
```

**Response:**
```json
{
  "applicationId": 1,
  "cifNumber": "CIF100009",
  "email": "user@example.com",
  "decision": "APPROVED",
  "status": "PROCESSED",
  "riskScore": 785,
  "riskCategory": "LOW",
  "approvalProbability": 0.87,
  "recommendedInterestRate": 8.5,
  "simulatedCibil": 780,
  "foir": 45.5,
  "calculatedEmi": 34125.00,
  "fraudScore": 0,
  "fraudFlags": "[]",
  "transactionAnalysis": {
    "salaryCreditCount": 12,
    "savingsRate": 0.25,
    "avgBalance": 45000.00,
    "fraudCount": 0
  },
  "appliedAt": "2026-02-14T10:30:00",
  "processedAt": "2026-02-14T10:30:03"
}
```

---

### GET /api/loans/{id}
**Description:** Get loan application by ID

**Response:**
```json
{
  "applicationId": 1,
  "applicantName": "K.Kamal",
  "loanAmount": 500000.00,
  "decision": "APPROVED",
  "status": "PROCESSED",
  // ... all fields
}
```

---

### GET /api/loans/track
**Description:** Track loan applications

**Parameters:**
- `email` (optional): Filter by email
- `id` (optional): Filter by application ID

**Example:** `/api/loans/track?email=user@example.com`

**Response:**
```json
[
  {
    "applicationId": 1,
    "applicantName": "K.Kamal",
    "loanAmount": 500000.00,
    "decision": "APPROVED",
    "appliedAt": "2026-02-14T10:30:00"
  }
]
```

---

### GET /api/loans/dashboard/stats
**Description:** Get dashboard statistics

**Response:**
```json
{
  "total": 100,
  "approved": 65,
  "rejected": 25,
  "pending_review": 10,
  "approval_rate": 65.0
}
```

---

## 👤 ADMIN APIS

### GET /api/admin/pending-reviews
**Description:** Get applications pending manual review

**Response:**
```json
[
  {
    "applicationId": 5,
    "applicantName": "John Doe",
    "loanAmount": 1000000.00,
    "decision": "MANUAL_REVIEW",
    "status": "MANUAL_REVIEW_PENDING",
    "fraudScore": 4,
    "fraudFlags": "[\"HIGH_FOIR\", \"INCOME_LOAN_MISMATCH\"]",
    "appliedAt": "2026-02-14T09:15:00"
  }
]
```

---

### PUT /api/admin/loans/{id}/decision
**Description:** Admin override decision

**Request:**
```json
{
  "decision": "APPROVED",
  "reviewerName": "Admin User",
  "comments": "Verified income sources manually. Approved after review."
}
```

**Response:**
```json
{
  "applicationId": 5,
  "decision": "APPROVED",
  "originalDecision": "MANUAL_REVIEW",
  "reviewedBy": "Admin User",
  "reviewedAt": "2026-02-14T11:00:00",
  "reviewComments": "Verified income sources manually. Approved after review.",
  "status": "PROCESSED"
}
```

---

### GET /api/admin/applications
**Description:** Get all applications with filters

**Parameters:**
- `status` (optional): Filter by status
- `decision` (optional): Filter by decision

**Example:** `/api/admin/applications?decision=REJECTED`

**Response:**
```json
[
  {
    "applicationId": 3,
    "applicantName": "Jane Smith",
    "loanAmount": 2000000.00,
    "decision": "REJECTED",
    "rejectionReason": "High fraud score (7/10)",
    "appliedAt": "2026-02-14T08:00:00"
  }
]
```

---

## 🤖 ML SERVICE APIS

### POST /predict
**Description:** ML prediction endpoint (called by backend)

**URL:** `http://localhost:5000/predict`

**Request:**
```json
{
  "cif_number": "CIF100009",
  "age": 22,
  "monthly_income": 56556,
  "employment_years": 4,
  "loan_amount": 500000,
  "existing_debt": 45000,
  "foir": 0.455,
  "young_first_borrower_flag": 1
}
```

**Response:**
```json
{
  "approval_probability": 0.87,
  "risk_score": 785,
  "risk_category": "LOW",
  "decision": "APPROVED",
  "recommended_interest_rate": 8.5,
  "simulated_cibil": 780,
  "transaction_analysis": {
    "simulated_cibil": 780,
    "salary_count": 12,
    "savings_rate": 0.25,
    "fraud_count": 0,
    "avg_balance": 45000.0,
    "cash_dependency": 0.15
  },
  "fraud_detection": {
    "fraud_score": 0,
    "fraud_flags": [],
    "fraud_risk": "LOW"
  }
}
```

---

### GET /health
**Description:** ML service health check

**URL:** `http://localhost:5000/health`

**Response:**
```json
{
  "status": "healthy",
  "model": "XGBoost",
  "database": "PostgreSQL (loan_system)",
  "features": [
    "Transaction Analysis",
    "Simulated CIBIL",
    "Fraud Detection (9 patterns)",
    "Young Borrower Support"
  ]
}
```

---

### POST /retrain
**Description:** Retrain ML model from database

**URL:** `http://localhost:5000/retrain`

**Response:**
```json
{
  "success": true,
  "message": "Model retrained successfully"
}
```

---

## 🔒 ERROR CODES

| Code | Message | Description |
|------|---------|-------------|
| 200 | Success | Request successful |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication failed |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

---

## 📝 COMMON RESPONSE PATTERNS

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (dev mode only)"
}
```

---

## 🧪 TESTING WITH CURL

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user_600800906","password":"password123"}'
```

### Verify Account
```bash
curl -X POST http://localhost:8080/api/account/verify \
  -H "Content-Type: application/json" \
  -d '{"accountNumber":"600800906"}'
```

### Send OTP
```bash
curl -X POST http://localhost:8080/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{"accountNumber":"600800906","email":"user@example.com"}'
```

### Get Dashboard Stats
```bash
curl http://localhost:8080/api/loans/dashboard/stats
```

---

## 📊 RATE LIMITS

- **General APIs:** 100 requests/minute
- **OTP Send:** 5 requests/15 minutes per account
- **Login:** 10 attempts/15 minutes per IP

---

## 🔐 SECURITY HEADERS

All responses include:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

---

**Need Help?** Contact support@loanai.com
