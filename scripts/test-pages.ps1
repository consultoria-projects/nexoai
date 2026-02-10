$pages = @(
    'http://localhost:9002/es',
    'http://localhost:9002/es/services',
    'http://localhost:9002/es/contact',
    'http://localhost:9002/es/blog'
)

foreach ($url in $pages) {
    try {
        $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 20
        Write-Host "OK $($r.StatusCode) - $url"
    } catch {
        Write-Host "FAIL - $url - $($_.Exception.Message)"
    }
}
