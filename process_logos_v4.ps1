Add-Type -AssemblyName System.Drawing
$inputPath = "c:\Users\wwwit\OneDrive\Desktop\Web Protos\v0-school-website-design\public\images\logo_v2.jpg"
$footerPath = "c:\Users\wwwit\OneDrive\Desktop\Web Protos\v0-school-website-design\public\images\logo_recolored_footer.png"

$img = [System.Drawing.Image]::FromFile($inputPath)
$bmpFooter = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
$gFooter = [System.Drawing.Graphics]::FromImage($bmpFooter)
$gFooter.Clear([System.Drawing.Color]::Transparent)
$gFooter.DrawImage($img, 0, 0, $img.Width, $img.Height)

$centerX = $img.Width / 2
$centerY = $img.Height / 2
$maxRadius = [Math]::Min($centerX, $centerY) * 0.98

# Create a circle mask to only affect text/stars in specific areas
# Outer ring text is roughly between radius 0.65 and 0.95
# Stars are roughly at radius 0.7-0.8 at the bottom
for ($x = 0; $x -lt $bmpFooter.Width; $x++) {
    for ($y = 0; $y -lt $bmpFooter.Height; $y++) {
        $p = $bmpFooter.GetPixel($x, $y)
        $dist = [Math]::Sqrt([Math]::Pow($x - $centerX, 2) + [Math]::Pow($y - $centerY, 2))
        
        # 1. Background (outside circle) -> Transparent
        if ($dist -gt $maxRadius -and $p.R -lt 50 -and $p.G -lt 50 -and $p.B -lt 50) {
            $bmpFooter.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
        # 2. Blackish pixels (text/stars)
        elseif ($p.R -lt 60 -and $p.G -lt 60 -and $p.B -lt 60) {
            # Let's check if it's the specific circular text or the stars.
            # We want to avoid recoloring internal logo symbols if possible.
            # Red typography is handled by the "elseif" logic (preserving colors other than black).
            
            # The user wants ONLY the typography (The Pioneers School...) and the stars white.
            # Most of the black in this logo is text/stars.
            # We'll apply white only to the "Outer" parts where text and stars live.
            if ($dist -gt ($maxRadius * 0.6)) {
                $bmpFooter.SetPixel($x, $y, [System.Drawing.Color]::White)
            }
            # Otherwise, keep it as is (likely internal logo details)
        }
    }
}

$bmpFooter.Save($footerPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmpFooter.Dispose()
$img.Dispose()
$gFooter.Dispose()

Write-Host "Success: Footer logo refined with selective white coloring."
