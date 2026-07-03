# NestBridge local dev — run backend + frontend in separate windows
# Usage: from project root: .\scripts\start-dev.ps1

$Root = Split-Path -Parent $PSScriptRoot
$Backend = Join-Path $Root "backend"
$Frontend = Join-Path $Root "frontend"

Write-Host "Starting Docker (Postgres + Redis)..." -ForegroundColor Cyan
Push-Location $Backend
docker compose up -d
Pop-Location

$health = $null
try {
    $health = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -UseBasicParsing -TimeoutSec 3
} catch {
    $health = $null
}

if ($health -and $health.Content -match '"UP"') {
    Write-Host "Backend already running on http://localhost:8080" -ForegroundColor Green
} else {
    Write-Host "Starting backend in a new window..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Backend'; .\mvnw.cmd spring-boot:run"
    Write-Host "Waiting for backend health check..." -ForegroundColor Yellow
    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 2
        try {
            $r = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -UseBasicParsing -TimeoutSec 3
            if ($r.Content -match '"UP"') { $ready = $true; break }
        } catch { }
    }
    if ($ready) {
        Write-Host "Backend is UP." -ForegroundColor Green
    } else {
        Write-Host "Backend did not respond in time. Check the backend window for errors." -ForegroundColor Red
    }
}

Write-Host "Starting Expo in a new window..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Frontend'; if (-not (Test-Path node_modules)) { npm install }; npx expo start"

Write-Host ""
Write-Host "Done. Use two terminals:" -ForegroundColor Green
Write-Host "  Backend:  http://localhost:8080/actuator/health"
Write-Host "  Frontend: scan QR in the Expo window (folder: frontend\)"
