# Apex Personal OS - Script de Inicio Robusto y Autónomo
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "Apex Personal OS - Centro de Mando"

Clear-Host
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "          APEX PERSONAL OS - CENTRO DE MANDO DE BRAYAN               " -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

# Directorio base del proyecto autónomo
$baseDir = $PSScriptRoot
$logFile = "$baseDir\logs\server.log"
$errFile = "$baseDir\logs\error.log"

if (-not (Test-Path "$baseDir\logs")) {
    New-Item -ItemType Directory -Path "$baseDir\logs" -Force | Out-Null
}

# 1. Verificar servicio MySQL80
Write-Host "[1/4] Verificando servicio de Base de Datos MySQL 8.0..." -ForegroundColor Yellow
$mysqlSvc = Get-Service -Name MySQL80 -ErrorAction SilentlyContinue
if ($mysqlSvc) {
    if ($mysqlSvc.Status -ne "Running") {
        Write-Host "      Iniciando servicio MySQL80..." -ForegroundColor Yellow
        Start-Service -Name MySQL80 -ErrorAction SilentlyContinue
    }
    Write-Host "      [OK] Base de datos MySQL 8.0 activa." -ForegroundColor Green
} else {
    Write-Host "      [AVISO] Servicio MySQL80 no detectado como Windows Service. Asegurate de que MySQL este corriendo." -ForegroundColor DarkYellow
}

# 2. Liberar puerto 3000 si habia quedado algun proceso huerfano
Write-Host "[2/4] Verificando disponibilidad de puerto 3000..." -ForegroundColor Yellow
$portCheck = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($portCheck) {
    Write-Host "      Liberando puerto 3000 ocupado por proceso previo..." -ForegroundColor DarkYellow
    Stop-Process -Id $portCheck.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}
Write-Host "      [OK] Puerto 3000 despejado." -ForegroundColor Green

# 3. Detectar IP Local para smartphone
Write-Host "[3/4] Detectando direccion IP local para smartphone..." -ForegroundColor Yellow
$ipObj = Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "*Wi-Fi*","*Ethernet*" -ErrorAction SilentlyContinue | Where-Object { $_.IPAddress -notlike "169.*" -and $_.IPAddress -notlike "127.*" } | Select-Object -First 1
$localIP = if ($ipObj) { $ipObj.IPAddress } else { "127.0.0.1" }

# 4. Iniciar servidor Next.js
Write-Host "[4/4] Iniciando servidor web de Apex OS..." -ForegroundColor Yellow

$npmExe = "C:\Program Files\nodejs\npm.cmd"
if (-not (Test-Path $npmExe)) {
    $npmExe = "npm.cmd"
}

$pinfo = New-Object System.Diagnostics.ProcessStartInfo
$pinfo.FileName = $npmExe
$pinfo.Arguments = "run dev"
$pinfo.WorkingDirectory = $baseDir
$pinfo.UseShellExecute = $true
$pinfo.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Minimized

$proc = [System.Diagnostics.Process]::Start($pinfo)

Write-Host "      Esperando conexion activa en http://localhost:3000..." -NoNewline -ForegroundColor Gray
$maxWait = 25
$ready = $false
for ($i = 0; $i -lt $maxWait; $i++) {
    Start-Sleep -Seconds 1
    Write-Host "." -NoNewline -ForegroundColor Gray
    try {
        $res = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        if ($res.StatusCode -eq 200) {
            $ready = $true
            break
        }
    } catch {
        # Sigue esperando arranque
    }
}
Write-Host ""

if ($ready) {
    Write-Host ""
    Write-Host "=====================================================================" -ForegroundColor Green
    Write-Host "  [ESTADO: ONLINE 🟢] Apex Personal OS esta funcionando correctamente" -ForegroundColor Green
    Write-Host "=====================================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  💻 Acceso en tu Laptop:   http://localhost:3000" -ForegroundColor Cyan
    Write-Host "  📱 Acceso en tu Celular:  http://$($localIP):3000" -ForegroundColor Cyan
    Write-Host "     (Conectado a la misma red Wi-Fi de tu casa)" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "  ⚙️  Motor de IA:           Google AI Studio (Gemini 2.5 Flash)" -ForegroundColor Yellow
    Write-Host "  🗄️  Base de Datos:         MySQL 8.0 (apex_personal_os)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  [!] Para APAGAR el sistema:" -ForegroundColor DarkYellow
    Write-Host "      Ejecuta 'Apagar_ApexOS.bat' o presiona 'Q' aqui para cerrar." -ForegroundColor DarkYellow
    Write-Host "=====================================================================" -ForegroundColor Green
    Write-Host ""

    # Abrir navegador predeterminado
    Start-Process "http://localhost:3000"

    # Monitoreo de actividad
    while ($true) {
        if ($Host.UI.RawUI.KeyAvailable) {
            $key = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
            if ($key.Character -eq 'q' -or $key.Character -eq 'Q') {
                Write-Host "Apagando Apex OS..." -ForegroundColor Yellow
                $apagarScript = "$PSScriptRoot\Apagar_ApexOS.ps1"
                & $apagarScript
                break
            }
        }
        Start-Sleep -Seconds 1
    }
} else {
    Write-Host ""
    Write-Host "[ERROR] El servidor tardo demasiado en responder." -ForegroundColor Red
    Write-Host "Asegurate de que no haya otro servicio bloqueando el puerto 3000." -ForegroundColor Red
    Read-Host "Presiona Enter para cerrar"
}
