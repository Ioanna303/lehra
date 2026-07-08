# Minimal static file server so the browser can fetch() the sample audio.
# Chrome (and most browsers) block fetch()/XHR of local files entirely when
# a page is opened directly via file:// — the instrument samples need this
# server (or any other static server) to load. Without it, the app still
# works, just with the synthesized fallback instrument sound.
#
# Usage: powershell -File serve.ps1  [-Port 8420]
# Then open: http://localhost:8420/

param([int]$Port = 8420)

$root = $PSScriptRoot
$mime = @{
  ".html" = "text/html"; ".css" = "text/css"; ".js" = "application/javascript";
  ".m4a"  = "audio/mp4";  ".wav" = "audio/wav"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $root at http://localhost:$Port/  (Ctrl+C to stop)"

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $req = $context.Request
    $res = $context.Response
    try {
      $relPath = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart('/'))
      if ([string]::IsNullOrEmpty($relPath)) { $relPath = "index.html" }
      $full = Join-Path $root $relPath

      if ((Test-Path $full -PathType Leaf) -and $full.StartsWith($root)) {
        $ext = [System.IO.Path]::GetExtension($full)
        $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
        # No caching at all — this is a local dev server serving files that
        # change constantly; a stale cached script.js is a confusing bug to
        # chase (looks like "my change had no effect").
        $res.Headers.Add("Cache-Control", "no-store, no-cache, must-revalidate")
        $res.Headers.Add("Pragma", "no-cache")
        $bytes = [System.IO.File]::ReadAllBytes($full)
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
      } else {
        $res.StatusCode = 404
      }
    } finally {
      $res.Close()
    }
  }
} finally {
  $listener.Stop()
}
