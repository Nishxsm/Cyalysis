@echo off
cd /d "%~dp0"
php spark serve --host 127.0.0.1 --port 8081
pause