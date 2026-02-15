# Alternative PowerShell script to seed database
# Run this if the batch file doesn't work

$pgPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
$dbName = "loan_system"
$userName = "postgres"
$sqlFile = "c:\Users\gvbhu\OneDrive\Desktop\master loan ai\loanai-final-complete\database\verify_and_seed.sql"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "LOANAI DATABASE SEED SCRIPT" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Database: $dbName" -ForegroundColor Yellow
Write-Host "User: $userName" -ForegroundColor Yellow
Write-Host "SQL File: $sqlFile" -ForegroundColor Yellow
Write-Host ""
Write-Host "You will be prompted for your PostgreSQL password..." -ForegroundColor Green
Write-Host ""

try {
    & $pgPath -U $userName -d $dbName -f $sqlFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "============================================" -ForegroundColor Green
        Write-Host "SUCCESS! Database seeded successfully!" -ForegroundColor Green
        Write-Host "============================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Test Account 1: 600800906" -ForegroundColor Cyan
        Write-Host "Test Account 2: 8714686276983823" -ForegroundColor Cyan
        Write-Host "All users password: password123" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Refresh your browser (Ctrl+F5)" -ForegroundColor White
        Write-Host "2. Try account verification with: 600800906" -ForegroundColor White
    }
}
catch {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Red
    Write-Host "ERROR! Database seeding failed." -ForegroundColor Red
    Write-Host "============================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please use pgAdmin instead:" -ForegroundColor Yellow
    Write-Host "1. Open pgAdmin" -ForegroundColor White
    Write-Host "2. Connect to PostgreSQL" -ForegroundColor White
    Write-Host "3. Right-click loan_system database" -ForegroundColor White
    Write-Host "4. Select 'Query Tool'" -ForegroundColor White
    Write-Host "5. Open file: $sqlFile" -ForegroundColor White
    Write-Host "6. Click Execute (F5)" -ForegroundColor White
}

Write-Host ""
Read-Host "Press Enter to exit"
