# Fix PEM_PUBLIC_KEY in .env file by converting multi-line to single line
$envFile = ".env"
$content = Get-Content $envFile
$newContent = @()
$inPemKey = $false
$pemKeyLines = @()

foreach ($line in $content) {
  if ($line -match "^PEM_PUBLIC_KEY=") {
    # Start of PEM key
    $inPemKey = $true
    $pemKeyLines = @($line -replace "^PEM_PUBLIC_KEY=", "")
  }
  elseif ($inPemKey) {
    # Collect PEM key lines
    $pemKeyLines += $line

    # Check if this is the end
    if ($line -match "^-----END PUBLIC KEY-----") {
      # Combine all lines into single line
      # For docker-compose, we need to quote the value and escape special characters
      $pemKeyValue = ($pemKeyLines -join "").Trim()
      # Escape quotes and backslashes for docker-compose
      $pemKeyValue = $pemKeyValue -replace '\\', '\\' -replace '"', '\"'
      # Quote the entire value
      $newContent += "PEM_PUBLIC_KEY=`"$pemKeyValue`""
      $inPemKey = $false
      $pemKeyLines = @()
    }
  }
  else {
    # Regular line
    $newContent += $line
  }
}

# Write to temporary file first
$newContent | Set-Content ".env.fixed"
Write-Host "Fixed .env file created as .env.fixed"
Write-Host "Review the file, then rename it to .env if it looks correct"
