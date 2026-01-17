@echo off
REM Girl Safety System - Setup Script for Windows

echo ================================
echo Girl Safety System - Setup (Windows)
echo ================================

REM Create .env files
echo.
echo Creating .env files...

REM Backend .env
(
echo # MongoDB Configuration
echo MONGO_URI=mongodb://localhost:27017/girl-safety-system
echo MONGODB_USER=admin
echo MONGODB_PASSWORD=your_password
echo.
echo # JWT Configuration
echo JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
echo JWT_EXPIRE=7d
echo.
echo # Server Configuration
echo PORT=5000
echo NODE_ENV=development
echo FRONTEND_URL=http://localhost:3000
echo.
echo # Flask AI Service
echo FLASK_API_URL=http://localhost:5001
echo.
echo # Email Configuration
echo EMAIL_USER=your_email@gmail.com
echo EMAIL_PASSWORD=your_app_specific_password
echo EMAIL_FROM=your_email@gmail.com
echo SMTP_HOST=smtp.gmail.com
echo SMTP_PORT=587
echo.
echo # Google Maps API
echo GOOGLE_MAPS_API_KEY=your_google_maps_api_key
) > backend\.env

REM Frontend .env
(
echo REACT_APP_API_URL=http://localhost:5000/api
echo REACT_APP_AI_URL=http://localhost:5001/api
) > frontend\.env

REM AI Service .env
(
echo FLASK_ENV=development
echo FLASK_DEBUG=True
echo BACKEND_URL=http://localhost:5000
echo AI_SERVICE_HOST=0.0.0.0
echo AI_SERVICE_PORT=5001
echo UPLOAD_FOLDER=recorded_videos
echo MAX_VIDEO_SIZE=100MB
) > ai-service\.env

echo .env files created

REM Install dependencies
echo.
echo Installing dependencies...

echo Installing backend dependencies...
cd backend
call npm install
cd ..

echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo Installing AI service dependencies...
cd ai-service
pip install -r requirements.txt
cd ..

echo Dependencies installed

REM Create directories
echo.
echo Creating required directories...
mkdir ai-service\recorded_videos
mkdir backend\uploads
echo Directories created

echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo To start the project:
echo.
echo 1. Backend:   cd backend ^&^& npm run dev
echo 2. AI Service: cd ai-service ^&^& python app.py
echo 3. Frontend:   cd frontend ^&^& npm start
echo.
echo Edit .env files with your configuration before running!
echo.
pause
