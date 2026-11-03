Add-Type -AssemblyName System.Drawing

function New-ResizedBitmap {
  param(
    [System.Drawing.Image]$Image,
    [int]$MaxWidth
  )

  $scale = [Math]::Min([double]1.0, ([double]$MaxWidth / [double]$Image.Width))
  $width = [Math]::Max(1, [int][Math]::Round($Image.Width * $scale))
  $height = [Math]::Max(1, [int][Math]::Round($Image.Height * $scale))
  $bitmap = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.DrawImage($Image, 0, 0, $width, $height)
  $graphics.Dispose()
  return $bitmap
}

function Optimize-Png {
  param([string]$Path, [int]$MaxWidth)

  $resolved = (Resolve-Path $Path).Path
  $image = [System.Drawing.Image]::FromFile($resolved)
  if ($image.Width -le $MaxWidth) {
    $image.Dispose()
    return
  }
  $bitmap = New-ResizedBitmap -Image $image -MaxWidth $MaxWidth
  $image.Dispose()
  $temporary = "$resolved.optimized.png"
  $bitmap.Save($temporary, [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()
  Move-Item -LiteralPath $temporary -Destination $resolved -Force
}

function Optimize-Jpeg {
  param([string]$Path, [int]$MaxWidth, [long]$Quality)

  $resolved = (Resolve-Path $Path).Path
  $image = [System.Drawing.Image]::FromFile($resolved)
  if ($image.Width -le $MaxWidth) {
    $image.Dispose()
    return
  }
  $bitmap = New-ResizedBitmap -Image $image -MaxWidth $MaxWidth
  $image.Dispose()
  $temporary = "$resolved.optimized.jpg"
  $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
  $parameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)
  $bitmap.Save($temporary, $encoder, $parameters)
  $bitmap.Dispose()
  $parameters.Dispose()
  Move-Item -LiteralPath $temporary -Destination $resolved -Force
}

Optimize-Png -Path 'public/WCA DGs.png' -MaxWidth 1100
Optimize-Jpeg -Path 'public/ocean-freight-terminal.jpg' -MaxWidth 1600 -Quality 82
Optimize-Png -Path 'public/transportes.png' -MaxWidth 800

@(
  'public/certifications/stps-dc5.png',
  'public/certifications/dgta-membership.png',
  'public/certifications/ihmm-cdgp.png',
  'public/certifications/iata-diploma.png',
  'public/certifications/icao-tdc.png',
  'public/certifications/dgsa-sqa.png',
  'public/certifications/cbta-provider.png'
) | ForEach-Object { Optimize-Png -Path $_ -MaxWidth 900 }
