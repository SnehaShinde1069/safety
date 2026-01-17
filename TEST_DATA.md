# Sample Test Data for Girl Safety System

## Test User Data

```javascript
// User 1: Regular User
{
  "email": "sarah@example.com",
  "password": "sarah123",
  "fullName": "Sarah Johnson",
  "phone": "+919876543210",
  "address": "123 Oak Street, Apt 4B",
  "city": "Delhi",
  "state": "Delhi",
  "pincode": "110001"
}

// User 2: Another User
{
  "email": "priya@example.com",
  "password": "priya123",
  "fullName": "Priya Sharma",
  "phone": "+918765432109",
  "address": "456 Maple Avenue",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001"
}

// Police User
{
  "email": "officer@police.com",
  "password": "police123",
  "fullName": "Officer Rajesh Kumar",
  "phone": "+919123456789",
  "address": "Central Police Station",
  "city": "Delhi",
  "state": "Delhi",
  "pincode": "110001",
  "role": "police"
}

// Admin User
{
  "email": "admin@system.com",
  "password": "admin123",
  "fullName": "System Administrator",
  "phone": "+919000000000",
  "address": "Admin Office",
  "city": "Delhi",
  "state": "Delhi",
  "pincode": "110001",
  "role": "admin"
}
```

## Test Emergency Contacts

```javascript
// For Sarah
{
  "name": "Mrs. Johnson (Mom)",
  "phone": "+919876543211",
  "email": "mom@example.com",
  "relationship": "parent",
  "priority": 1
}

{
  "name": "John Johnson (Brother)",
  "phone": "+919876543212",
  "email": "john@example.com",
  "relationship": "sibling",
  "priority": 2
}

{
  "name": "Dr. Amy Foster (Friend)",
  "phone": "+919876543213",
  "email": "amy@example.com",
  "relationship": "friend",
  "priority": 3
}
```

## Test Police Stations

```javascript
{
  "name": "Central Police Station, Delhi",
  "email": "central@delhipolice.gov.in",
  "phone": "+911123456789",
  "address": "New Delhi Police Headquarters, ITO, New Delhi 110002",
  "city": "Delhi",
  "state": "Delhi",
  "pincode": "110002",
  "latitude": 28.6081,
  "longitude": 77.2333,
  "jurisdiction": "Central Delhi",
  "officerCount": 150,
  "responsibleOfficer": {
    "name": "DCP Sharma",
    "phone": "+911123456780",
    "email": "dcp@delhipolice.gov.in"
  }
}

{
  "name": "South Delhi Police Station",
  "email": "southdelhi@delhipolice.gov.in",
  "phone": "+911223456789",
  "address": "South Delhi Police Office, Mehrauli, New Delhi 110030",
  "city": "Delhi",
  "state": "Delhi",
  "pincode": "110030",
  "latitude": 28.5244,
  "longitude": 77.1855,
  "jurisdiction": "South Delhi",
  "officerCount": 120,
  "responsibleOfficer": {
    "name": "Inspector Singh",
    "phone": "+911223456780",
    "email": "inspector@southdelhi.gov.in"
  }
}

{
  "name": "East Delhi Police Station",
  "email": "eastdelhi@delhipolice.gov.in",
  "phone": "+911323456789",
  "address": "East Delhi Police Office, Ghazipur, New Delhi 110096",
  "city": "Delhi",
  "state": "Delhi",
  "pincode": "110096",
  "latitude": 28.5921,
  "longitude": 77.2793,
  "jurisdiction": "East Delhi",
  "officerCount": 100,
  "responsibleOfficer": {
    "name": "ACP Verma",
    "phone": "+911323456780",
    "email": "acp@eastdelhi.gov.in"
  }
}
```

## Test Incident Data

```javascript
// Incident 1: Z-Pattern Trigger
{
  "type": "z-pattern-trigger",
  "description": "Emergency alert triggered via mobile Z-pattern",
  "location": {
    "address": "Connaught Place, New Delhi",
    "latitude": 28.6328,
    "longitude": 77.1864
  },
  "severity": "high",
  "attachments": []
}

// Incident 2: Hand Gesture Detection
{
  "type": "hand-gesture-detection",
  "description": "SOS gesture detected from CCTV camera feed",
  "location": {
    "address": "Karol Bagh, New Delhi",
    "latitude": 28.6431,
    "longitude": 77.1923
  },
  "severity": "critical",
  "videoUrl": "https://example.com/video.mp4"
}

// Incident 3: Manual Alert
{
  "type": "manual-alert",
  "description": "User manually triggered emergency alert",
  "location": {
    "address": "Select Citywalk, Saket, New Delhi",
    "latitude": 28.5244,
    "longitude": 77.1855
  },
  "severity": "high"
}
```

## Test API Calls (cURL)

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah@example.com",
    "password": "sarah123",
    "fullName": "Sarah Johnson",
    "phone": "+919876543210",
    "address": "123 Oak Street",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah@example.com",
    "password": "sarah123"
  }'
```

### Add Emergency Contact
```bash
TOKEN="eyJhbGc..." # Copy from login response

curl -X POST http://localhost:5000/api/contacts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mom",
    "phone": "+919876543211",
    "email": "mom@example.com",
    "relationship": "parent",
    "priority": 1
  }'
```

### Create Incident
```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "z-pattern-trigger",
    "description": "Emergency alert triggered",
    "location": {
      "address": "Connaught Place, Delhi",
      "latitude": 28.6328,
      "longitude": 77.1864
    },
    "severity": "high"
  }'
```

### Get Dashboard
```bash
curl -X GET http://localhost:5000/api/dashboard/user \
  -H "Authorization: Bearer $TOKEN"
```

## Import Test Data to MongoDB

### Using MongoDB CLI

```bash
# Connect to MongoDB
mongo

# Create database and collections
use girl-safety-system

# Insert test users
db.users.insertMany([...])

# Insert test emergency contacts
db.emergencycontacts.insertMany([...])

# Insert test police stations
db.policestations.insertMany([...])
```

### Using Mongoose (Node.js)

```javascript
const User = require('./models/User');
const PoliceStation = require('./models/PoliceStation');
const EmergencyContact = require('./models/EmergencyContact');

// Seed users
const seedUsers = async () => {
  const users = [
    {
      email: 'sarah@example.com',
      password: 'sarah123',
      fullName: 'Sarah Johnson',
      phone: '+919876543210',
      role: 'user'
    }
  ];

  await User.insertMany(users);
  console.log('Users seeded!');
};

seedUsers();
```

## Performance Test Scenarios

### Test 1: Rapid Incident Creation
- Create 100 incidents in quick succession
- Monitor system performance
- Check database response times

### Test 2: Geospatial Queries
- Create incidents across multiple locations
- Query for incidents within 5km radius
- Measure query performance

### Test 3: Concurrent User Sessions
- Simulate 50 concurrent users
- Monitor server memory and CPU
- Check WebSocket connection stability

### Test 4: Large File Uploads
- Upload 100MB video files
- Monitor disk space
- Check upload/download speeds

### Test 5: Database Failover
- Stop MongoDB instance
- Verify error handling
- Check reconnection logic

## Load Testing

### Using Artillery

```yaml
# load-test.yml
config:
  target: "http://localhost:5000/api"
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "User Journey"
    flow:
      - post:
          url: "/auth/login"
          json:
            email: "sarah@example.com"
            password: "sarah123"
      - get:
          url: "/auth/profile"
      - get:
          url: "/contacts"
      - get:
          url: "/dashboard/user"
```

Run:
```bash
artillery run load-test.yml
```

---

Last Updated: January 2024
