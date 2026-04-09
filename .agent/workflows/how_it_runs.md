---
description: How to run the Loan AI system from start to finish
---

# Operational Workflow: Running Loan AI

Follow these steps to start the entire system. Each component must be running for the application to work correctly.

## Prerequisites
- PostgreSQL 18 installed and running.
- Python 3.10+ installed.
- Node.js installed.
- Java 21+ installed.

## 1. Database Setup
Ensure the `loan_system` database is created and seeded.
// turbo
```powershell
./seed_database.ps1
```

## 2. Start the ML Service
// turbo
```powershell
cd ml-service
python ml_service.py
```
*Port: 5000*

## 3. Start the Backend
// turbo
```powershell
cd backend
./run_backend.bat
```
*Port: 8080*

## 4. Start the Frontend
// turbo
```powershell
cd loanai-frontend-complete
npm run dev
```
*Port: 5173 (usually)*

## Stopping the System
To stop the system, simply close the terminal windows or press `Ctrl+C` in each process.
