@echo off
REM BilltUp Development Server Startup Script (Windows)
REM This explicitly binds to 127.0.0.1 to avoid localhost resolution issues

echo 🚀 Starting BilltUp development server...
echo 📍 Binding to 127.0.0.1 (IPv4)
echo.

npm run dev -- --host 127.0.0.1
