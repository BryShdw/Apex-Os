# Apex Personal OS - Script de Restauración de Base de Datos MySQL
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "Apex Personal OS - Restauración de Base de Datos"

Clear-Host
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "         RESTAURACION DE BASE DE DATOS DE APEX PERSONAL OS           " -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

$backupFile = "$PSScriptRoot\database_backup.sql"
if (-not (Test-Path $backupFile)) {
    $backupFile = "$PSScriptRoot\backups\backup_latest.sql"
}

if (-not (Test-Path $backupFile)) {
    Write-Host "[ERROR] No se encontro el archivo de respaldo 'database_backup.sql'." -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit
}

# Localizar mysql.exe
$mysqlExe = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
if (-not (Test-Path $mysqlExe)) {
    $commandCheck = Get-Command mysql.exe -ErrorAction SilentlyContinue
    if ($commandCheck) {
        $mysqlExe = $commandCheck.Source
    } else {
        Write-Host "[ERROR] No se encontro mysql.exe en '$mysqlExe' ni en el PATH del sistema." -ForegroundColor Red
        Write-Host "Asegurate de tener instalado MySQL Server 8.0." -ForegroundColor Yellow
        Read-Host "Presiona Enter para salir"
        exit
    }
}

Write-Host "[*] Archivo de respaldo detectado: $backupFile" -ForegroundColor Gray
Write-Host "[*] Creando base de datos 'apex_personal_os' si no existe..." -ForegroundColor Yellow

# Asegurar que la BD exista
& $mysqlExe -u root -proot -e "CREATE DATABASE IF NOT EXISTS apex_personal_os CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>$null

Write-Host "[*] Restaurando tablas, perfiles, transacciones y configuraciones..." -ForegroundColor Yellow

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = $mysqlExe
$psi.Arguments = "-u root -proot apex_personal_os"
$psi.RedirectStandardInput = $true
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.UseShellExecute = $false
$psi.CreateNoWindow = $true

$process = [System.Diagnostics.Process]::Start($psi)
$content = [System.IO.File]::ReadAllText($backupFile, [System.Text.Encoding]::UTF8)
$process.StandardInput.Write($content)
$process.StandardInput.Close()

$stderr = $process.StandardError.ReadToEnd()
$process.WaitForExit()

Write-Host ""
if ($process.ExitCode -eq 0) {
    Write-Host "=====================================================================" -ForegroundColor Green
    Write-Host "      [EXITO] BASE DE DATOS RESTAURADA COMPLETAMENTE AL 100%         " -ForegroundColor Green
    Write-Host "=====================================================================" -ForegroundColor Green
    Write-Host "Todos tus datos de dinero en caja, ahorro blindado, rutinas de       " -ForegroundColor White
    Write-Host "calistenia, metas y registros historicos han sido restablecidos.     " -ForegroundColor White
} else {
    Write-Host "[ADVERTENCIA] El proceso finalizo con codigo $($process.ExitCode)." -ForegroundColor Yellow
    if ($stderr) {
        Write-Host "Detalle: $stderr" -ForegroundColor DarkGray
    }
}

Write-Host ""
Start-Sleep -Seconds 3
