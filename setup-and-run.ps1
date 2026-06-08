$ErrorActionPreference = "Stop"

# Change to project directory
Set-Location "C:\Users\Lenovo\Documents\QR CODE GENERATOR SYSTEM"

Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "MongoDB Setup - Full Execution" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install dependencies
Write-Host "[1/4] Installing dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "[✓] Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "[✗] npm install failed: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Seed data
Write-Host ""
Write-Host "[2/4] Seeding initial data..." -ForegroundColor Yellow
try {
    npm run seed
    Write-Host "[✓] Seed data loaded successfully" -ForegroundColor Green
} catch {
    Write-Host "[✗] npm run seed failed: $_" -ForegroundColor Red
    exit 1
}

# Step 3: Start development server
Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[3/4] Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev
