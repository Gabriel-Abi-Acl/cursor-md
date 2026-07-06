#Requires -Version 5.1
<#
.SYNOPSIS
  Installs the full cursor-md ecosystem to ~/.cursor/
.DESCRIPTION
  Copies rules, skills, packs, agents, hooks, scripts, AGENTS.md, and LEARNINGS template.
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

function Copy-Tree($Source, $Dest, $Pattern = "*") {
    if (-not (Test-Path $Source)) { return }
    Ensure-Dir $Dest
    Get-ChildItem -Path $Source -Recurse -File | ForEach-Object {
        $rel = $_.FullName.Substring($Source.Length).TrimStart('\', '/')
        $target = Join-Path $Dest $rel
        Ensure-Dir (Split-Path $target -Parent)
        Copy-Item $_.FullName $target -Force
    }
}

function Install-SkillDir($Source, $DestSkills) {
    if (-not (Test-Path $Source)) { return }
    Get-ChildItem -Path $Source -Directory | ForEach-Object {
        $name = $_.Name
        $target = Join-Path $DestSkills $name
        if ((Test-Path $target) -and -not $Force) {
            Write-Host "  skill exists (skip): $name (use -Force to overwrite)"
        }
        Copy-Tree $_.FullName $target
        Write-Host "  skill: $name"
    }
}

Write-Host "cursor-md ecosystem install"
Write-Host "  target: $CursorHome"
Ensure-Dir $CursorHome

# Rules
$rulesDest = Join-Path $CursorHome "rules"
Ensure-Dir $rulesDest
Copy-Tree (Join-Path $RepoRoot "ecosystem\rules") $rulesDest
Write-Host "  rules installed"

# Skills (core)
$skillsDest = Join-Path $CursorHome "skills"
Ensure-Dir $skillsDest
Install-SkillDir (Join-Path $RepoRoot "ecosystem\skills") $skillsDest

# Packs
Install-SkillDir (Join-Path $RepoRoot "ecosystem\packs\security") $skillsDest
Install-SkillDir (Join-Path $RepoRoot "ecosystem\packs\testing") $skillsDest

# Agents
$agentsDest = Join-Path $CursorHome "agents"
Copy-Tree (Join-Path $RepoRoot "ecosystem\agents") $agentsDest
Write-Host "  agents installed"

# AGENTS.md
$agentsMd = Join-Path $RepoRoot "AGENTS.md"
if (Test-Path $agentsMd) {
    Copy-Item $agentsMd (Join-Path $CursorHome "AGENTS.md") -Force
    Write-Host "  AGENTS.md installed"
}

# LEARNINGS.md (skip if exists unless Force)
$learningsSrc = Join-Path $RepoRoot "LEARNINGS.md"
$learningsDest = Join-Path $CursorHome "LEARNINGS.md"
if ((Test-Path $learningsDest) -and -not $Force) {
    Write-Host "  LEARNINGS.md exists (skipped)"
} else {
    Copy-Item $learningsSrc $learningsDest -Force
    Write-Host "  LEARNINGS.md installed"
}

# Scripts
$scriptsDest = Join-Path $CursorHome "scripts"
Copy-Tree (Join-Path $RepoRoot "scripts") $scriptsDest
Write-Host "  scripts installed"

# Initialize learnings index
$initScript = Join-Path $scriptsDest "search-learnings.mjs"
if (Test-Path $initScript) {
    & node $initScript --init 2>$null
    Write-Host "  learnings index initialized"
}

# Hooks merge
$hooksSrc = Join-Path $RepoRoot "ecosystem\hooks\hooks.json"
$hooksDest = Join-Path $CursorHome "hooks.json"
$hooksScriptsDest = Join-Path $CursorHome "hooks"
Ensure-Dir $hooksScriptsDest
Copy-Tree (Join-Path $RepoRoot "ecosystem\hooks") $hooksScriptsDest

if (Test-Path $hooksSrc) {
    $newHooks = Get-Content $hooksSrc -Raw | ConvertFrom-Json
    if (Test-Path $hooksDest) {
        $existing = Get-Content $hooksDest -Raw | ConvertFrom-Json
        foreach ($prop in $newHooks.PSObject.Properties) {
            $existing | Add-Member -NotePropertyName $prop.Name -NotePropertyValue $prop.Value -Force
        }
        $existing | ConvertTo-Json -Depth 20 | Set-Content $hooksDest -Encoding UTF8
        Write-Host "  hooks.json merged"
    } else {
        Copy-Item $hooksSrc $hooksDest -Force
        Write-Host "  hooks.json installed"
    }
}

Write-Host ""
Write-Host "Done. Restart Cursor to load rules and skills."
Write-Host "Validate: node $scriptsDest\validate-ecosystem.mjs --root $RepoRoot"
