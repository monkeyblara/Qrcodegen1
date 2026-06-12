# Windows App Builder Script for Paint QR Generator
# This script builds the Windows desktop application

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Paint QR Generator - Windows App Builder" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "[1/5] Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[2/5] Installing dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Dependencies installed successfully" -ForegroundColor Green
Write-Host ""

Write-Host "[3/5] Building React frontend..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to build React app" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "React build completed" -ForegroundColor Green
Write-Host ""

Write-Host "[4/5] Building Windows installer..." -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
npm run electron-build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to build Electron app" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Windows build completed" -ForegroundColor Green
Write-Host ""

Write-Host "[5/5] Build Summary" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "SUCCESS! Your Windows app has been built." -ForegroundColor Green
Write-Host ""
Write-Host "Output files are in the 'dist' folder:" -ForegroundColor Yellow
Write-Host "  - Paint QR Generator Setup 1.0.0.exe (Installer)" -ForegroundColor White
Write-Host "  - Paint QR Generator 1.0.0.exe (Portable)" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Navigate to the 'dist' folder" -ForegroundColor White
Write-Host "  2. Run the installer or portable executable" -ForegroundColor White
Write-Host "  3. Follow the installation wizard" -ForegroundColor White
Write-Host ""
Write-Host "For development/testing, run:" -ForegroundColor Yellow
Write-Host "  npm run electron-dev" -ForegroundColor White
Write-Host ""
Write-Host "For more info, see: WINDOWS_APP_BUILD_GUIDE.md" -ForegroundColor White
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan

Read-Host "Press Enter to exit"
