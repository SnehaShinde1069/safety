# Girl Safety System - QUICK START GUIDE

## 🚀 Start Here!

Choose your operating system:

---

## 💻 Windows Users

### Step 1: Run Setup Script
Double-click `setup.bat` (or run in Command Prompt):
```bash
setup.bat
```

This will:
- Create all .env configuration files
- Install Node.js dependencies
- Install Python packages
- Create required directories

### Step 2: Configure Environment

Edit these files with your actual values:

**backend/.env**
```env
JWT_SECRET=your_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
MONGO_URI=mongodb://localhost:27017/girl-safety-system
```

**frontend/.env**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**ai-service/.env**
```env
BACKEND_URL=http://localhost:5000
```

### Step 3: Start Services

Open 3 separate Command Prompt windows:

**Window 1 - Backend:**
```bash
cd backend
npm run dev
# Should see: "Server running on port 5000"
```

**Window 2 - AI Service:**
```bash
cd ai-service
python app.py
# Should see: "Running on http://0.0.0.0:5001"
```

**Window 3 - Frontend:**
```bash
cd frontend
npm start
# Should open http://localhost:3000 automatically
```

### Step 4: Test the System

1. Open http://localhost:3000
2. Register a new account
3. Add emergency contacts
4. Try the Z-pattern drawing feature

---

## 🍎 Mac Users

### Step 1: Install Prerequisites

```bash
# Install Node.js (if not already installed)
brew install node

# Install Python (if not already installed)
brew install python3

# Install MongoDB (optional - can use MongoDB Atlas cloud)
brew tap mongodb/brew
brew install mongodb-community
```

### Step 2: Run Setup Script

```bash
cd ~/Desktop/safe
bash setup.sh
```

### Step 3-4: Same as Windows

Follow steps 2-4 from Windows guide above.

---

## 🐧 Linux Users

### Step 1: Install Prerequisites

```bash
# Update package manager
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python
sudo apt install -y python3 python3-pip

# Install MongoDB (optional)
sudo apt install -y mongodb
```

### Step 2: Run Setup Script

```bash
cd ~/Desktop/safe
bash setup.sh
```

### Step 3-4: Same as Windows

Follow steps 2-4 from Windows guide above.

---

## 🧪 Verify Everything Works

### Test Backend
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"OK","message":"..."}
```

### Test AI Service
```bash
curl http://localhost:5001/health
# Should return: {"status":"OK","service":"Hand Gesture & Z-Pattern Detection"}
```

### Test Frontend
Open browser: http://localhost:3000
Should see login page

---

## 📝 First Login

### Create Test User
Register with:
- Email: test@example.com
- Password: test123
- Full Name: Test User
- Phone: +919876543210

### Add Emergency Contact
1. Click "Emergency Contacts" in navigation
2. Click "Add Contact"
3. Fill in contact details
4. Click "Save Contact"

### Test Emergency Alert
1. Go to Dashboard
2. Draw a Z-shape on the canvas
3. See alert notification (if email configured)

---

## 📧 Email Setup (Optional)

For alerts to actually send emails:

1. Go to myaccount.google.com/security
2. Enable "Less secure app access"
3. Generate "App Password" for Gmail
4. Add to backend/.env:
   ```env
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

---

## 🗂️ Project Structure

```
safe/
├── backend/          ← Start here: npm run dev
├── frontend/         ← Start here: npm start
├── ai-service/       ← Start here: python app.py
└── Documentation/
    ├── README.md                    ← Full guide
    ├── API_DOCUMENTATION.md         ← All 27 endpoints
    ├── DEPLOYMENT.md                ← Deploy to cloud
    └── TEST_DATA.md                 ← Test scenarios
```

---

## 🔧 Troubleshooting

### Port Already in Use

**Error**: Port 5000/3000/5001 is already in use

**Solution:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux - Find and kill process
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Failed

**Error**: Cannot connect to MongoDB

**Solution:**
```bash
# Make sure MongoDB is running
# Option 1: Use MongoDB Atlas (cloud)
# - Create account at mongodb.com/cloud/atlas
# - Get connection string
# - Add to backend/.env as MONGO_URI

# Option 2: Run local MongoDB
mongod
```

### Module Not Found

**Error**: Cannot find module 'express'

**Solution:**
```bash
# Re-install dependencies
cd backend
npm install
npm install

cd ../frontend
npm install
npm install

cd ../ai-service
pip install -r requirements.txt
```

### Flask Not Starting

**Error**: Python not found

**Solution:**
```bash
# Use python3 instead
cd ai-service
python3 app.py
```

---

## 📚 Next Steps

After everything is working:

1. **Read Documentation**
   - README.md - Complete guide
   - API_DOCUMENTATION.md - All endpoints
   - DEPLOYMENT.md - Deploy to cloud

2. **Customize**
   - Change styling in frontend/src/App.css
   - Add your police stations via API
   - Configure your email service
   - Update database credentials

3. **Deploy**
   - Follow DEPLOYMENT.md
   - Choose platform (Docker, AWS, Heroku, etc.)
   - Set up production environment

4. **Test**
   - Use test data from TEST_DATA.md
   - Try all features
   - Test error scenarios

---

## 🎯 Key API Endpoints

```bash
# Register
POST http://localhost:5000/api/auth/register
{
  "email": "user@test.com",
  "password": "test123",
  "fullName": "Test User",
  "phone": "+919876543210"
}

# Login
POST http://localhost:5000/api/auth/login
{
  "email": "user@test.com",
  "password": "test123"
}

# Create Emergency Alert
POST http://localhost:5000/api/incidents
{
  "type": "z-pattern-trigger",
  "description": "Emergency alert",
  "location": {
    "address": "123 Main St",
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "severity": "high"
}
```

---

## 💾 Useful Terminal Commands

```bash
# View backend logs
cd backend && npm run dev

# View Flask logs
cd ai-service && python app.py

# View frontend
cd frontend && npm start

# Check if ports are open
curl http://localhost:5000/api/health
curl http://localhost:5001/health
curl http://localhost:3000
```

---

## ✅ Checklist

After setup, verify:
- [ ] Backend running on port 5000
- [ ] AI Service running on port 5001
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can register new user
- [ ] Can add emergency contact
- [ ] Can view dashboard

---

## 🆘 Need Help?

1. **Check logs** - Look at terminal output
2. **Review documentation** - README.md has answers
3. **Check test data** - TEST_DATA.md has examples
4. **Review API docs** - API_DOCUMENTATION.md explains endpoints

---

## 📞 Quick Reference

| Service | Port | Command | Status URL |
|---------|------|---------|-----------|
| Backend | 5000 | `npm run dev` | http://localhost:5000/api/health |
| AI | 5001 | `python app.py` | http://localhost:5001/health |
| Frontend | 3000 | `npm start` | http://localhost:3000 |

---

## 🎉 You're Ready!

Your Girl Safety System is now running. You can:
- ✅ Register users
- ✅ Add emergency contacts
- ✅ Trigger emergency alerts
- ✅ View incident history
- ✅ Test all features

**Enjoy!** 🚀

---

**For more details, see:**
- README.md (Complete guide)
- API_DOCUMENTATION.md (All endpoints)
- DEPLOYMENT.md (Cloud deployment)
- TEST_DATA.md (Test scenarios)

---

Last Updated: January 2024
