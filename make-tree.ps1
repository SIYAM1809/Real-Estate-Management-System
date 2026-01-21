$root = "."
$maxDepth = 4
$exclude = @("node_modules",".git","dist","build","coverage",".next",".vercel",".cache","logs",".turbo")

function Write-Tree([string]$path, [string]$prefix, [int]$depth) {
  if ($depth -lt 0) { return }

  $items = Get-ChildItem -LiteralPath $path -Force |
    Where-Object { $exclude -notcontains $_.Name } |
    Sort-Object @{Expression="PSIsContainer";Descending=$true}, Name

  for ($i = 0; $i -lt $items.Count; $i++) {
    $item = $items[$i]
    $isLast = ($i -eq $items.Count - 1)

    $connector = if ($isLast) { "└── " } else { "├── " }
    "$prefix$connector$($item.Name)"

    if ($item.PSIsContainer) {
      $pad = "│   "
      if ($isLast) { $pad = "    " }
      $newPrefix = $prefix + $pad
      Write-Tree $item.FullName $newPrefix ($depth - 1)
    }
  }
}

$projectName = Split-Path -Leaf (Resolve-Path $root)
$out = @()
$out += $projectName
$out += Write-Tree (Resolve-Path $root) "" ($maxDepth - 1)

$out | Set-Content -Encoding utf8 TREE_README.md
Write-Host "Done -> TREE_README.md"
