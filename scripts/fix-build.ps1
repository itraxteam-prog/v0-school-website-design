# Next.js Clean Build Script for Windows (PowerShell)
# Handles locked files and permission issues

$ErrorActionPreference = "SilentlyContinue"

Write-Host "`n>>> Starting Production Build Recovery Script <<<" -ForegroundColor Cyan

# 1. Kill any Node processes that may be locking build files
Write-Host "Checking for locked files (stopping Node processes)..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force 
Start-Sleep -Seconds 1

# 2. Force delete the .next folder
if (Test-Path ".next") {
    Write-Host "Deleting .next folder..." -ForegroundColor Yellow
    Remove-Item -Path ".next" -Recurse -Force
}

# 3. Force delete trace files if they remain
if (Test-Path ".next\trace") {
     Remove-Item -Path ".next\trace" -Recurse -Force
}

# 4. Reset Permissions
Write-Host "Applying write permissions to project folder..." -ForegroundColor Yellow
$currentPath = Get-Location
icacls "$currentPath" /grant "${env:USERNAME}:(OI)(CI)F" /T /C /Q | Out-Null

# 5. Build
Write-Host "Starting fresh pnpm build..." -ForegroundColor Green
pnpm build

Write-Host ">>> Recovery Complete <<<" -ForegroundColor Green
