# Levanta la API en local: valida el JDK, carga backend/.env al proceso y corre
# ./mvnw spring-boot:run. Sin esto, Spring Boot no lee .env por su cuenta — sólo
# docker-compose.yml lo hace (via env_file), no una corrida directa con Maven.
Set-Location $PSScriptRoot

# Mismo criterio que mvnw: si JAVA_HOME está seteado, usa ESE java directo en vez de
# confiar en lo que resuelva el PATH (puede haber otro JDK más adelante en el PATH).
if ($env:JAVA_HOME) {
    $javaBin = Join-Path $env:JAVA_HOME "bin\java.exe"
} else {
    $javaBin = "java"
}

# java -version escribe a stderr; con $ErrorActionPreference=Stop, PowerShell 5.1
# lo trata como error terminante al redirigirlo con 2>&1. Se evita ese redirect.
$javaVersionOutput = (& $javaBin -version) 2>&1 | ForEach-Object { $_.ToString() } | Out-String
if ($javaVersionOutput -notmatch '"25') {
    Write-Error "Se necesita JDK 25 activo. '$javaBin -version' mostro:`n$javaVersionOutput`nRevisa JAVA_HOME (ver README.md -> Requisitos previos)."
    exit 1
}

if (-not (Test-Path ".env")) {
    Write-Error "Falta backend\.env -- copia .env.example a .env y completa los valores reales (ver README.md)."
    exit 1
}

Get-Content ".env" | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
        $parts = $line.Split("=", 2)
        $key = $parts[0].Trim()
        $value = $parts[1].Trim()
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

if (-not $env:SPRING_PROFILES_ACTIVE) {
    $env:SPRING_PROFILES_ACTIVE = "local"
}

Write-Output "JDK activo: $($javaVersionOutput.Split("`n")[0])"
Write-Output "Perfil: $env:SPRING_PROFILES_ACTIVE"
Write-Output "Arrancando..."

& .\mvnw.cmd spring-boot:run
