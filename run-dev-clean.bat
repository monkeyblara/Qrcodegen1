@echo off
cd /d "c:\Users\Lenovo\Documents\QR CODE GENERATOR SYSTEM"
echo Stopping any existing npm processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2
echo.
echo Clearing node_modules cache...
echo.
echo Starting development server...
npm run dev
pause
