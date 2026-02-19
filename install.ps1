# LearnSocial - Automated Installation Script (PowerShell)
# This script installs all dependencies for backend and mobile

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  LearnSocial - Installation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "  Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green

$npmVersion = npm --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ npm is not installed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ npm installed: v$npmVersion" -ForegroundColor Green

Write-Host ""

# Install root dependencies
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing root dependencies..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install root dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Root dependencies installed successfully!" -ForegroundColor Green

Write-Host ""

# Install backend dependencies
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Push-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
    Pop-Location
    exit 1
}
Write-Host "✓ Backend dependencies installed successfully!" -ForegroundColor Green
Pop-Location

Write-Host ""

# Install mobile dependencies
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing mobile dependencies..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Push-Location mobile
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install mobile dependencies" -ForegroundColor Red
    Pop-Location
    exit 1
}
Write-Host "✓ Mobile dependencies installed successfully!" -ForegroundColor Green
Pop-Location

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Set up PostgreSQL database" -ForegroundColor White
Write-Host "2. Configure environment files:" -ForegroundColor White
Write-Host "   cd backend && cp .env.example .env" -ForegroundColor Gray
Write-Host "   cd mobile && cp .env.example .env" -ForegroundColor Gray
Write-Host "3. Run database migrations:" -ForegroundColor White
Write-Host "   cd backend && npm run db:migrate" -ForegroundColor Gray
Write-Host "4. Start development servers:" -ForegroundColor White
Write-Host "   cd backend && npm run dev" -ForegroundColor Gray
Write-Host "   cd mobile && npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "See docs/SETUP.md for detailed instructions." -ForegroundColor Yellow
Write-Host ""
