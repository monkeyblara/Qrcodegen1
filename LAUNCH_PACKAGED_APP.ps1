$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$exe = Join-Path $root 'dist\packaged\Paint QR Generator-win32-x64\Paint QR Generator.exe'
if (Test-Path $exe) {
    Start-Process $exe
} else {
    Write-Host 'ERROR: Executable not found.' -ForegroundColor Red
    Write-Host "Expected location: $exe"
}
