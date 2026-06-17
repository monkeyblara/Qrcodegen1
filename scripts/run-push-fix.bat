@echo off
cd /d "%~dp0\.."
bash scripts/git-push-fix.sh
if ERRORLEVEL 1 (
  echo Push failed
  exit /b 1
)
echo Push script completed