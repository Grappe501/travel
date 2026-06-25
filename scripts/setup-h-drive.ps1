# Mileage & Expense Copilot — H: Drive Environment Setup
# Run once from repo root: .\scripts\setup-h-drive.ps1
# Creates cache/temp directories and configures user environment variables.

$ErrorActionPreference = "Stop"

$ProjectRoot = "H:\Travel-Expense"

if (-not (Test-Path $ProjectRoot)) {
    Write-Error "Project root not found at $ProjectRoot. Clone or create the repo first."
}

# Directories (all on H:)
$directories = @(
    "$ProjectRoot\.cache\npm",
    "$ProjectRoot\.cache\next",
    "$ProjectRoot\.cache\turbo",
    "$ProjectRoot\.cache\playwright",
    "$ProjectRoot\.tmp\os",
    "$ProjectRoot\.tmp\uploads",
    "$ProjectRoot\.tmp\exports",
    "$ProjectRoot\apps\web",
    "$ProjectRoot\packages\shared\src",
    "$ProjectRoot\supabase\migrations",
    "$ProjectRoot\supabase\functions",
    "$ProjectRoot\supabase\seed",
    "$ProjectRoot\docs\runbooks",
    "$ProjectRoot\.github\workflows"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created: $dir"
    } else {
        Write-Host "Exists:  $dir"
    }
}

# User-level environment variables (persistent across sessions)
$envVars = @{
    "PROJECT_ROOT"              = $ProjectRoot
    "TEMP"                      = "$ProjectRoot\.tmp\os"
    "TMP"                       = "$ProjectRoot\.tmp\os"
    "npm_config_cache"          = "$ProjectRoot\.cache\npm"
    "NEXT_TELEMETRY_DISABLED"   = "1"
    "PLAYWRIGHT_BROWSERS_PATH"  = "$ProjectRoot\.cache\playwright"
}

foreach ($key in $envVars.Keys) {
    [System.Environment]::SetEnvironmentVariable($key, $envVars[$key], "User")
    Set-Item -Path "Env:$key" -Value $envVars[$key]
    Write-Host "Set $key = $($envVars[$key])"
}

Write-Host ""
Write-Host "H: drive setup complete." -ForegroundColor Green
Write-Host "Restart your terminal (and Cursor) for all environment variables to take effect."
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Review docs/blueprint/README.md"
Write-Host "  2. Sign off on blueprint"
Write-Host "  3. Initialize git: git init && git remote add origin <your-github-url>"
Write-Host "  4. Begin Phase A scaffold (see blueprint Volume 6)"
