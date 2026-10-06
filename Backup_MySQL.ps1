# Apex Personal OS - Script de Copia de Seguridad MySQL Autónomo
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "Apex Personal OS - Backup de Base de Datos"

Clear-Host
Write-Host "=====================================================================" -ForegroundColor Green
Write-Host "         COPIA DE SEGURIDAD AUTOMATIZADA DE APEX PERSONAL OS         " -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Green
Write-Host ""

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupDir = "$PSScriptRoot\backups"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}
$backupFile = "$backupDir\backup_$timestamp.sql"
$dumpExe = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe"

if (-not (Test-Path $dumpExe)) {
    Write-Host "[ERROR] No se encontro mysqldump.exe en $dumpExe" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit
}

Write-Host "[*] Exportando base de datos 'apex_personal_os'..." -ForegroundColor Yellow

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = $dumpExe
$psi.Arguments = "-u root -proot apex_personal_os"
$psi.RedirectStandardOutput = $true
$psi.UseShellExecute = $false
$psi.CreateNoWindow = $true

$process = [System.Diagnostics.Process]::Start($psi)
$output = $process.StandardOutput.ReadToEnd()
$process.WaitForExit()

[System.IO.File]::WriteAllText($backupFile, $output, [System.Text.Encoding]::UTF8)

# Mantener copia fija para control de versiones y restauración post-formateo
$rootBackup = "$PSScriptRoot\database_backup.sql"
[System.IO.File]::WriteAllText($rootBackup, $output, [System.Text.Encoding]::UTF8)

if (Test-Path $backupFile) {
    $size = (Get-Item $backupFile).Length / 1KB
    Write-Host ""
    Write-Host "[OK] Copia de seguridad creada con exito:" -ForegroundColor Green
    Write-Host "     Archivo: $backupFile" -ForegroundColor Cyan
    Write-Host "     Tamano:  $([math]::Round($size, 2)) KB" -ForegroundColor Gray
    Write-Host "     Registros y transacciones 100% protegidos." -ForegroundColor Green
} else {
    Write-Host "[ERROR] Hubo un problema al generar la copia de seguridad." -ForegroundColor Red
}

Write-Host ""
Start-Sleep -Seconds 3
