# Run from PowerShell after reviewing the portfolio. Never paste credentials here.
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$portfolioRepo = 'bayudimasfebriansyah/bayufebriansyah.github.io'
$portfolioRemote = (& git remote get-url origin).Trim()
if ($portfolioRemote -ne "https://github.com/$portfolioRepo.git") {
    throw 'The Git remote differs from the approved portfolio repository.'
}
& npm.cmd run build
if ($LASTEXITCODE -ne 0) { throw 'Build failed.' }
& npm.cmd run check
if ($LASTEXITCODE -ne 0) { throw 'Site checks failed.' }
if (& git status --porcelain) { throw 'Commit or review local changes before publishing.' }

# Git Credential Manager handles sign-in through GitHub. No token is written to this file.
& git push --set-upstream origin main
if ($LASTEXITCODE -ne 0) { throw 'GitHub push failed. Complete GitHub sign-in and retry.' }
$portfolioCredentialLines = "protocol=https`nhost=github.com`n`n" | & git credential fill
if ($LASTEXITCODE -ne 0) { throw 'GitHub sign-in is needed for Pages setup.' }
$portfolioCredentials = @{}
foreach ($portfolioLine in $portfolioCredentialLines) {
    $portfolioPair = $portfolioLine -split '=', 2
    if ($portfolioPair.Length -eq 2) { $portfolioCredentials[$portfolioPair[0]] = $portfolioPair[1] }
}
if (-not $portfolioCredentials['password']) { throw 'No GitHub credential returned.' }
$portfolioHeaders = @{
    Accept = 'application/vnd.github+json'
    Authorization = "Bearer $($portfolioCredentials['password'])"
    'X-GitHub-Api-Version' = '2022-11-28'
}
try {
    $portfolioApi = "https://api.github.com/repos/$portfolioRepo/pages"
    $portfolioCreatePages = $false
    try { $portfolioPages = Invoke-RestMethod -Uri $portfolioApi -Headers $portfolioHeaders }
    catch {
        if ([int]$_.Exception.Response.StatusCode -eq 404) { $portfolioCreatePages = $true }
        else { throw 'Could not read GitHub Pages settings. Check account permissions.' }
    }
    if ($portfolioCreatePages) {
        $portfolioPages = Invoke-RestMethod -Method Post -Uri $portfolioApi -Headers $portfolioHeaders -ContentType 'application/json' -Body '{"build_type":"workflow"}'
    } elseif ($portfolioPages.build_type -ne 'workflow') {
        $portfolioPages = Invoke-RestMethod -Method Put -Uri $portfolioApi -Headers $portfolioHeaders -ContentType 'application/json' -Body '{"build_type":"workflow"}'
    }
    # A fresh workflow run also covers the race where the initial push preceded Pages enablement.
    $portfolioDispatch = "https://api.github.com/repos/$portfolioRepo/actions/workflows/deploy.yml/dispatches"
    Invoke-RestMethod -Method Post -Uri $portfolioDispatch -Headers $portfolioHeaders -ContentType 'application/json' -Body '{"ref":"main"}' | Out-Null
    Write-Host 'Source uploaded and GitHub Pages deployment started.'
    Write-Host "Track it: https://github.com/$portfolioRepo/actions"
    Write-Host 'Site: https://bayudimasfebriansyah.github.io/bayufebriansyah.github.io/'
} catch {
    throw 'The source was pushed, but automated Pages setup did not finish. In repository Settings > Pages, choose GitHub Actions, then run the deployment workflow.'
} finally {
    $portfolioCredentialLines = $null
    $portfolioCredentials.Clear()
    $portfolioHeaders.Clear()
}
