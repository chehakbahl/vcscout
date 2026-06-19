# run.ps1 for VC Scout Spring Boot Backend
# Detects local IntelliJ Maven binary first, fallback to standard downloads, then runs the backend application.

$IntelliJMvnDir = "C:\Program Files\JetBrains\IntelliJ IDEA 2026.1.2\plugins\maven\lib\maven3\bin"
$MavenBin = ""

# 1. Detect IntelliJ Maven
if (Test-Path "$IntelliJMvnDir\mvn.cmd") {
    $MavenBin = $IntelliJMvnDir
    Write-Host "Local IntelliJ Maven detected at: $MavenBin" -ForegroundColor Green
} else {
    # 2. Check/Install standard Local Maven
    $MavenVersion = "3.9.6"
    $MavenZip = "apache-maven-$MavenVersion-bin.zip"
    $MavenUrl = "https://archive.apache.org/dist/maven/maven-3/$MavenVersion/binaries/$MavenZip"
    $MavenDir = Join-Path $PSScriptRoot ".maven"
    $MavenBin = Join-Path $MavenDir "apache-maven-$MavenVersion\bin"

    if (!(Test-Path $MavenBin)) {
        Write-Host "Local Maven binary not found. Downloading Maven $MavenVersion..." -ForegroundColor Cyan
        if (!(Test-Path $MavenDir)) {
            New-Item -ItemType Directory -Path $MavenDir | Out-Null
        }
        
        $ZipPath = Join-Path $MavenDir $MavenZip
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        
        try {
            Invoke-WebRequest -Uri $MavenUrl -OutFile $ZipPath
            Write-Host "Extracting Maven archive..." -ForegroundColor Cyan
            Expand-Archive -Path $ZipPath -DestinationPath $MavenDir
            Remove-Item $ZipPath
            Write-Host "Maven installed successfully under .maven/." -ForegroundColor Green
        } catch {
            Write-Host "Failed to download Maven from archive. Please ensure Maven is installed or run with local IDE." -ForegroundColor Red
            exit 1
        }
    }
}

# 3. Append Maven binaries to session PATH
$env:PATH = "$MavenBin;$env:PATH"

# 4. Execute Spring Boot
Write-Host "Launching Spring Boot Backend..." -ForegroundColor Green
mvn spring-boot:run
