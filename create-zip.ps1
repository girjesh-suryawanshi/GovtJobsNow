$files = @(
    "client",
    "server",
    "shared",
    "package.json",
    "package-lock.json",
    "drizzle.config.ts",
    "vite.config.ts",
    "tailwind.config.ts",
    "Dockerfile",
    "docker-compose.yml",
    ".env",
    "db-manual-create.ts",
    "test-stats.ts"
)

# Remove old zip if exists
if (Test-Path "govtjobsnow-update.zip") {
    Remove-Item "govtjobsnow-update.zip"
}

# Create zip
Compress-Archive -Path $files -DestinationPath "govtjobsnow-update.zip"
Write-Host "Zip created successfully."
