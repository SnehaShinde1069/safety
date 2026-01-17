const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const axios = require('axios');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Store io instance for use in routes
app.io = io;

// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB not available: ${error.message}`);
    console.log('✅ Using in-memory mock data instead');
    // Don't exit, use mock data instead
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/incidents', require('./routes/incidentRoutes'));
app.use('/api/police', require('./routes/policeRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// AI Service Proxy
// If AI_SERVICE_URL is not set, return 503 so requests fail gracefully instead of
// attempting to connect to localhost:5001 inside the container.
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || '';

app.use('/ai', async (req, res) => {
  if (!AI_SERVICE_URL) {
    return res.status(503).json({ error: 'AI service not configured' });
  }

  try {
    const url = `${AI_SERVICE_URL}${req.url}`;
    const response = await axios({
      method: req.method,
      url: url,
      data: req.body,
      headers: Object.assign({}, req.headers, { 'host': new URL(AI_SERVICE_URL).host })
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('AI Service proxy error:', error.message);
    res.status(error.response?.status || 502).json({
      error: 'AI Service temporarily unavailable'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Girl Safety System Backend is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Serve frontend for all other routes (React Router)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  }
});

// 404 Handler
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'Route not found' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Real-time WebSocket connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('subscribe_alerts', (data) => {
    socket.join(`alerts_${data.userId}`);
    console.log(`User ${data.userId} subscribed to alerts`);
  });

  socket.on('subscribe_police_alerts', (data) => {
    socket.join(`police_alerts_${data.policeStationId}`);
    console.log(`Police station ${data.policeStationId} subscribed to alerts`);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = { app, io };
