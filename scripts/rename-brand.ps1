$basePath = "c:\Users\Usuario\Documents\github\works\dochevi\dochevi-construc\src"

# Replace in all JSON and TSX files
$files = Get-ChildItem -Path $basePath -Recurse -Include *.json,*.tsx,*.ts

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $original = $content
    
    $content = $content -replace 'Express Renovation Mallorca', 'Grupo RG'
    $content = $content -replace 'ExpressRenovationMallorca', 'Grupo RG'
    $content = $content -replace 'Dochevi Costrucciones', 'Grupo RG Construcciones'
    $content = $content -replace 'DOCHEVI CONSTRUCCION Y REFORMAS SL', 'GRUPO RG CONSTRUCCION Y REFORMAS SL'
    $content = $content -replace 'Dochevi Estándar de Calidad', 'Grupo RG Estándar de Calidad'
    $content = $content -replace '"Dochevi"', '"Grupo RG"'
    $content = $content -replace 'DOCHEVI', 'GRUPO RG'
    $content = $content -replace 'alt="Dochevi Logo"', 'alt="Grupo RG Logo"'
    $content = $content -replace 'Presupuesto-Dochevi-', 'Presupuesto-GrupoRG-'
    $content = $content -replace 'Dochevi Construcción', 'Grupo RG Construcción'
    $content = $content -replace 'Logo Express Renovation Mallorca', 'Logo Grupo RG'
    $content = $content -replace 'Plan Constructor Total Express Renovation Mallorca', 'Plan Constructor Total Grupo RG'
    # Dochevi Orange comment - cosmetic
    $content = $content -replace 'Dochevi Orange/Amber', 'Grupo RG Orange/Amber'
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline -Encoding UTF8
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "`nDone! All brand references updated."
