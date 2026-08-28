@echo off
echo Starting Dota 2 Insight Backend and Frontend...

start "Dota 2 Insight Backend" cmd /k "cd backend && python run.py"
timeout /t 2 >nul
start "Dota 2 Insight Frontend" cmd /k "cd frontend && npm run dev"

echo Opening browser at http://localhost:3000...
timeout /t 2 >nul
start http://localhost:3000

echo Done! Both services are running.
