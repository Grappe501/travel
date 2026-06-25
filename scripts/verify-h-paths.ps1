# Verify all project paths resolve to H: drive — run after setup-h-drive.ps1
$ErrorActionPreference = "Stop"

$ProjectRoot = "H:\Travel-Expense"
$failures = @()

function Test-OnHDrive {
    param([string]$Path, [string]$Label)
    $resolved = [System.IO.Path]::GetFullPath($Path)
    if ($resolved -notmatch "^H:\\") {
        $script:failures += "$Label resolves to $resolved (expected H:\)"
        Write-Host "FAIL: $Label -> $resolved" -ForegroundColor Red
    } else {
        Write-Host "OK:   $Label -> $resolved" -ForegroundColor Green
    }
}

Write-Host "=== H: Drive Path Verification ===" -ForegroundColor Cyan
Write-Host ""

Test-OnHDrive -Path $ProjectRoot -Label "Project root"
Test-OnHDrive -Path $env:TEMP -Label "TEMP"
Test-OnHDrive -Path $env:TMP -Label "TMP"

$npmCache = npm config get cache 2>$null
if ($npmCache) {
    Test-OnHDrive -Path $npmCache.Trim() -Label "npm cache"
}

$requiredDirs = @(
    "$ProjectRoot\.cache",
    "$ProjectRoot\.tmp",
    "$ProjectRoot\docs\blueprint"
)

foreach ($dir in $requiredDirs) {
    if (-not (Test-Path $dir)) {
        $failures += "Missing directory: $dir"
        Write-Host "FAIL: Missing $dir" -ForegroundColor Red
    } else {
        Write-Host "OK:   Directory exists: $dir" -ForegroundColor Green
    }
}

Write-Host ""
if ($failures.Count -gt 0) {
    Write-Host "$($failures.Count) issue(s) found. Run .\scripts\setup-h-drive.ps1 and restart terminal." -ForegroundColor Red
    exit 1
} else {
    Write-Host "All paths verified on H: drive." -ForegroundColor Green
    exit 0
}
