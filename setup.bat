@echo off
echo 🎨 Paint QR Code Generator System - Setup Script
echo ==================================================

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version

REM Install root dependencies
echo.
echo 📦 Installing root dependencies...
call npm install

REM Install client dependencies
echo.
echo 📦 Installing client dependencies...
cd client
call npm install
cd ..

echo.
echo ✅ Setup complete!
echo.
echo 📖 To start the development server, run:
echo    npm run dev
echo.
echo 🌐 Frontend will be available at: http://localhost:3000
echo 🔧 Backend API will be available at: http://localhost:5000
echo.
pause
