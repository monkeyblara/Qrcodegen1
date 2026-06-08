@echo off
REM ========================================
REM Heroku Deployment Script with MongoDB
REM ========================================
REM This script deploys the QR Paint System to Heroku
REM and enables remote QR code scanning

setlocal enabledelayedexpansion

cd /d "C:\Users\Lenovo\Documents\QR CODE GENERATOR SYSTEM"

echo.
echo ========================================
echo  QR Paint System - Heroku Deployment
echo ========================================
echo.

REM Step 1: Check if Heroku CLI is installed
echo [STEP 1/6] Checking Heroku CLI...
heroku --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Heroku CLI is not installed!
    echo.
    echo Please install it from: https://devcenter.heroku.com/articles/heroku-cli
    echo Or run: npm install -g heroku
    echo.
    pause
    exit /b 1
)
echo ✓ Heroku CLI found

REM Step 2: Check if already logged in
echo.
echo [STEP 2/6] Checking Heroku authentication...
heroku auth:whoami >nul 2>&1
if errorlevel 1 (
    echo.
    echo You need to login to Heroku first
    echo.
    heroku login
) else (
    echo ✓ Already logged in
)

REM Step 3: Prepare for deployment
echo.
echo [STEP 3/6] Checking Git status...
git status >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git repository not found
    exit /b 1
)
echo ✓ Git repository ready

REM Step 4: Prompt for app name
echo.
echo [STEP 4/6] Creating Heroku app...
set /p APP_NAME="Enter unique Heroku app name (e.g., qr-paint-system-munashe): "

REM Remove any spaces from app name
set APP_NAME=%APP_NAME: =%

echo Creating app: !APP_NAME!...
heroku create !APP_NAME! 2>nul

if errorlevel 1 (
    echo.
    echo ⚠ App creation failed. It may already exist.
    echo Attempting to use existing app...
)

REM Step 5: Set environment variables
echo.
echo [STEP 5/6] Configuring environment variables...
echo Setting NODE_ENV=production
heroku config:set NODE_ENV=production --app=!APP_NAME!

REM MONGODB_URI is already in .env, verify it exists
if exist .env (
    echo ✓ .env file found
    echo ✓ MONGODB_URI is configured in .env
    echo.
    echo NOTE: MONGODB_URI environment variable is set in .env
    echo The build process will use it automatically
) else (
    echo ERROR: .env file not found
    exit /b 1
)

REM Step 6: Deploy
echo.
echo [STEP 6/6] Deploying to Heroku...
echo.
echo Committing any changes...
git add . 2>nul
git commit -m "Deploy to Heroku with MongoDB" 2>nul

echo.
echo Pushing to Heroku (this may take 2-5 minutes)...
git push heroku master

if errorlevel 1 (
    echo.
    echo ERROR: Deployment failed
    echo Check logs with: heroku logs --tail --app=!APP_NAME!
    pause
    exit /b 1
)

REM Success!
echo.
echo ========================================
echo  ✓ DEPLOYMENT SUCCESSFUL!
echo ========================================
echo.
echo Your app is now live at:
echo https://!APP_NAME!.herokuapp.com
echo.
echo QR codes will link to:
echo https://!APP_NAME!.herokuapp.com/product/{productId}
echo.
echo Next steps:
echo 1. Open your app: https://!APP_NAME!.herokuapp.com
echo 2. Create a test product
echo 3. Generate a QR code
echo 4. Scan from anywhere - it works!
echo.
echo View logs:     heroku logs --tail --app=!APP_NAME!
echo Open app:      heroku open --app=!APP_NAME!
echo View config:   heroku config --app=!APP_NAME!
echo.
pause
