$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$outDir = Join-Path $repoRoot "out"

if (-not (Test-Path -LiteralPath $outDir -PathType Container)) {
  Write-Error "Static export directory not found: $outDir"
  exit 1
}

$generatedDirectories = @(
  "_next",
  "_not-found",
  "about",
  "admin",
  "blog",
  "cursors",
  "images",
  "lab",
  "lottie",
  "lottie-preview",
  "projects",
  "resume"
)

$generatedFiles = @(
  ".nojekyll",
  "404.html",
  "about.html",
  "about.txt",
  "blog.html",
  "blog.txt",
  "favicon.ico",
  "index.html",
  "index.txt",
  "lab.html",
  "lab.txt",
  "lottie-preview.html",
  "lottie-preview.txt",
  "manifest.json",
  "projects.html",
  "projects.txt",
  "resume.html",
  "resume.txt",
  "robots.txt",
  "sitemap.xml",
  "_not-found.html",
  "_not-found.txt",
  "__next._full.txt",
  "__next._head.txt",
  "__next._index.txt",
  "__next._tree.txt",
  "__next.__PAGE__.txt"
)

$removed = 0

foreach ($directory in $generatedDirectories) {
  $target = Join-Path $repoRoot $directory
  if (Test-Path -LiteralPath $target) {
    $resolved = Resolve-Path -LiteralPath $target
    if (-not $resolved.Path.StartsWith($repoRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
      Write-Error "Refusing to delete outside repository: $target"
      exit 1
    }
    Remove-Item -LiteralPath $target -Recurse -Force
    $removed++
  }
}

foreach ($file in $generatedFiles) {
  $target = Join-Path $repoRoot $file
  if (Test-Path -LiteralPath $target -PathType Leaf) {
    Remove-Item -LiteralPath $target -Force
    $removed++
  }
}

Copy-Item -Path (Join-Path $outDir "*") -Destination $repoRoot -Recurse -Force

$syncedCount = (Get-ChildItem -LiteralPath $outDir -Recurse -File | Measure-Object).Count
$sharedDir = Join-Path $repoRoot "lottie\shared"
if (Test-Path -LiteralPath $sharedDir) {
  Remove-Item -LiteralPath $sharedDir -Recurse -Force
  Write-Host "Removed stale lottie/shared from deployment root."
}

$brandIntro = Join-Path $repoRoot "lottie\light\brand-intro.json"
if (-not (Test-Path -LiteralPath $brandIntro -PathType Leaf)) {
  Write-Error "Missing deployed Brand Intro: $brandIntro"
  exit 1
}

$brandIntroText = Get-Content -LiteralPath $brandIntro -Raw -Encoding UTF8
if ($brandIntroText -notmatch "HZ Monogram") {
  Write-Error "Deployed Brand Intro does not contain HZ Monogram."
  exit 1
}

if ($brandIntroText -match '"nm"\s*:\s*"J"') {
  Write-Error "Deployed Brand Intro still contains old J layer."
  exit 1
}

Write-Host "Removed generated entries: $removed"
Write-Host "Synced static files: $syncedCount"
