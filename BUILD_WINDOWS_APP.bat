@echo off
REM Windows App Builder Script for Paint QR Generator
REM This script builds the Windows desktop application

echo.
echo ================================================
echo   Paint QR Generator - Windows App Builder
echo ================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [1/5] Node.js version:
node --version
echo.

echo [2/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully
echo.

echo [3/5] Building React frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build React app
    pause
    exit /b 1
)
echo React build completed
echo.

echo [4/5] Building Windows installer...
echo This may take a few minutes...
call npm run electron-build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build Electron app
    pause
    exit /b 1
)
echo Windows build completed
echo.

echo [5/5] Build Summary
echo ================================================
echo.
echo SUCCESS! Your Windows app has been built.
echo.
echo Output files are in the 'dist' folder:
echo   - Paint QR Generator Setup 1.0.0.exe (Installer)
echo   - Paint QR Generator 1.0.0.exe (Portable)
echo.
echo Next steps:
echo   1. Navigate to the 'dist' folder
echo   2. Run the installer or portable executable
echo   3. Follow the installation wizard
echo.
echo For development/testing, run:
echo   npm run electron-dev
echo.
echo For more info, see: WINDOWS_APP_BUILD_GUIDE.md
echo.
echo ================================================

pause
