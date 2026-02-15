@echo off
echo ============================================
echo LOANAI DATABASE SEED SCRIPT
echo ============================================
echo.
echo This script will populate your database with test data.
echo.
echo IMPORTANT: You will be prompted for your PostgreSQL password.
echo If you don't know it, press Ctrl+C to cancel and use pgAdmin instead.
echo.
pause

set PGPATH=C:\Program Files\PostgreSQL\18\bin
set DBNAME=loan_system
set USERNAME=postgres
set SQLFILE=%~dp0loanai-final-complete\database\verify_and_seed.sql

echo.
echo Connecting to PostgreSQL...
echo Database: %DBNAME%
echo User: %USERNAME%
echo SQL File: %SQLFILE%
echo.

"%PGPATH%\psql.exe" -U %USERNAME% -d %DBNAME% -f "%SQLFILE%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo SUCCESS! Database seeded successfully!
    echo ============================================
    echo.
    echo Test Account 1: 600800906
    echo Test Account 2: 8714686276983823
    echo All users password: password123
    echo.
    echo Next steps:
    echo 1. Refresh your browser (Ctrl+F5)
    echo 2. Try account verification with: 600800906
    echo.
) else (
    echo.
    echo ============================================
    echo ERROR! Database seeding failed.
    echo ============================================
    echo.
    echo Please use pgAdmin instead:
    echo 1. Open pgAdmin
    echo 2. Connect to PostgreSQL
    echo 3. Right-click loan_system database
    echo 4. Select "Query Tool"
    echo 5. Open file: %SQLFILE%
    echo 6. Click Execute (F5)
    echo.
)

pause
