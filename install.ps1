#Requires -Version 5.1
<#
.SYNOPSIS
  Installs cursor-md coding skills/rules to ~/.cursor/
.DESCRIPTION
  Copies rules, core skills, generated gen-* skills, packs, agents, hooks, scripts, AGENTS.md.
  Never modifies ~/.cursor/skills-cursor/ or MCP configuration.
#>
param(
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$CursorHome = Join-Path $env:USERPROFILE ".cursor"

function Ensure-Dir($Path) {
    if (-not (Test-Path $Path)) { New-Item -ItemType Directory -Path $Path -Force | Out-Null }
}

function Copy-Tree($Source, $Dest) {
    if (-not (Test-Path $Source)) { return }
    Ensure-Dir $Dest
    Get-ChildItem -Path $Source -Recurse -File | ForEach-Object {
        $rel = $_.FullName.Substring($Source.Length).TrimStart('\', '/')
        $target = Join-Path $Dest $rel
        Ensure-Dir (Split-Path $target -Parent)
        Copy-Item $_.FullName $target -Force
    }
}

function Install-SkillFolder($SourceDir, $DestName, $DestSkills) {
    if (-not (Test-Path (Join-Path $SourceDir "SKILL.md"))) { return }
    $target = Join-Path $DestSkills $DestName
    if ((Test-Path $target) -and -not $Force) {
        Write-Host "  skill exists (skip): $DestName"
    }
    Copy-Tree $SourceDir $target
    Write-Host "  skill: $DestName"
}

Write-Host "cursor-md install"
Write-Host "  target: $CursorHome"
Ensure-Dir $CursorHome

$rulesDest = Join-Path $CursorHome "rules"
Ensure-Dir $rulesDest
Copy-Tree (Join-Path $RepoRoot "ecosystem\rules") $rulesDest
Write-Host "  rules installed"

$skillsDest = Join-Path $CursorHome "skills"
Ensure-Dir $skillsDest

$skillsRoot = Join-Path $RepoRoot "ecosystem\skills"
Get-ChildItem -Path $skillsRoot -Directory | ForEach-Object {
    if ($_.Name -eq "generated") { return }
    Install-SkillFolder $_.FullName $_.Name $skillsDest
}

$genRoot = Join-Path $skillsRoot "generated"
if (Test-Path $genRoot) {
    Get-ChildItem -Path $genRoot -Directory | ForEach-Object {
        if (-not (Test-Path (Join-Path $_.FullName "SKILL.md"))) { return }
        $destName = if ($_.Name.StartsWith("gen-")) { $_.Name } else { "gen-$($_.Name)" }
        Install-SkillFolder $_.FullName $destName $skillsDest
    }
}

Install-SkillFolder (Join-Path $RepoRoot "ecosystem\packs\security\security-pack") "security-pack" $skillsDest
Install-SkillFolder (Join-Path $RepoRoot "ecosystem\packs\testing\testing-pack") "testing-pack" $skillsDest

$agentsDest = Join-Path $CursorHome "agents"
Copy-Tree (Join-Path $RepoRoot "ecosystem\agents") $agentsDest
Write-Host "  agents installed"

Copy-Item (Join-Path $RepoRoot "AGENTS.md") (Join-Path $CursorHome "AGENTS.md") -Force
Write-Host "  AGENTS.md installed"

# Remove obsolete LEARNINGS install; leave any existing user file untouched
Write-Host "  LEARNINGS: not managed (legacy file left in place if present)"

$scriptsDest = Join-Path $CursorHome "scripts"
Copy-Tree (Join-Path $RepoRoot "scripts") $scriptsDest
Write-Host "  scripts installed"

$hooksSrc = Join-Path $RepoRoot "ecosystem\hooks\hooks.json"
$hooksDest = Join-Path $CursorHome "hooks.json"
$hooksScriptsDest = Join-Path $CursorHome "hooks"
Ensure-Dir $hooksScriptsDest
Copy-Tree (Join-Path $RepoRoot "ecosystem\hooks") $hooksScriptsDest

# Drop old model-routing rule if present from prior install
$orphanModel = Join-Path $rulesDest "model-routing.mdc"
if (Test-Path $orphanModel) {
    Remove-Item $orphanModel -Force
    Write-Host "  removed orphan model-routing.mdc"
}

# Drop capture-learning skill if present
$orphanCapture = Join-Path $skillsDest "capture-learning"
if (Test-Path $orphanCapture) {
    Remove-Item $orphanCapture -Recurse -Force
    Write-Host "  removed orphan capture-learning skill"
}

if (Test-Path $hooksSrc) {
    if (Test-Path $hooksDest) {
        try {
            $newHooks = Get-Content $hooksSrc -Raw | ConvertFrom-Json
            $existing = Get-Content $hooksDest -Raw | ConvertFrom-Json
            foreach ($prop in $newHooks.PSObject.Properties) {
                $existing | Add-Member -NotePropertyName $prop.Name -NotePropertyValue $prop.Value -Force
            }
            $existing | ConvertTo-Json -Depth 20 | Set-Content $hooksDest -Encoding UTF8
            Write-Host "  hooks.json merged"
        } catch {
            Copy-Item $hooksSrc $hooksDest -Force
            Write-Host "  hooks.json replaced (merge failed)"
        }
    } else {
        Copy-Item $hooksSrc $hooksDest -Force
        Write-Host "  hooks.json installed"
    }
}

Write-Host ""
Write-Host "Done. Restart Cursor to load rules and skills."
Write-Host "Validate: node $scriptsDest\validate-ecosystem.mjs --root $RepoRoot"
Write-Host "Audit gen skills: node $scriptsDest\audit-skills.mjs --root $RepoRoot"
