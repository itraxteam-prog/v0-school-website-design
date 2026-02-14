Add-Type -AssemblyName System.Drawing
$inputPath = "c:\Users\wwwit\OneDrive\Desktop\Web Protos\v0-school-website-design\public\images\logo.jpeg"
$outputPath = "c:\Users\wwwit\OneDrive\Desktop\Web Protos\v0-school-website-design\public\images\logo_new_footer.png"

if (-not (Test-Path $inputPath)) {
    Write-Host "Input file not found"
    exit
}

$img = [System.Drawing.Image]::FromFile($inputPath)
$bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::Transparent)
$g.DrawImage($img, 0, 0, $img.Width, $img.Height)

for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.R -gt 245 -and $p.G -gt 245 -and $p.B -gt 245) {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
        }
    }
}
$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$img.Dispose()
$g.Dispose()
Write-Host "Success"
