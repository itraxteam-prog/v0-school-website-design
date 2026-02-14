Add-Type -AssemblyName System.Drawing
$inputPath = "C:\Users\wwwit\OneDrive\Desktop\Web Protos\v0-school-website-design\public\images\logo.jpeg"
$outputPath = "C:\Users\wwwit\OneDrive\Desktop\Web Protos\v0-school-website-design\public\images\logo.png"

$img = [System.Drawing.Image]::FromFile($inputPath)
$bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)

# Create a transparent background
$graphics.Clear([System.Drawing.Color]::Transparent)
$graphics.DrawImage($img, 0, 0, $img.Width, $img.Height)

# Iterate through pixels to make white transparent
for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $pixel = $bmp.GetPixel($x, $y)
        # Check if color is near white (thresholding)
        if ($pixel.R -gt 240 -and $pixel.G -gt 240 -and $pixel.B -gt 240) {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
        }
    }
}

$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$img.Dispose()
$graphics.Dispose()
Write-Host "Success: Transparent logo saved to $outputPath"
