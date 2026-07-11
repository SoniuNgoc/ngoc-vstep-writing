@echo off
cd /d "%~dp0"
start "Ngoc VSTEP Writing Lab" http://localhost:8080
python -m http.server 8080
pause
