@echo off
cd /d "C:\Users\Lenovo\Documents\QR CODE GENERATOR SYSTEM"

echo.
echo ===================================
echo MongoDB Setup - Full Execution
echo ===================================
echo.

echo [1/4] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo [2/4] Seeding initial data...
call npm run seed
if errorlevel 1 (
    echo ERROR: npm run seed failed
    pause
    exit /b 1
)

echo.
echo ===================================
echo Setup Complete!
echo ===================================
echo.
echo [3/4] Starting development server...
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
