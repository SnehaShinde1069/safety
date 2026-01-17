# API Documentation - Girl Safety System

## Overview
Complete API reference for the Girl Safety System backend.

## Base URL
`http://localhost:5000/api`

## Authentication
Most endpoints require JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "+919876543210",
  "address": "123 Main Street",
  "city": "Delhi",
  "state": "Delhi",
  "pincode": "110001"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "user"
  }
}
```

**Status Codes:**
- `201`: User created successfully
- `400`: User with this email/phone already exists
- `500`: Server error

---

### 2. Login
**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": { /* user object */ }
}
```

**Status Codes:**
- `200`: Login successful
- `401`: Invalid email or password
- `403`: User account is disabled

---

## User Endpoints

### 3. Get User Profile
**GET** `/auth/profile`

Get logged-in user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "...",
  "fullName": "John Doe",
  "email": "user@example.com",
  "phone": "+919876543210",
  "role": "user",
  "emergencyContacts": [ /* contact objects */ ],
  "createdAt": "2024-01-15T..."
}
```

---

### 4. Update User Profile
**PUT** `/auth/profile`

Update user profile information.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "Jane Doe",
  "phone": "+919876543210",
  "address": "456 Oak Avenue",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": { /* updated user object */ }
}
```

---

### 5. Change Password
**POST** `/auth/change-password`

Change user password.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "oldPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

---

## Emergency Contact Endpoints

### 6. Add Emergency Contact
**POST** `/contacts`

Add a new emergency contact.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Mom",
  "phone": "+919876543210",
  "email": "mom@example.com",
  "relationship": "parent",
  "priority": 1
}
```

**Valid Relationships:**
- `parent`
- `sibling`
- `friend`
- `relative`
- `other`

**Response:**
```json
{
  "message": "Emergency contact added successfully",
  "contact": {
    "_id": "...",
    "userId": "...",
    "name": "Mom",
    "phone": "+919876543210",
    "priority": 1
  }
}
```

---

### 7. Get Emergency Contacts
**GET** `/contacts`

Get all emergency contacts for the user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "count": 3,
  "contacts": [
    {
      "_id": "...",
      "name": "Mom",
      "phone": "+919876543210",
      "priority": 1
    },
    /* more contacts */
  ]
}
```

---

### 8. Update Emergency Contact
**PUT** `/contacts/{contactId}`

Update an emergency contact.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Mother",
  "phone": "+919876543210",
  "priority": 2
}
```

---

### 9. Delete Emergency Contact
**DELETE** `/contacts/{contactId}`

Delete an emergency contact.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Contact deleted successfully"
}
```

---

## Incident Endpoints

### 10. Create Incident
**POST** `/incidents`

Report a new incident (emergency alert).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "z-pattern-trigger",
  "description": "Emergency situation detected",
  "location": {
    "address": "123 Main St, Delhi",
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "severity": "critical",
  "videoUrl": "https://storage.example.com/video.mp4"
}
```

**Valid Types:**
- `hand-gesture-detection`
- `z-pattern-trigger`
- `manual-alert`
- `panic-button`

**Valid Severities:**
- `low`
- `medium`
- `high`
- `critical`

**Response:**
```json
{
  "message": "Incident reported successfully",
  "incident": {
    "_id": "...",
    "userId": "...",
    "type": "z-pattern-trigger",
    "status": "reported",
    "severity": "critical",
    "timestamp": "2024-01-15T..."
  },
  "notifiedContacts": 3,
  "notifiedPoliceStations": 2
}
```

---

### 11. Get User Incidents
**GET** `/incidents/user/list?limit=20&skip=0`

Get all incidents reported by the user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (default: 20) - Number of incidents
- `skip` (default: 0) - Pagination offset
- `status` (optional) - Filter by status

**Response:**
```json
{
  "total": 5,
  "count": 5,
  "incidents": [
    {
      "_id": "...",
      "type": "z-pattern-trigger",
      "severity": "critical",
      "status": "reported",
      "timestamp": "2024-01-15T..."
    }
  ]
}
```

---

### 12. Get Incident Details
**GET** `/incidents/{incidentId}`

Get detailed information about a specific incident.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "...",
  "userId": { /* user details */ },
  "type": "z-pattern-trigger",
  "severity": "critical",
  "status": "investigating",
  "location": { /* location details */ },
  "videoUrl": "...",
  "policeStationsNotified": [ /* notifications */ ],
  "assignedOfficer": { /* officer details */ },
  "caseNotes": [ /* case notes */ ]
}
```

---

### 13. Update Incident Status (Police Only)
**PUT** `/incidents/{incidentId}/status`

Update incident status (police/admin only).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "resolved",
  "outcome": "Case resolved successfully",
  "resolvedNotes": "Suspect arrested"
}
```

**Valid Statuses:**
- `reported`
- `acknowledged`
- `investigating`
- `resolved`
- `false-alarm`

**Response:**
```json
{
  "message": "Incident updated successfully",
  "incident": { /* updated incident */ }
}
```

---

### 14. Add Case Notes
**POST** `/incidents/{incidentId}/notes`

Add notes to an incident (police/admin).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "note": "Officer arrived at scene. No immediate threat detected."
}
```

---

### 15. Get All Incidents (Admin/Police)
**GET** `/incidents?limit=50&status=reported`

Get all incidents (admin/police only).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (default: 50)
- `skip` (default: 0)
- `status` (optional)
- `severity` (optional)
- `startDate` (optional) - ISO format
- `endDate` (optional) - ISO format

---

## Police Station Endpoints

### 16. Get All Police Stations
**GET** `/police`

Get all police stations.

**Query Parameters:**
- `city` (optional)
- `state` (optional)
- `isActive` (optional) - true/false

**Response:**
```json
{
  "count": 5,
  "stations": [
    {
      "_id": "...",
      "name": "Central Police Station",
      "email": "central@police.gov.in",
      "phone": "+911123456789",
      "city": "Delhi",
      "alertsReceived": 12,
      "emergencyHandled": 10
    }
  ]
}
```

---

### 17. Get Police Station Details
**GET** `/police/{stationId}`

Get details of a specific police station.

**Response:**
```json
{
  "_id": "...",
  "name": "Central Police Station",
  "email": "central@police.gov.in",
  "phone": "+911123456789",
  "address": "Central Police Station, Delhi",
  "city": "Delhi",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "officers": [ /* list of officers */ ],
  "alertsReceived": 12,
  "emergencyHandled": 10
}
```

---

### 18. Get Station Alerts
**GET** `/police/{stationId}/alerts?limit=50&status=reported`

Get all alerts for a police station.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "stationId": "...",
  "total": 12,
  "count": 12,
  "incidents": [ /* incident list */ ]
}
```

---

### 19. Acknowledge Alert
**POST** `/police/{stationId}/alerts/{incidentId}/acknowledge`

Acknowledge an alert (police).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Alert acknowledged",
  "incident": { /* updated incident */ }
}
```

---

### 20. Get Station Statistics
**GET** `/police/{stationId}/statistics`

Get statistics for a police station.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "stationId": "...",
  "statistics": {
    "totalAlerts": 20,
    "resolvedIncidents": 15,
    "pendingIncidents": 5,
    "resolutionRate": "75.00%",
    "byType": [
      { "_id": "hand-gesture-detection", "count": 8 },
      { "_id": "z-pattern-trigger", "count": 12 }
    ]
  }
}
```

---

## Dashboard Endpoints

### 21. Get User Dashboard
**GET** `/dashboard/user`

Get user's dashboard data.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": { /* user details */ },
  "statistics": {
    "totalIncidents": 5,
    "resolvedIncidents": 3,
    "pendingIncidents": 2,
    "resolutionRate": "60.00%"
  },
  "recentIncidents": [ /* 5 most recent */ ],
  "incidentsByType": [ /* breakdown by type */ ],
  "emergencyContactsCount": 4
}
```

---

### 22. Get Police Dashboard
**GET** `/dashboard/police/{stationId}`

Get police station dashboard.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "station": { /* station details */ },
  "statistics": {
    "totalAlerts": 20,
    "resolvedAlerts": 15,
    "pendingAlerts": 5,
    "resolutionRate": "75.00%"
  },
  "recentAlerts": [ /* 5 recent alerts */ ],
  "alertsBySeverity": [ /* breakdown */ ]
}
```

---

### 23. Get Admin Dashboard
**GET** `/dashboard/admin`

Get admin dashboard (admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "statistics": {
    "totalUsers": 150,
    "totalPoliceStations": 10,
    "totalIncidents": 245,
    "totalResolved": 189,
    "resolutionRate": "77.14%"
  },
  "usersByRole": [ /* breakdown */ ],
  "incidentsByStatus": [ /* breakdown */ ],
  "incidentsBySeverity": [ /* breakdown */ ],
  "topStations": [ /* top 5 active stations */ ],
  "recentIncidents": [ /* 10 recent */ ]
}
```

---

## Alert Endpoints

### 24. Get Alert History
**GET** `/alerts/history?limit=50&skip=0`

Get user's alert history.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "total": 25,
  "count": 25,
  "logs": [
    {
      "_id": "...",
      "incidentId": "...",
      "alertType": "email",
      "recipient": "mom@example.com",
      "status": "sent",
      "sentAt": "2024-01-15T...",
      "deliveredAt": "2024-01-15T..."
    }
  ]
}
```

---

### 25. Mark Alert as Read
**PUT** `/alerts/{alertId}/read`

Mark an alert as read.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Alert marked as read",
  "alert": { /* updated alert */ }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting

Current implementation has no rate limiting. For production, add:
```bash
npm install express-rate-limit
```

---

## WebSocket Events

Real-time updates via Socket.io:

### Subscribe to Alerts
```javascript
socket.emit('subscribe_alerts', { userId: 'user_id' });

socket.on('incident-created', (data) => {
  console.log('New incident:', data);
});
```

### Subscribe to Police Alerts
```javascript
socket.emit('subscribe_police_alerts', { policeStationId: 'station_id' });

socket.on('new-incident', (incident) => {
  console.log('New incident for station:', incident);
});
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123",
    "fullName": "Test User",
    "phone": "+919876543210"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Version
API Version: 1.0.0

---

For more information, see [README.md](./README.md)
