# VS Code Extension Validation Script
# Checks which recommended extensions are installed

$recommended = @(
    "dsznajder.es7-react-js-snippets",
    "formulahendry.auto-rename-tag",
    "formulahendry.auto-close-tag",
    "bradlc.vscode-tailwindcss",
    "heybourn.headwind",
    "supabase.supabase-vscode",
    "christian-kohler.path-intellisense",
    "christian-kohler.npm-intellisense",
    "steoates.autoimport",
    "wix.vscode-import-cost",
    "usernamehw.errorlens",
    "editorconfig.editorconfig",
    "eamodio.gitlens",
    "mhutchie.git-graph",
    "mikestead.dotenv",
    "wayou.vscode-todo-highlight",
    "gruntfuggly.todo-tree",
    "firsttris.vscode-jest-runner",
    "orta.vscode-jest",
    "alefragnani.project-manager",
    "formulahendry.code-runner"
)

Write-Host "=== VS Code Extension Validation ===" -ForegroundColor Cyan
Write-Host ""

# Get installed extensions
$installed = code --list-extensions

$installedCount = 0
$missingCount = 0
$missing = @()

Write-Host "Checking recommended extensions..." -ForegroundColor Yellow
Write-Host ""

foreach ($ext in $recommended) {
    if ($installed -contains $ext) {
        Write-Host "  [✓] $ext" -ForegroundColor Green
        $installedCount++
    } else {
        Write-Host "  [ ] $ext" -ForegroundColor Red
        $missingCount++
        $missing += $ext
    }
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Total Recommended: $($recommended.Count)" -ForegroundColor White
Write-Host "Installed: $installedCount" -ForegroundColor Green
Write-Host "Missing: $missingCount" -ForegroundColor Red
Write-Host ""

if ($missingCount -gt 0) {
    Write-Host "Missing Extensions:" -ForegroundColor Yellow
    foreach ($ext in $missing) {
        Write-Host "  - $ext" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "To install missing extensions, run:" -ForegroundColor Yellow
    Write-Host '  code --install-extension EXTENSION-ID' -ForegroundColor Cyan
}
