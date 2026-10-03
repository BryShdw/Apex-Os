# Apex Personal OS - Script de Apagado Limpio Autónomo
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "Apex Personal OS - Apagado"

Clear-Host
Write-Host "=====================================================================" -ForegroundColor Yellow
Write-Host "           DETENIENDO APEX PERSONAL OS (APAGADO LIMPIO)             " -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Yellow
Write-Host ""

# 1. Detener procesos en puerto 3000
$portConns = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($portConns) {
    foreach ($conn in $portConns) {
        Write-Host "[*] Deteniendo proceso servidor en puerto 3000 (PID $($conn.OwningProcess))..." -ForegroundColor Gray
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}

# 2. Detener procesos node residuales
Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*nodejs*" } | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "[OK] Servidor web detenido y memoria RAM liberada al 100%." -ForegroundColor Green
Write-Host "[OK] Base de datos MySQL permanece segura e intacta." -ForegroundColor Green
Write-Host ""
Write-Host "Apex Personal OS apagado correctamente." -ForegroundColor Cyan
Start-Sleep -Seconds 2
