# Stop the processes started by dev.ps1 (uses PID files in .dev/)
$ErrorActionPreference = 'Stop'
Write-Host "Stopping dev processes (favorite-backend, favorite-frontend)"

$root = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
$pidsDir = Join-Path $root '.dev'

function Stop-ByPidFile($pidFile, $name) {
    if (Test-Path $pidFile) {
        try {
            $pid = [int](Get-Content $pidFile -ErrorAction Stop)
            Write-Host "Stopping $name (pid $pid)"
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        } catch {
            Write-Host "Failed to stop $name by pid file: $_"
        }
        Remove-Item $pidFile -ErrorAction SilentlyContinue
    } else {
        Write-Host "PID file not found for $name ($pidFile)"
    }
}

Stop-ByPidFile (Join-Path $pidsDir 'backend.pid') 'favorite-backend'
Stop-ByPidFile (Join-Path $pidsDir 'frontend.pid') 'favorite-frontend'

# also cleanup any legacy PowerShell jobs
Get-Job -Name favorite-backend,favorite-frontend -ErrorAction SilentlyContinue | ForEach-Object { Stop-Job -Id $_.Id -ErrorAction SilentlyContinue; Remove-Job -Id $_.Id -ErrorAction SilentlyContinue }

Write-Host "Stopped processes and cleaned up." 
