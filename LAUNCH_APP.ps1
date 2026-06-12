# Launch the Paint QR Generator Windows Desktop App

$appPath = Join-Path $PSScriptRoot "dist\packaged\Paint QR Generator-win32-x64\Paint QR Generator.exe"

if (-not (Test-Path $appPath)) {
    Write-Host ""
    Write-Host "ERROR: Application not found at:" -ForegroundColor Red
    Write-Host $appPath
    Write-Host ""
    Write-Host "Please run 'npm run package-with-icon' first to build the app." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Launching Paint QR Generator..." -ForegroundColor Green
Write-Host ""

Start-Process $appPath
exit 0
