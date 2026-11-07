# Gera as imagens de compartilhamento (1200x630) a partir de fontes/og.html:
#   img/og-black-talks.jpg  (og.html?a=black)
#   img/og-roleta.jpg       (og.html?a=roleta)
# Uso:  powershell -ExecutionPolicy Bypass -File fontes\gerar-og.ps1
# Precisa de internet (fontes do Google) e do Microsoft Edge instalado.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe" }
$work = Join-Path $env:TEMP "black-talks-og"
$prof = Join-Path $work "edge-profile"
New-Item -ItemType Directory -Force $work | Out-Null
$raiz = Split-Path $PSScriptRoot -Parent
$fonte = ($PSScriptRoot -replace '\\', '/') + '/og.html'

$jpeg = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$qual = New-Object Drawing.Imaging.EncoderParameters 1
$qual.Param[0] = New-Object Drawing.Imaging.EncoderParameter ([Drawing.Imaging.Encoder]::Quality), 90L

foreach ($a in @('black', 'roleta')) {
  $raw = Join-Path $work "captura.png"
  if (Test-Path $raw) { Remove-Item $raw }
  $edgeArgs = @("--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files", "--no-first-run",
                "--user-data-dir=$prof", "--window-size=1200,630", "--force-device-scale-factor=1",
                "--virtual-time-budget=10000", "--screenshot=$raw", "file:///$fonte`?a=$a")
  Start-Process -FilePath $edge -ArgumentList $edgeArgs -Wait -NoNewWindow -RedirectStandardError "$work\err.txt" -RedirectStandardOutput "$work\out.txt"
  if (-not (Test-Path $raw)) { throw "Falha ao capturar $a" }
  $src = [Drawing.Bitmap]::FromFile($raw)
  $rgb = $src.Clone((New-Object Drawing.Rectangle 0, 0, 1200, 630), [Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $nome = if ($a -eq 'roleta') { 'og-roleta.jpg' } else { 'og-black-talks.jpg' }
  $destino = Join-Path $raiz "img\$nome"
  $rgb.Save($destino, $jpeg, $qual)
  $rgb.Dispose(); $src.Dispose()
  Write-Host "  img\$nome"
}
