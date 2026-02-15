@echo off
title LoanAI Backend Server
echo ==========================================
echo       Starting LoanAI Backend...
echo ==========================================
cd /d "%~dp0"

echo Using Maven from C:\Users\gvbhu\apache-maven-3.9.6\bin
call "C:\Users\gvbhu\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Maven execution failed.
    pause
)
pause
