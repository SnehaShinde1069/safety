# Girl Safety System - AI-Based Emergency Detection

A comprehensive AI-powered safety system designed to detect emergencies through hand-gesture recognition and Z-pattern mobile input, with real-time alerts to emergency contacts and police stations.

## 📋 Project Overview

This is a **final-year BCA project** that combines:
- **AI/ML**: Hand gesture detection using MediaPipe and OpenCV
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React.js with real-time updates
- **Mobile Detection**: Z-pattern emergency trigger on touch screens
- **Real-time Communication**: WebSocket integration for live alerts

### Key Features

✅ **Hand Gesture Detection** - Detects SOS and HELP gestures from CCTV/camera feeds  
✅ **Z-Pattern Recognition** - Emergency trigger by drawing Z-shape on mobile screen  
✅ **Automatic Alerts** - Sends emails to emergency contacts and nearest police stations  
✅ **Video Recording** - Captures incident video (configurable duration)  
✅ **Location Services** - Automatic geolocation and maps integration  
✅ **Dashboard Analytics** - Real-time dashboards for users, police, and admins  
✅ **Case Management** - Police can track and update incident status  
✅ **Multi-role System** - User, Police Officer, Admin roles with different permissions  

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Bootstrap, Socket.io-client |
| **Backend** | Node.js, Express.js, JWT |
| **Database** | MongoDB (Mongoose) |
| **AI/ML** | Flask, MediaPipe, OpenCV |
| **Real-time** | Socket.io, WebSockets |
| **Email** | Nodemailer, Flask-Mail |
| **Maps** | Leaflet, Google Maps API (optional) |

---

## 📁 Project Structure

```
safe/
├── backend/                  # Node.js + Express Server
│   ├── models/              # MongoDB Schemas (User, Incident, etc.)
│   ├── routes/              # API Routes
│   ├── controllers/          # Business Logic
│   ├── middleware/           # Auth, Validation
│   ├── utils/               # Email, JWT utilities
│   ├── config/              # Database config
│   ├── server.js            # Main server file
│   ├── package.json
│   └── .env.example
│
├── frontend/                # React.js Application
│   ├── src/
│   │   ├── pages/           # Login, Dashboard, History
│   │   ├── components/      # Reusable components
│   │   ├── utils/           # API calls, helpers
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .env.example
│
├── ai-service/              # Flask + Python
│   ├── app.py               # Flask app
│   ├── utils/               # Helper functions
│   ├── models/              # Trained models
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v14+ & npm
- **Python** 3.8+
- **MongoDB** (local or cloud)
- **Git**

### 1️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env

# Edit .env with your configuration
nano .env

npm run dev  # or: node server.js
```

**Backend runs on:** `http://localhost:5000`

### 2️⃣ AI Service Setup

```bash
cd ai-service
pip install -r requirements.txt
cp .env.example .env

# Edit .env
python app.py
```

**AI Service runs on:** `http://localhost:5001`

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env

npm start  # Opens http://localhost:3000
```

---

## 📊 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "fullName": "John Doe",
  "phone": "+919876543210",
  "address": "123 Main St",
  "city": "Delhi",
  "state": "Delhi",
  "pincode": "110001"
}

Response: { token, user }
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response: { token, user }
```

### User Endpoints

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{ fullName, phone, address, city, state, pincode }
```

### Emergency Contacts

#### Add Contact
```http
POST /api/contacts
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Mom",
  "phone": "+919876543210",
  "email": "mom@example.com",
  "relationship": "parent",
  "priority": 1
}
```

#### Get All Contacts
```http
GET /api/contacts
Authorization: Bearer {token}
```

#### Delete Contact
```http
DELETE /api/contacts/{contactId}
Authorization: Bearer {token}
```

### Incident Management

#### Create Incident (Emergency Trigger)
```http
POST /api/incidents
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "z-pattern-trigger",
  "description": "Emergency detected",
  "location": {
    "address": "123 Main St, Delhi",
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "severity": "critical",
  "videoUrl": "https://..."
}

Response: { incident, notifiedContacts, notifiedPoliceStations }
```

#### Get User Incidents
```http
GET /api/incidents/user/list?limit=20
Authorization: Bearer {token}
```

#### Get Incident Details
```http
GET /api/incidents/{incidentId}
Authorization: Bearer {token}
```

### Police Dashboard

#### Get Station Alerts
```http
GET /api/police/{stationId}/alerts
Authorization: Bearer {token}
```

#### Acknowledge Alert
```http
POST /api/police/{stationId}/alerts/{incidentId}/acknowledge
Authorization: Bearer {token}
```

#### Update Incident Status
```http
PUT /api/incidents/{incidentId}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "resolved",
  "outcome": "Case handled",
  "resolvedNotes": "..."
}
```

### Dashboard Analytics

#### User Dashboard
```http
GET /api/dashboard/user
Authorization: Bearer {token}
```

#### Police Dashboard
```http
GET /api/dashboard/police/{stationId}
Authorization: Bearer {token}
```

#### Admin Dashboard
```http
GET /api/dashboard/admin
Authorization: Bearer {token}
```

---

## 🤖 AI Service Endpoints

### Gesture Detection
```http
POST /api/detect-gesture
Content-Type: application/json

{
  "frame": "base64_encoded_image"
}

Response: { detected_gestures, emergency_triggered }
```

### Z-Pattern Detection
```http
POST /api/z-pattern
Content-Type: application/json

{
  "points": [
    { "x": 100, "y": 200 },
    { "x": 150, "y": 250 },
    ...
  ]
}

Response: { z_pattern_detected, points_count }
```

### Record Video
```http
POST /api/record-video
Content-Type: application/json

{
  "frames": ["base64_frame_1", "base64_frame_2", ...],
  "duration": 10
}

Response: { video_filename, video_path, frames_recorded }
```

---

## 🗄️ Database Schema

### User Model
```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  phone: String (unique),
  address: String,
  city: String,
  state: String,
  pincode: String,
  role: Enum ['user', 'police', 'admin'],
  policeStation: ObjectId (ref PoliceStation),
  emergencyContacts: [ObjectId],
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date
}
```

### Incident Model
```javascript
{
  userId: ObjectId (ref User),
  type: Enum ['hand-gesture-detection', 'z-pattern-trigger', 'manual-alert'],
  description: String,
  severity: Enum ['low', 'medium', 'high', 'critical'],
  location: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  videoUrl: String,
  status: Enum ['reported', 'acknowledged', 'investigating', 'resolved'],
  policeStationsNotified: [{
    stationId: ObjectId,
    notifiedAt: Date,
    status: String
  }],
  assignedOfficer: ObjectId,
  caseNotes: [{
    note: String,
    addedBy: ObjectId,
    timestamp: Date
  }],
  timestamp: Date
}
```

### EmergencyContact Model
```javascript
{
  userId: ObjectId,
  name: String,
  phone: String,
  email: String,
  relationship: Enum ['parent', 'sibling', 'friend', 'relative'],
  priority: Number (1-10),
  isNotifyEnabled: Boolean
}
```

### PoliceStation Model
```javascript
{
  name: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  latitude: Number,
  longitude: Number,
  jurisdiction: String,
  officers: [ObjectId],
  alertsReceived: Number,
  emergencyHandled: Number
}
```

### AlertLog Model
```javascript
{
  incidentId: ObjectId,
  userId: ObjectId,
  alertType: Enum ['email', 'sms', 'push-notification'],
  recipient: String,
  recipientType: Enum ['emergency-contact', 'police-station', 'admin'],
  status: Enum ['pending', 'sent', 'failed'],
  sentAt: Date,
  deliveredAt: Date,
  readAt: Date
}
```

---

## 🔐 Security Features

✅ **JWT Authentication** - Secure token-based auth  
✅ **Password Hashing** - bcryptjs for secure password storage  
✅ **Role-Based Access Control** - RBAC middleware for authorization  
✅ **Input Validation** - Express-validator for input sanitization  
✅ **CORS Protection** - Configured CORS policy  
✅ **Environment Variables** - Sensitive data in .env  
✅ **Rate Limiting** - Can be added with express-rate-limit  
✅ **SQL/NoSQL Injection Prevention** - Mongoose schemas prevent injection  

---

## 📧 Email Configuration

### Gmail SMTP Setup

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable "Less secure app access"
3. Generate an "App Password" for Gmail
4. Add to `.env`:
```env
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

---

## 🧪 Sample Test Data

### Create Admin User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@system.com",
    "password": "admin123",
    "fullName": "System Admin",
    "phone": "+919000000000",
    "role": "admin"
  }'
```

### Create Test User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "user123",
    "fullName": "Test User",
    "phone": "+918900000000",
    "address": "123 Main St",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001"
  }'
```

### Create Police Station
```bash
curl -X POST http://localhost:5000/api/police \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Central Police Station",
    "email": "central@police.gov.in",
    "phone": "+911123456789",
    "address": "Central Police Station, Delhi",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001",
    "latitude": 28.6139,
    "longitude": 77.2090
  }'
```

---

## 📱 Mobile Z-Pattern Usage

Users can draw a **Z-pattern** on their mobile screen to trigger emergency:

1. Go to Dashboard
2. See the "Draw Z-Pattern for Emergency SOS" canvas
3. Draw a Z-shape quickly (< 3 seconds)
4. System detects pattern and sends alerts

---

## 🎥 Hand Gesture Detection

The AI service monitors camera feeds for emergency gestures:

- **SOS Gesture**: Open palm → Fist → Open palm (repeated)
- **HELP Gesture**: Both hands raised above head
- Detection uses MediaPipe hand landmarks
- Triggers emergency alert when gesture confirmed

---

## 🚨 Emergency Alert Flow

```
User Action (Z-Pattern / Gesture)
    ↓
Flask AI Service detects pattern
    ↓
Backend creates Incident record
    ↓
Geolocation fetched + nearest police stations found
    ↓
Emails sent to:
  - Emergency Contacts
  - Nearest Police Stations
  - Admins
    ↓
Alert Logs created for tracking
    ↓
Real-time WebSocket notifications
    ↓
Police Dashboard updated
```

---

## 📊 Admin Features

- **User Management**: View, edit, disable users
- **Police Station Management**: Create, update, manage police stations
- **Incident Analytics**: View all incidents with filters
- **System Statistics**: Total users, incidents, resolution rates
- **Alert History**: Complete audit trail of all alerts

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
```
Error: MongoDB connection refused
Solution: Ensure MongoDB is running
  mongod --dbpath /path/to/data
```

### Port Already in Use
```
Error: Port 5000 already in use
Solution: Change PORT in .env or kill process using port
  netstat -ano | findstr :5000  (Windows)
  lsof -i :5000                 (Mac/Linux)
```

### Flask AI Service Not Responding
```
Error: Cannot connect to AI service
Solution: Ensure Flask is running on port 5001
  python ai-service/app.py
```

### Missing Dependencies
```
Error: Module not found
Solution: 
  npm install (in backend or frontend)
  pip install -r requirements.txt (in ai-service)
```

---

## 🔄 Real-time Updates

The system uses **Socket.io** for real-time updates:

```javascript
// Frontend connection
const socket = io('http://localhost:5000');

socket.on('incident-created', (data) => {
  console.log('Incident created:', data);
});

socket.on('new-incident', (incident) => {
  console.log('New incident received:', incident);
});
```

---

## 📈 Performance Optimization

- **Indexing**: Database indices on frequently queried fields
- **Caching**: JWT tokens cached in localStorage
- **Lazy Loading**: React components lazy-loaded
- **Geospatial Queries**: MongoDB 2dsphere index for location queries
- **Pagination**: Large datasets paginated
- **Image Compression**: Video frames compressed before transmission

---

## 🌐 Deployment

### Docker Setup (Optional)

```dockerfile
# Backend
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

```dockerfile
# Flask
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5001
CMD ["python", "app.py"]
```

### Production Checklist

- [ ] Update all `.env.example` to production values
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure MongoDB with authentication
- [ ] Set up proper logging
- [ ] Configure email service
- [ ] Test all APIs
- [ ] Set up monitoring/alerts
- [ ] Configure backup strategy
- [ ] Deploy on cloud (AWS, Azure, Heroku, etc.)

---

## 📚 Additional Resources

- [MediaPipe Hands Documentation](https://mediapipe.dev/solutions/hands)
- [OpenCV Documentation](https://opencv.org/)
- [MongoDB Mongoose Guide](https://mongoosejs.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)

---

## 👥 Team & Attribution

**Project**: Girl Safety System - AI-Based Emergency Detection  
**Type**: Final Year BCA Project  
**Developed**: 2024  

---

## 📄 License

This project is provided for educational purposes.

---

## 📞 Support & Feedback

For issues, suggestions, or contributions:
1. Create an issue in the repository
2. Email project maintainers
3. Submit pull requests

---

## 🎯 Future Enhancements

- [ ] SMS alerts via Twilio
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Advanced face recognition
- [ ] Integration with CCTV systems
- [ ] Machine learning model improvements
- [ ] Mobile app (React Native)
- [ ] Video analytics dashboard
- [ ] Incident prediction using ML
- [ ] IoT device integration

---

**Last Updated**: January 2024  
**Version**: 1.0.0

---

Made with ❤️ for Safety
