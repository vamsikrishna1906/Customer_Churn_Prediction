$ErrorActionPreference = "Stop"

$root = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:8765/")

$contentTypes = @{
    ".css" = "text/css; charset=utf-8"
    ".csv" = "text/csv; charset=utf-8"
    ".html" = "text/html; charset=utf-8"
    ".js" = "text/javascript; charset=utf-8"
    ".svg" = "image/svg+xml"
}

try {
    $listener.Start()
    Write-Host "Churn dashboard: http://localhost:8765/"
    Write-Host "Press Ctrl+C to stop the local server."

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $response = $context.Response

        try {
            $relativePath = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart("/"))
            if ([string]::IsNullOrWhiteSpace($relativePath)) {
                $relativePath = "index.html"
            }

            $filePath = [System.IO.Path]::GetFullPath(
                [System.IO.Path]::Combine($root, $relativePath.Replace("/", [System.IO.Path]::DirectorySeparatorChar))
            )
            $rootPrefix = $root.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
            if (-not $filePath.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase) -or
                -not (Test-Path -LiteralPath $filePath -PathType Leaf)) {
                $response.StatusCode = 404
                $body = [System.Text.Encoding]::UTF8.GetBytes("Not found")
                $response.ContentType = "text/plain; charset=utf-8"
            } else {
                $body = [System.IO.File]::ReadAllBytes($filePath)
                $extension = [System.IO.Path]::GetExtension($filePath).ToLowerInvariant()
                $response.ContentType = if ($contentTypes.ContainsKey($extension)) {
                    $contentTypes[$extension]
                } else {
                    "application/octet-stream"
                }
            }

            $response.ContentLength64 = $body.Length
            $response.OutputStream.Write($body, 0, $body.Length)
        } finally {
            $response.Close()
        }
    }
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}
