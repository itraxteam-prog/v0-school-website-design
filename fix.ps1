Add-Type -AssemblyName System.Drawing
$inputPath = 'c:\Users\wwwit\OneDrive\Desktop\Web Protos\v0-school-website-design\public\images\logo.jpeg'
$outputPath = 'c:\Users\wwwit\OneDrive\Desktop\Web Protos\v0-school-website-design\public\images\logo_new_footer.png'

try {
    $img = New-Object System.Drawing.Bitmap($inputPath)
    $bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
    
    for ($x = 0; $x -lt $img.Width; $x++) {
        for ($y = 0; $y -lt $img.Height; $y++) {
            $p = $img.GetPixel($x, $y)
            # Use a slightly more aggressive threshold for background
            if ($p.R -gt 235 -and $p.G -gt 235 -and $p.B -gt 235) {
                # Transparent
                $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
            }
            else {
                $bmp.SetPixel($x, $y, $p)
            }
        }
    }
    
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $img.Dispose()
    Write-Host "File saved to $outputPath"
}
catch {
    Write-Host "Error: $($_.Exception.Message)"
}
