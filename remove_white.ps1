Add-Type -AssemblyName System.Drawing
$inputPath = "c:\Users\wwwit\OneDrive\Desktop\Web Protos\v0-school-website-design\public\images\logo.jpeg"
$outputPath = "c:\Users\wwwit\OneDrive\Desktop\Web Protos\v0-school-website-design\public\images\logo_footer_transparent.png"

try {
    if (-not (Test-Path $inputPath)) {
        throw "Input file not found at $inputPath"
    }

    $img = [System.Drawing.Bitmap]::new($inputPath)
    $bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
    
    for ($x = 0; $x -lt $img.Width; $x++) {
        for ($y = 0; $y -lt $img.Height; $y++) {
            $p = $img.GetPixel($x, $y)
            
            # Check for near-white pixels
            # A more robust check: sum of R, G, B > 700 (avg > 233)
            if ($p.R -gt 240 -and $p.G -gt 240 -and $p.B -gt 240) {
                # Set to transparent
                $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
            }
            else {
                $bmp.SetPixel($x, $y, $p)
            }
        }
    }
    
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $img.Dispose()
    $bmp.Dispose()
    Write-Host "SUCCESS: $outputPath"
}
catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    exit 1
}
