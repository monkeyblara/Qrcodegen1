@echo off
REM Start MongoDB locally for testing
echo Starting MongoDB...
echo.
echo Make sure MongoDB is installed from: https://www.mongodb.com/try/download/community
echo.
echo Option 1: If MongoDB is installed as a Windows Service:
echo   MongoDB should start automatically
echo.
echo Option 2: If you need to start mongod manually:
echo   Open another Command Prompt and run:
echo   mongod --dbpath "C:\data\db"
echo.
echo Waiting for MongoDB to be ready...
timeout /t 3
echo.
echo Installing dependencies...
call npm install
echo.
cd client
call npm install
cd ..
echo.
echo Starting development server...
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo MongoDB:  mongodb://localhost:27017/qr-paint-system
echo.
npm run dev
pause
