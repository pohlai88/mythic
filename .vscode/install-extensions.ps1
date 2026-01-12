# Install Missing VS Code Extensions
# This script installs all recommended extensions

$extensions = @(
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

Write-Host "Installing VS Code extensions..." -ForegroundColor Cyan
Write-Host ""

foreach ($ext in $extensions) {
    Write-Host "Installing: $ext" -ForegroundColor Yellow
    code --install-extension $ext --force
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] $ext" -ForegroundColor Green
    } else {
        Write-Host "  [FAILED] $ext" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Installation complete!" -ForegroundColor Cyan
