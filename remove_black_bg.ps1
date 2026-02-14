Add-Type -AssemblyName System.Drawing
$inputPath = "c:\Users\wwwit\OneDrive\Desktop\Web Protos\v0-school-website-design\public\images\logo_v2.jpg"
$outputPath = "c:\Users\wwwit\OneDrive\Desktop\Web Protos\v0-school-website-design\public\images\logo_v2.png"

$img = [System.Drawing.Image]::FromFile($inputPath)
$bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)

# Create a transparent background
$graphics.Clear([System.Drawing.Color]::Transparent)
$graphics.DrawImage($img, 0, 0, $img.Width, $img.Height)

# Iterate through pixels to make black transparent
for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $pixel = $bmp.GetPixel($x, $y)
        # Check if color is near black (thresholding)
        if ($pixel.R -lt 30 -and $pixel.G -lt 30 -and $pixel.B -lt 30) {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$img.Dispose()
$graphics.Dispose()
Write-Host "Success: Transparent logo saved to $outputPath"
