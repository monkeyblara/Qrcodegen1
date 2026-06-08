@echo off
setlocal enabledelayedexpansion

REM ========================================
REM Quick Heroku CLI Installation & Test
REM ========================================

echo.
echo ========================================
echo  Heroku CLI - Quick Install ^& Test
echo ========================================
echo.

REM Check if heroku is installed
echo Checking for Heroku CLI...
heroku --version >nul 2>&1

if errorlevel 1 (
    echo.
    echo ❌ Heroku CLI is NOT installed
    echo.
    echo Installing via npm (this will take 2-3 minutes)...
    echo.
    
    REM Try npm install
    npm install -g heroku
    
    if errorlevel 1 (
        echo.
        echo ❌ npm install failed
        echo.
        echo MANUAL INSTALLATION REQUIRED:
        echo.
        echo 1. Download Heroku CLI from:
        echo    https://devcenter.heroku.com/articles/heroku-cli
        echo.
        echo 2. Install the .exe file
        echo.
        echo 3. Restart your computer
        echo.
        echo 4. Run this script again
        echo.
        pause
        exit /b 1
    )
    
    echo.
    echo ✓ Heroku CLI installed via npm
) else (
    echo ✓ Heroku CLI is already installed
)

echo.
echo Verifying installation...
heroku --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Verification failed
    echo.
    pause
    exit /b 1
)
echo ✓ Heroku CLI verified
echo.

echo.
echo Checking if logged into Heroku...
heroku auth:whoami >nul 2>&1

if errorlevel 1 (
    echo.
    echo ⚠ You need to login to Heroku
    echo.
    echo Opening Heroku login in browser...
    echo Please complete login in the browser window
    echo.
    heroku login
    if errorlevel 1 (
        echo Login cancelled
        pause
        exit /b 1
    )
) else (
    echo ✓ Already logged into Heroku
)

echo.
echo ========================================
echo  SUCCESS! Heroku CLI is READY!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Close this window
echo 2. Run: DEPLOY_HEROKU.bat
echo 3. Your system deploys in ~10 minutes
echo 4. Check your app URL in the success message!
echo.
echo Press any key to close this window...
pause >nul
endlocal
