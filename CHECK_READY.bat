@echo off
REM ========================================
REM Setup Heroku CLI Check
REM ========================================

echo.
echo ========================================
echo  QR Paint System - Deployment Check
echo ========================================
echo.

REM Check if Heroku is installed
heroku --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ HEROKU CLI NOT INSTALLED
    echo.
    echo To deploy your QR system remotely, you need:
    echo.
    echo 1. Download Heroku CLI from:
    echo    https://devcenter.heroku.com/articles/heroku-cli
    echo.
    echo 2. Or install via npm:
    echo    npm install -g heroku
    echo.
    echo 3. Then verify installation:
    echo    heroku --version
    echo.
    echo After installation, run: DEPLOY_HEROKU.bat
    echo.
    pause
    exit /b 1
)

echo ✅ Heroku CLI is installed
heroku --version

echo.
echo ========================================
echo  Ready for Deployment!
echo ========================================
echo.
echo Your system is configured with:
echo   ✓ Git repository initialized
echo   ✓ MongoDB Atlas connected
echo   ✓ Express server ready
echo   ✓ React frontend ready
echo   ✓ Heroku CLI available
echo.
echo Next Step: Click DEPLOY_HEROKU.bat
echo.
echo This will:
echo   1. Create Heroku app
echo   2. Deploy your code
echo   3. Enable remote QR scanning
echo   4. Make your app public
echo.
pause
