# Quick install script (silent mode)
Write-Host "Installing dependencies..." -ForegroundColor Cyan

npm install --silent
if ($LASTEXITCODE -ne 0) { exit 1 }

Push-Location backend
npm install --silent
if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }
Pop-Location

Push-Location mobile
npm install --silent
if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }
Pop-Location

Write-Host "✓ All dependencies installed!" -ForegroundColor Green
Write-Host "Run 'npm run dev' in backend and 'npm start' in mobile to begin." -ForegroundColor Yellow