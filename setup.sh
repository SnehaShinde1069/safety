#!/bin/bash

# Girl Safety System - Setup Script

echo "================================"
echo "Girl Safety System - Setup"
echo "================================"

# Create .env files
echo ""
echo "Creating .env files..."

# Backend .env
cat > backend/.env << EOF
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/girl-safety-system
MONGODB_USER=admin
MONGODB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Flask AI Service
FLASK_API_URL=http://localhost:5001

# Email Configuration (Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=your_email@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Google Maps API (for location services)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
EOF

# Frontend .env
cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_AI_URL=http://localhost:5001/api
EOF

# AI Service .env
cat > ai-service/.env << EOF
FLASK_ENV=development
FLASK_DEBUG=True

# Backend URL
BACKEND_URL=http://localhost:5000

# AI Service
AI_SERVICE_HOST=0.0.0.0
AI_SERVICE_PORT=5001

# Video Storage
UPLOAD_FOLDER=recorded_videos
MAX_VIDEO_SIZE=100MB
EOF

echo "✓ .env files created"

# Install dependencies
echo ""
echo "Installing dependencies..."

echo "Installing backend dependencies..."
cd backend && npm install && cd ..

echo "Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "Installing AI service dependencies..."
cd ai-service && pip install -r requirements.txt && cd ..

echo "✓ Dependencies installed"

# Create directories
echo ""
echo "Creating required directories..."
mkdir -p ai-service/recorded_videos
mkdir -p backend/uploads
echo "✓ Directories created"

echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "To start the project:"
echo ""
echo "1. Backend:   cd backend && npm run dev"
echo "2. AI Service: cd ai-service && python app.py"
echo "3. Frontend:   cd frontend && npm start"
echo ""
echo "Edit .env files with your configuration before running!"
echo ""
