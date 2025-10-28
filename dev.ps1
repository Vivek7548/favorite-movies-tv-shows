# Dev runner: starts backend and frontend as background PowerShell jobs
# Usage: powershell -ExecutionPolicy Bypass -File dev.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent

Write-Host "Starting backend and frontend with log redirection from $root"

$logsDir = Join-Path $root 'logs'
$pidsDir = Join-Path $root '.dev'
New-Item -ItemType Directory -Force -Path $logsDir,$pidsDir | Out-Null

function Start-ProcessIfNeeded($name, $exe, $argList, $cwd, $outFile, $errFile, $pidFile) {
    if (Test-Path $pidFile) {
        try {
            $existingPid = [int](Get-Content $pidFile -ErrorAction Stop)
            $proc = Get-Process -Id $existingPid -ErrorAction SilentlyContinue
            if ($proc) {
                Write-Host "$name already running (pid $existingPid). Logs: $outFile"
                return
            } else {
                Remove-Item $pidFile -ErrorAction SilentlyContinue
            }
        } catch {
            Remove-Item $pidFile -ErrorAction SilentlyContinue
        }
    }

    $startInfo = Start-Process -FilePath $exe -ArgumentList $argList -WorkingDirectory $cwd -RedirectStandardOutput $outFile -RedirectStandardError $errFile -WindowStyle Hidden -PassThru
    $startInfo.Id | Out-File -FilePath $pidFile -Encoding ascii
    Start-Sleep -Milliseconds 200
    Write-Host "Started $name (pid $($startInfo.Id)). Stdout: $outFile, Stderr: $errFile"
}

# backend
$backendExe = 'node'
$backendArgs = 'src/index.js'
$backendCwd = Join-Path $root 'backend'
$backendOut = Join-Path $logsDir 'backend.log'
$backendErr = Join-Path $logsDir 'backend.err.log'
$backendPid = Join-Path $pidsDir 'backend.pid'
Start-ProcessIfNeeded 'favorite-backend' $backendExe $backendArgs $backendCwd $backendOut $backendErr $backendPid

# frontend (invoke vite directly via node)
$frontendExe = 'node'
$frontendArgs = 'node_modules/vite/bin/vite.js'
$frontendCwd = Join-Path $root 'frontend'
$frontendOut = Join-Path $logsDir 'frontend.log'
$frontendErr = Join-Path $logsDir 'frontend.err.log'
$frontendPid = Join-Path $pidsDir 'frontend.pid'
Start-ProcessIfNeeded 'favorite-frontend' $frontendExe $frontendArgs $frontendCwd $frontendOut $frontendErr $frontendPid

Write-Host "
Backend health: http://localhost:4000/health
Frontend: http://localhost:5173/"

Write-Host "Logs: $logsDir"
Write-Host "To stop: powershell -ExecutionPolicy Bypass -File stop-dev.ps1 (or npm run dev:stop)"
