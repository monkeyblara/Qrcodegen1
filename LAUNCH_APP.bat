@echo off
REM Launch the Paint QR Generator Windows Desktop App

set APP_PATH=%~dp0dist\packaged\Paint QR Generator-win32-x64\Paint QR Generator.exe

if not exist "%APP_PATH%" (
    echo.
    echo ERROR: Application not found at:
    echo %APP_PATH%
    echo.
    echo Please run "npm run package-with-icon" first to build the app.
    echo.
    pause
    exit /b 1
)

echo.
echo Launching Paint QR Generator...
echo.

start "" "%APP_PATH%"
exit /b 0
