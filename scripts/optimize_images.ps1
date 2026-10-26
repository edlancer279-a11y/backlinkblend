Add-Type -AssemblyName System.Drawing

$imgDir = "c:\Users\samad\Documents\GitHub\backlinkblend\assets\images"
$files = Get-ChildItem -Path $imgDir -Filter "*.jpg"

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]80)

$totalOrig = 0
$totalNew = 0

foreach ($file in $files) {
    if ($file.Name.EndsWith("_opt.jpg")) { continue }
    $sourcePath = $file.FullName
    $origSize = $file.Length
    $totalOrig += $origSize

    # Determine target size
    $isAvatar = $file.Name.Contains("author") -or $file.Name.Contains("avatar")
    $isFavicon = $file.Name.Contains("favicon") -or $file.Name.Contains("apple-touch")
    
    try {
        $src = [System.Drawing.Image]::FromFile($sourcePath)
        $w = $src.Width
        $h = $src.Height

        if ($isAvatar) {
            $newW = [Math]::Min(160, $w)
            $newH = [Math]::Min(160, $h)
        } elseif ($isFavicon) {
            $newW = [Math]::Min(192, $w)
            $newH = [Math]::Min(192, $h)
        } else {
            # Banners: target 1200 max width, maintaining aspect ratio
            if ($w -gt 1200) {
                $scale = 1200.0 / $w
                $newW = 1200
                $newH = [int][Math]::Round($h * $scale)
            } else {
                $newW = $w
                $newH = $h
            }
        }

        $bmp = New-Object System.Drawing.Bitmap $newW, $newH
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.DrawImage($src, 0, 0, $newW, $newH)
        $g.Dispose()
        $src.Dispose()

        $tempPath = $sourcePath + ".tmp"
        $bmp.Save($tempPath, $encoder, $encoderParams)
        $bmp.Dispose()

        $newSize = (Get-Item $tempPath).Length
        if ($newSize -lt $origSize) {
            Move-Item -Path $tempPath -Destination $sourcePath -Force
            $totalNew += $newSize
            Write-Host "Optimized $($file.Name): $([math]::Round($origSize/1024,1))KB -> $([math]::Round($newSize/1024,1))KB"
        } else {
            Remove-Item $tempPath -Force
            $totalNew += $origSize
        }
    } catch {
        Write-Warning "Failed to optimize $($file.Name): $_"
        $totalNew += $origSize
    }
}

Write-Host "----------------------------------------"
Write-Host "Total Original: $([math]::Round($totalOrig/(1024*1024),2)) MB"
Write-Host "Total Optimized: $([math]::Round($totalNew/(1024*1024),2)) MB"
Write-Host "Saved: $([math]::Round(($totalOrig - $totalNew)/(1024*1024),2)) MB"
