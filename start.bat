@echo off
echo 🎨 Paint QR Code Generator System
echo ==================================================
echo.
echo Killing any process on port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    taskkill /PID %%a /F 2>nul
)
echo.
echo Starting application...
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
cd /d "c:\Users\Lenovo\Documents\QR CODE GENERATOR SYSTEM"
npm run dev
pause
