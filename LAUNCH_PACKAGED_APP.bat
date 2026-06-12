@echo off
setlocal
set "APP_PATH=%~dp0dist\packaged\Paint QR Generator-win32-x64\Paint QR Generator.exe"
if exist "%APP_PATH%" (
  start "Paint QR Generator" "%APP_PATH%"
  exit /b 0
)
echo ERROR: Executable not found.
echo Expected location:
echo   %APP_PATH%
pause
