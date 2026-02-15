# 👤 LOANAI USER GUIDE

Complete guide for using the LoanAI system.

---

## 🚪 LOGGING IN

1. Open http://localhost:3000
2. Enter credentials:
   - **Customer:** user_600800906 / password123
   - **Admin:** admin / password123
3. Click "LOGIN"

**What happens if wrong password?**
- Error message: "Invalid username or password"
- No access granted

---

## 💰 APPLYING FOR A LOAN

### Step 1: Account Verification

1. Click "Apply for Loan"
2. Enter your account number
3. System checks if account exists
4. If found: Shows customer name, bank, balance
5. If not found: Error - "Account not found"

### Step 2: OTP Verification

1. Enter YOUR email address (not from database!)
2. Click "Send OTP"
3. Check TWO places:
   - ✅ Your email inbox
   - ✅ Backend console (for demo)
4. Enter 6-digit OTP
5. Click "Verify OTP"
6. **Note:** OTP expires in 2 minutes, max 3 attempts

### Step 3: Personal Information

**Auto-filled from database:**
- Full Name
- Email
- Phone
- Age
- Employment Type

**You fill:**
- Marital Status
- Dependents
- Education Level

Click "Next"

### Step 4: Financial Details

1. Enter Monthly Income
2. Enter Employment Years
   - ⚠️ **System validates:** Cannot exceed (age - 18)
   - Example: Age 22 → Max 4 years employment
3. Enter Credit Score (optional - can leave empty for simulation)
4. Enter Existing Monthly Debt
5. Select Employment Type
6. Select Education
7. Check "I own property" if applicable

**Real-time FOIR Calculator shows:**
- Your FOIR percentage
- Safe/Warning/Danger indicator
- Calculation breakdown

Click "Next"

### Step 5: Loan Details

1. Select Loan Purpose
2. Enter Loan Amount
3. System shows:
   - Estimated EMI
   - Total payable
   - Interest rate range

Click "Submit Application"

### Step 6: Processing

Watch the progress:
- ✓ Verifying account
- ✓ Analyzing transactions (1.2M records!)
- ✓ Simulating CIBIL score
- ✓ Running fraud detection
- ✓ ML prediction

Takes about 3 seconds

### Step 7: View Results

**If APPROVED:**
- ✅ Green success banner
- Risk Score
- Approval Probability
- Recommended Interest Rate
- Simulated CIBIL Score
- Transaction Analysis Summary
- Print/Download options

**If REJECTED:**
- ❌ Red rejection banner
- **Detailed reasons:**
  - Primary rejection reason
  - All fraud flags detected
  - Transaction analysis
  - How to improve
  - When to reapply
- Download rejection report

**If MANUAL_REVIEW:**
- ⚠️ Yellow warning banner
- All scores shown
- Fraud flags (if any)
- "Wait for admin review" message

---

## 📊 TRACKING APPLICATIONS

1. Click "Track Application"
2. Search by:
   - Application ID
   - Email address
   - Name + Account
3. View status:
   - PENDING
   - PROCESSING
   - APPROVED
   - REJECTED
   - MANUAL_REVIEW

---

## 🔍 FRAUD DETECTION PAGE

1. Click "Fraud Detection" card
2. View all 9 fraud patterns:
   - Age-Employment Mismatch
   - Fake Salary Credits
   - Excessive Cash Transactions
   - High FOIR
   - Multiple Applications
   - Income-Loan Mismatch
   - Suspicious Patterns
   - Low Average Balance
   - Historical Fraud Flags
3. Each pattern shows:
   - How it works
   - Detection criteria
   - Examples
   - Impact level

---

## 💬 USING THE CHATBOT

1. Click "Need Help?" button (bottom-right)
2. Chat window opens
3. Quick options:
   - Loan Types
   - Check Eligibility
   - Required Docs
   - First-Time Borrower
4. Or type your question
5. Get instant answers

---

## 🎯 TIPS FOR APPROVAL

### DO:
✅ Maintain consistent salary credits (6+ in 12 months)
✅ Keep savings rate > 20%
✅ Maintain average balance > ₹25,000
✅ Keep FOIR < 50%
✅ Provide accurate employment history
✅ Ensure age-employment match

### DON'T:
❌ Request loan > 60x monthly income
❌ Have high cash dependency (>30%)
❌ Provide impossible employment years
❌ Apply with FOIR > 70%
❌ Have fraud transactions in history

---

## 🔐 SECURITY

- Never share your OTP
- OTP expires in 2 minutes
- Max 3 OTP attempts
- Passwords are encrypted
- All data is secure

---

## ❓ FAQ

**Q: Why was my loan rejected?**
A: Check the detailed rejection reasons on the result page. Common reasons include high FOIR, fraud flags, or insufficient transaction history.

**Q: Can I reapply after rejection?**
A: Yes! Check the "How to Improve" section and reapply after addressing the issues (usually 6 months).

**Q: What if I don't have a credit score?**
A: Leave it empty! The system will generate a simulated CIBIL score from your transaction history.

**Q: How long does approval take?**
A: Instant! ML prediction in under 3 seconds.

**Q: What if my OTP expires?**
A: Request a new OTP. Each OTP is valid for 2 minutes.

**Q: Can admin override ML decision?**
A: Yes, admin can manually approve/reject after review.

---

## 📞 SUPPORT

Need help? Contact support@loanai.com
