$inputStr = "protocol=https`nhost=github.com`n`n"
$res = $inputStr | git credential fill
$token = ""
$username = ""
foreach ($line in $res) {
    if ($line -like "username=*") {
        $username = $line.Substring(9)
    }
    if ($line -like "password=*") {
        $token = $line.Substring(9)
    }
}
Write-Output "User: $username"
if ($token) {
    Write-Output "Token Found! Length: $($token.Length)"
    # Try creating repository via GitHub API
    $headers = @{
        "Authorization" = "token $token"
        "Accept" = "application/vnd.github.v3+json"
        "User-Agent" = "PowerShell"
    }
    $body = @{
        name = "organic-bazar-chai"
        description = "Organic Bazar Chai - Authentic Pure Organic & Hill Marketplace"
        private = $false
    } | ConvertTo-Json

    try {
        $createRes = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
        Write-Output "Repository Created Successfully! URL: $($createRes.html_url)"
    } catch {
        Write-Output "API Error: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            Write-Output "Details: $($reader.ReadToEnd())"
        }
    }
} else {
    Write-Output "No token returned from git credential helper."
}
