# VS Code Extension Validation and Activation Script
# Validates recommended extensions and installs missing ones

param(
    [switch]$InstallMissing = $false,
    [switch]$Force = $false
)

Write-Host "=== VS Code Extension Validation & Activation ===" -ForegroundColor Cyan
Write-Host ""

# Read extensions from extensions.json
$extensionsJsonPath = Join-Path $PSScriptRoot "extensions.json"
if (-not (Test-Path $extensionsJsonPath)) {
    Write-Host "ERROR: extensions.json not found at $extensionsJsonPath" -ForegroundColor Red
    exit 1
}

try {
    # Read and strip comments from JSON
    $jsonContent = Get-Content $extensionsJsonPath -Raw
    # Remove single-line comments (// ...)
    $jsonContent = $jsonContent -replace '//.*?(\r?\n|$)', '$1'
    # Remove multi-line comments (/* ... */)
    $jsonContent = $jsonContent -replace '/\*.*?\*/', ''
    # Parse JSON
    $extensionsJson = $jsonContent | ConvertFrom-Json
    $recommended = $extensionsJson.recommendations
} catch {
    Write-Host "ERROR: Failed to parse extensions.json: $_" -ForegroundColor Red
    exit 1
}

Write-Host "Found $($recommended.Count) recommended extensions" -ForegroundColor Yellow
Write-Host ""

# Get installed extensions
Write-Host "Checking installed extensions..." -ForegroundColor Yellow
$installedOutput = code --list-extensions 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Could not list installed extensions. Is VS Code CLI available?" -ForegroundColor Yellow
    $installed = @()
} else {
    $installed = $installedOutput | Where-Object { $_ -match '^[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$' }
}

$installedCount = 0
$missingCount = 0
$missing = @()
$installedList = @()
$failed = @()

Write-Host "Validating extensions..." -ForegroundColor Yellow
Write-Host ""

foreach ($ext in $recommended) {
    if ($installed -contains $ext) {
        Write-Host "  [OK] $ext" -ForegroundColor Green
        $installedCount++
        $installedList += $ext
    } else {
        Write-Host "  [MISSING] $ext" -ForegroundColor Red
        $missingCount++
        $missing += $ext
    }
}

Write-Host ""
Write-Host "=== Validation Summary ===" -ForegroundColor Cyan
Write-Host "Total Recommended: $($recommended.Count)" -ForegroundColor White
Write-Host "Installed: $installedCount" -ForegroundColor Green
Write-Host "Missing: $missingCount" -ForegroundColor $(if ($missingCount -eq 0) { "Green" } else { "Red" })
Write-Host ""

# Installation phase
if ($missingCount -gt 0) {
    if ($InstallMissing -or $Force) {
        Write-Host "=== Installing Missing Extensions ===" -ForegroundColor Cyan
        Write-Host ""

        foreach ($ext in $missing) {
            Write-Host "Installing: $ext" -ForegroundColor Yellow
            $installOutput = code --install-extension $ext --force 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  [OK] Successfully installed $ext" -ForegroundColor Green
                $installedCount++
                $installedList += $ext
            } else {
                Write-Host "  [FAILED] Could not install $ext" -ForegroundColor Red
                Write-Host "  Error: $installOutput" -ForegroundColor DarkRed
                $failed += $ext
            }
            Write-Host ""
        }

        Write-Host "=== Installation Summary ===" -ForegroundColor Cyan
        Write-Host "Successfully Installed: $($installedCount - ($recommended.Count - $missingCount))" -ForegroundColor Green
        if ($failed.Count -gt 0) {
            Write-Host "Failed: $($failed.Count)" -ForegroundColor Red
            Write-Host ""
            Write-Host "Failed Extensions:" -ForegroundColor Yellow
            foreach ($ext in $failed) {
                Write-Host "  - $ext" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "Missing Extensions:" -ForegroundColor Yellow
        foreach ($ext in $missing) {
            Write-Host "  - $ext" -ForegroundColor Red
        }
        Write-Host ""
        Write-Host "To install missing extensions, run:" -ForegroundColor Yellow
        Write-Host "  .\validate-and-activate-extensions.ps1 -InstallMissing" -ForegroundColor Cyan
    }
}

# Generate validation report
$reportPath = Join-Path $PSScriptRoot "EXTENSION_VALIDATION_REPORT.md"
$reportDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$reportContent = @"
# VS Code Extension Validation Report

**Generated:** $reportDate
**Workspace:** $(Split-Path (Get-Location) -Leaf)
**Status:** $(if ($missingCount -eq 0) { "✅ ALL EXTENSIONS INSTALLED" } else { "⚠️ $missingCount EXTENSIONS MISSING" })

---

## 📊 Summary

| Metric | Count |
|--------|-------|
| **Total Recommended** | $($recommended.Count) |
| **Installed** | $installedCount |
| **Missing** | $missingCount |
| **Installation Rate** | $([math]::Round(($installedCount / $recommended.Count) * 100, 1))% |

---

## ✅ Installed Extensions ($installedCount)

"@

foreach ($ext in $installedList) {
    $reportContent += "`n- ✅ $ext"
}

if ($missing.Count -gt 0) {
    $reportContent += @"

---

## ❌ Missing Extensions ($missingCount)

"@
    foreach ($ext in $missing) {
        $reportContent += "`n- ❌ $ext"
    }
}

if ($failed.Count -gt 0) {
    $reportContent += @"

---

## ⚠️ Failed Installations ($($failed.Count))

"@
    foreach ($ext in $failed) {
        $reportContent += "`n- ⚠️ $ext"
    }
}

$reportContent += @"

---

## 🎯 Next Steps

"@

if ($missingCount -eq 0) {
    $reportContent += "`n✅ All recommended extensions are installed and ready to use!"
} else {
    $reportContent += @"
`n1. Install missing extensions by running:
   ```powershell
   .\validate-and-activate-extensions.ps1 -InstallMissing
   ```

2. Reload VS Code window after installation:
   - Press `Ctrl+Shift+P`
   - Type 'Developer: Reload Window'
   - Press Enter
"@
}

$reportContent += @"

---

## 📝 Extension Categories

### Core Development
- Biome: `biomejs.biome` (Fast linter and formatter - replaces ESLint + Prettier)

### React & Next.js
- ES7+ React Snippets: `dsznajder.es7-react-js-snippets`
- Auto Rename Tag: `formulahendry.auto-rename-tag`
- Auto Close Tag: `formulahendry.auto-close-tag`

### Tailwind CSS
- Tailwind CSS IntelliSense: `bradlc.vscode-tailwindcss`
- Headwind: `jumail.headwind`

### Supabase Integration
- Postgres Tools: `supabase.postgrestools`

### Path & Import Management
- Path Intellisense: `christian-kohler.path-intellisense`
- npm Intellisense: `christian-kohler.npm-intellisense`
- Auto Import: `steoates.autoimport`
- Import Cost: `wix.vscode-import-cost`

### Code Quality
- Error Lens: `usernamehw.errorlens`
- EditorConfig: `editorconfig.editorconfig`

### Git & Version Control
- GitLens: `eamodio.gitlens`
- Git Graph: `mhutchie.git-graph`

### Environment & Productivity
- DotENV: `mikestead.dotenv`
- TODO Highlight: `wayou.vscode-todo-highlight`
- Todo Tree: `gruntfuggly.todo-tree`

### Documentation
- DocThis: `joelday.docthis`
- Better Comments: `aaron-bond.better-comments`
- Code Spell Checker: `streetsidesoftware.code-spell-checker`

### Testing
- Jest Runner: `firsttris.vscode-jest-runner`
- Jest: `orta.vscode-jest`

### Project Management
- Project Manager: `alefragnani.project-manager`
- Code Runner: `formulahendry.code-runner`

### PowerShell
- PowerShell: `ms-vscode.powershell`

---

**Report generated by:** Extension Validation Script
**Last Updated:** $reportDate
"@

try {
    $reportContent | Out-File -FilePath $reportPath -Encoding UTF8
    Write-Host "Validation report saved to: $reportPath" -ForegroundColor Green
} catch {
    Write-Host "WARNING: Could not save validation report: $_" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Validation Complete ===" -ForegroundColor Cyan
if ($missingCount -eq 0) {
    Write-Host "✅ All extensions are installed!" -ForegroundColor Green
} else {
    Write-Host "⚠️ $missingCount extensions are missing" -ForegroundColor Yellow
    if (-not $InstallMissing) {
        Write-Host "Run with -InstallMissing to install them automatically" -ForegroundColor Cyan
    }
}
