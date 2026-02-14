Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::new('c:\Users\wwwit\OneDrive\Desktop\Web Protos\v0-school-website-design\public\images\logo.jpeg')
$img.MakeTransparent()
$img.Save('c:\Users\wwwit\OneDrive\Desktop\Web Protos\v0-school-website-design\public\images\logo_final.png', [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()
