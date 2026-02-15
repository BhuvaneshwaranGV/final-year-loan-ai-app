# ⚡ LOANAI QUICK START

Get the system running in 30 minutes!

---

## 🎯 PREREQUISITES (5 min)

Install:
- Java 17+: `sudo apt install openjdk-17-jdk`
- Maven: `sudo apt install maven`
- Python 3.9+: `sudo apt install python3 python3-pip`
- Node.js 18+: https://nodejs.org
- PostgreSQL 18: `sudo apt install postgresql`

---

## 🚀 QUICK SETUP

### 1. Database (5 min)

```bash
# Create database
sudo -u postgres psql
CREATE DATABASE loan_system;
\q

# Import
cd database
sudo -u postgres psql -d loan_system -f 01_create_tables.sql
sudo -u postgres psql -d loan_system -f 02_seed_users.sql
```

### 2. Backend (10 min)

```bash
cd backend

# Edit config
nano src/main/resources/application.properties
# Update: password, gmail credentials

# Run
mvn clean install
mvn spring-boot:run
```

### 3. ML Service (5 min)

```bash
cd ml-service
pip install -r requirements.txt

# Edit line 24
nano ml_service.py
# Update: password

# Run
python ml_service.py
```

### 4. Frontend (5 min)

```bash
cd frontend
npm install
npm start
```

### 5. Test (5 min)

1. Open http://localhost:3000
2. Login: user_600800906 / password123
3. Apply for loan
4. See results!

---

## ✅ VERIFICATION

Backend: http://localhost:8080/actuator/health
ML: http://localhost:5000/health
Frontend: http://localhost:3000

---

## 🆘 HELP

Database error? Check password in application.properties
OTP not working? Check Gmail app password
ML error? Update ml_service.py line 24

**Ready in 30 minutes!** 🎉
