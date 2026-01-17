// Mock in-memory database for testing without MongoDB

let users = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword123',
    fullName: 'Sarah Johnson',
    phone: '9876543210',
    role: 'user',
    isActive: true,
    lastLogin: new Date(),
    emergencyContacts: [],
    createdAt: new Date(),
  },
  {
    id: '2',
    email: 'officer@police.com',
    password: 'hashedPassword123',
    fullName: 'Officer John Smith',
    phone: '1234567890',
    role: 'police',
    policeStation: '1',
    policeStationName: 'Central Police Station',
    badgeNumber: 'CP-2024-001',
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date(),
  },
  {
    id: '3',
    email: 'admin@safesystem.com',
    password: 'hashedPassword123',
    fullName: 'Admin Dashboard',
    phone: '5555555555',
    role: 'admin',
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date(),
  },
];

let contacts = [];
let incidents = [];
let policeStations = [
  {
    id: '1',
    name: 'Central Police Station',
    email: 'central@police.com',
    phone: '1234567890',
    address: 'Main Street',
    city: 'Springfield',
    latitude: 40.7128,
    longitude: -74.0060,
    isActive: true,
    alertsReceived: 0,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'North Police Station',
    email: 'north@police.com',
    phone: '0987654321',
    address: 'North Avenue',
    city: 'Springfield',
    latitude: 40.7580,
    longitude: -73.9855,
    isActive: true,
    alertsReceived: 0,
    createdAt: new Date(),
  },
];

let alertLogs = [];

module.exports = {
  // User operations
  getUser: (id) => users.find(u => u.id === id),
  getUserByEmail: (email) => users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  getAllUsers: () => users,
  createUser: (userData) => {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date(),
      emergencyContacts: [],
    };
    users.push(newUser);
    return newUser;
  },
  updateUser: (id, userData) => {
    const user = users.find(u => u.id === id);
    if (user) {
      Object.assign(user, userData);
    }
    return user;
  },
  deleteUser: (id) => {
    users = users.filter(u => u.id !== id);
  },

  // Contact operations
  getContacts: (userId) => contacts.filter(c => c.userId === userId),
  addContact: (contactData) => {
    const newContact = {
      id: Date.now().toString(),
      ...contactData,
      createdAt: new Date(),
    };
    contacts.push(newContact);
    return newContact;
  },
  updateContact: (id, data) => {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
      Object.assign(contact, data);
    }
    return contact;
  },
  deleteContact: (id) => {
    contacts = contacts.filter(c => c.id !== id);
  },

  // Incident operations
  createIncident: (incidentData) => {
    const newIncident = {
      id: Date.now().toString(),
      ...incidentData,
      status: 'reported',
      createdAt: new Date(),
      policeStationsNotified: [],
      emergencyContactsNotified: [],
      caseNotes: [],
    };
    incidents.push(newIncident);
    return newIncident;
  },
  getIncident: (id) => incidents.find(i => i.id === id),
  getUserIncidents: (userId) => incidents.filter(i => i.userId === userId),
  getAllIncidents: () => incidents,
  updateIncident: (id, data) => {
    const incident = incidents.find(i => i.id === id);
    if (incident) {
      Object.assign(incident, data);
    }
    return incident;
  },

  // Police Station operations
  getPoliceStation: (id) => policeStations.find(s => s.id === id),
  getAllPoliceStations: () => policeStations,
  createPoliceStation: (stationData) => {
    const newStation = {
      id: Date.now().toString(),
      ...stationData,
      alertsReceived: 0,
      createdAt: new Date(),
    };
    policeStations.push(newStation);
    return newStation;
  },
  updatePoliceStation: (id, data) => {
    const station = policeStations.find(s => s.id === id);
    if (station) {
      Object.assign(station, data);
    }
    return station;
  },
  getNearbyStations: (latitude, longitude, maxDistance = 5000) => {
    // Simple distance calculation (not accurate but works for demo)
    return policeStations.filter(s => {
      const latDiff = Math.abs(s.latitude - latitude) * 111000; // meters per degree
      const lonDiff = Math.abs(s.longitude - longitude) * 111000 * Math.cos((latitude * Math.PI) / 180);
      const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
      return distance <= maxDistance && s.isActive;
    });
  },

  // Alert operations
  createAlertLog: (alertData) => {
    const newAlert = {
      id: Date.now().toString(),
      ...alertData,
      status: 'sent',
      createdAt: new Date(),
    };
    alertLogs.push(newAlert);
    return newAlert;
  },
  getAlertHistory: (userId) => alertLogs.filter(a => a.userId === userId),

  // Dashboard stats
  getDashboardStats: (userId) => {
    const userIncidents = incidents.filter(i => i.userId === userId);
    return {
      totalIncidents: userIncidents.length,
      resolvedIncidents: userIncidents.filter(i => i.status === 'resolved').length,
      pendingIncidents: userIncidents.filter(i => i.status === 'reported' || i.status === 'investigating').length,
      emergencyContacts: contacts.filter(c => c.userId === userId).length,
    };
  },

  // Police operations
  getPoliceOfficers: () => users.filter(u => u.role === 'police'),
  getPoliceOfficerById: (id) => users.find(u => u.id === id && u.role === 'police'),
  updatePoliceOfficerLogin: (id) => {
    const officer = users.find(u => u.id === id && u.role === 'police');
    if (officer) {
      officer.lastLogin = new Date();
    }
    return officer;
  },

  // Admin operations
  getAdminStats: () => {
    return {
      totalUsers: users.filter(u => u.role === 'user').length,
      totalPoliceOfficers: users.filter(u => u.role === 'police').length,
      totalIncidents: incidents.length,
      resolvedIncidents: incidents.filter(i => i.status === 'resolved').length,
      pendingIncidents: incidents.filter(i => i.status === 'reported' || i.status === 'investigating').length,
      totalAlerts: alertLogs.length,
      policeStations: policeStations.length,
    };
  },

  getPoliceOfficersWithStations: () => {
    return users.filter(u => u.role === 'police').map(officer => ({
      ...officer,
      station: policeStations.find(s => s.id === officer.policeStation),
    }));
  },

  getAllIncidentsAdmin: () => incidents.map(incident => ({
    ...incident,
    user: users.find(u => u.id === incident.userId),
  })),
};