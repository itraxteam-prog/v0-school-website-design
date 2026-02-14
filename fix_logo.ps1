Add-Type -AssemblyName System.Drawing
$inputPath = "c:\Users\wwwit\OneDrive\Desktop\Web Protos\v0-school-website-design\public\images\logo.jpeg"
$outputPath = "c:\Users\wwwit\OneDrive\Desktop\Web Protos\v0-school-website-design\public\images\logo_footer_transparent.png"

if (-not (Test-Path $inputPath)) {
    Write-Host "Error: Input file not found at $inputPath"
    exit
}

$img = [System.Drawing.Bitmap]::FromFile($inputPath)
$bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)

for ($x = 0; $x -lt $img.Width; $x++) {
    for ($y = 0; $y -lt $img.Height; $y++) {
        $pixel = $img.GetPixel($x, $y)
        
        $r = $pixel.R
        $g = $pixel.G
        $b = $pixel.B
        
        # Use the brightness/whiteness to determine alpha
        # We want to remove the white background.
        # Threshold for starting transparency
        $threshold = 240
        $min = [Math]::Min($r, [Math]::Min($g, $b))
        
        if ($min -ge $threshold) {
            # Map [threshold, 255] to [255, 0] alpha
            $alpha = [int](255 * (255 - $min) / (255 - $threshold))
            if ($alpha -lt 0) { $alpha = 0 }
            if ($alpha -gt 255) { $alpha = 255 }
            
            if ($alpha -gt 0) {
                # Try to preserve color by compensating for white background
                # This is a bit tricky, but let's just keep the color for now 
                # as the source is likely near-white anyway in these areas.
                $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $r, $g, $b))
            }
            else {
                $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
            }
        }
        else {
            $bmp.SetPixel($x, $y, $pixel)
        }
    }
}

$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$img.Dispose()
Write-Host "Success: Transparent logo saved to $outputPath"
