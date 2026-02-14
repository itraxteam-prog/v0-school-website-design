Add-Type -AssemblyName System.Drawing
$inputPath = "c:\Users\wwwit\OneDrive\Desktop\Web Protos\v0-school-website-design\public\images\logo_v2.jpg"
$footerPath = "c:\Users\wwwit\OneDrive\Desktop\Web Protos\v0-school-website-design\public\images\logo_recolored_footer.png"
$navPath = "c:\Users\wwwit\OneDrive\Desktop\Web Protos\v0-school-website-design\public\images\logo_recolored_nav.png"

$img = [System.Drawing.Image]::FromFile($inputPath)

# --- Create Nav Logo (Transparent background, keep black text/stars) ---
$bmpNav = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
$gNav = [System.Drawing.Graphics]::FromImage($bmpNav)
$gNav.Clear([System.Drawing.Color]::Transparent)
$gNav.DrawImage($img, 0, 0, $img.Width, $img.Height)

# Flood fill background (approximate by checking edges)
# We'll do a simple threshold for background transparency
for ($x = 0; $x -lt $bmpNav.Width; $x++) {
    for ($y = 0; $y -lt $bmpNav.Height; $y++) {
        $p = $bmpNav.GetPixel($x, $y)
        # Background is black. If we are near the edges and it's black, it's likely background.
        # But a safer way is to detect the "blackness"
        # However, we want to keep black text.
        # Let's assume background is pure black or very close, and it's the dominant outer color.
        # We'll use a distance check from center to distinguish border vs background if possible, 
        # or just assume any black pixel with R,G,B < 40 is background/text.
        # Wait, if we want to keep text black in nav, we can't just make it transparent.
        # We only want to make the OUTSIDE black transparent.
    }
}

# Actually, a better approach for "Nav" is to just remove the outer black.
# We'll use a simple "outer" logic: if it's black and near edges, it's background.
# But logo is circular.
$centerX = $img.Width / 2
$centerY = $img.Height / 2
$maxRadius = [Math]::Min($centerX, $centerY) * 0.98

for ($x = 0; $x -lt $bmpNav.Width; $x++) {
    for ($y = 0; $y -lt $bmpNav.Height; $y++) {
        $p = $bmpNav.GetPixel($x, $y)
        $dist = [Math]::Sqrt([Math]::Pow($x - $centerX, 2) + [Math]::Pow($y - $centerY, 2))
        
        # If outside the circle and black, make transparent
        if ($dist -gt $maxRadius -and $p.R -lt 50 -and $p.G -lt 50 -and $p.B -lt 50) {
            $bmpNav.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}
$bmpNav.Save($navPath, [System.Drawing.Imaging.ImageFormat]::Png)

# --- Create Footer Logo (Transparent background, WHITE text/stars) ---
$bmpFooter = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
$gFooter = [System.Drawing.Graphics]::FromImage($bmpFooter)
$gFooter.Clear([System.Drawing.Color]::Transparent)
$gFooter.DrawImage($img, 0, 0, $img.Width, $img.Height)

for ($x = 0; $x -lt $bmpFooter.Width; $x++) {
    for ($y = 0; $y -lt $bmpFooter.Height; $y++) {
        $p = $bmpFooter.GetPixel($x, $y)
        $dist = [Math]::Sqrt([Math]::Pow($x - $centerX, 2) + [Math]::Pow($y - $centerY, 2))
        
        # 1. Background (outside circle) -> Transparent
        if ($dist -gt $maxRadius -and $p.R -lt 50 -and $p.G -lt 50 -and $p.B -lt 50) {
            $bmpFooter.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
        # 2. Blackish text/stars -> White
        elseif ($p.R -lt 50 -and $p.G -lt 50 -and $p.B -lt 50) {
            $bmpFooter.SetPixel($x, $y, [System.Drawing.Color]::White)
        }
    }
}
$bmpFooter.Save($footerPath, [System.Drawing.Imaging.ImageFormat]::Png)

$bmpNav.Dispose()
$bmpFooter.Dispose()
$img.Dispose()
$gNav.Dispose()
$gFooter.Dispose()

Write-Host "Success: Footer and Nav logos processed."
