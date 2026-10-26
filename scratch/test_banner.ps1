Add-Type -AssemblyName System.Drawing

$sourcePath = "c:\Users\samad\Documents\GitHub\backlinkblend\assets\images\ahrefs_seo_tools_guide_banner.jpg"
$destPath = "c:\Users\samad\Documents\GitHub\backlinkblend\assets\images\ahrefs_seo_tools_guide_banner_opt.jpg"

$src = [System.Drawing.Image]::FromFile($sourcePath)
$newW = 1200
$newH = 675
$bmp = New-Object System.Drawing.Bitmap $newW, $newH
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($src, 0, 0, $newW, $newH)
$g.Dispose()
$src.Dispose()

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]80)

$bmp.Save($destPath, $encoder, $encoderParams)
$bmp.Dispose()

$origSize = (Get-Item $sourcePath).Length
$newSize = (Get-Item $destPath).Length
Write-Host "Original: $origSize bytes ($([math]::Round($origSize/1024, 1)) KB), Optimized: $newSize bytes ($([math]::Round($newSize/1024, 1)) KB)"
