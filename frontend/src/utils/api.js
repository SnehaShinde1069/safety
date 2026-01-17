const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = {
  // Auth endpoints
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  // User endpoints
  getUserProfile: async (token) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  updateProfile: async (token, profileData) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    return response.json();
  },

  // Emergency contacts
  addEmergencyContact: async (token, contactData) => {
    const response = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });
    return response.json();
  },

  getEmergencyContacts: async (token) => {
    const response = await fetch(`${API_URL}/contacts`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  deleteEmergencyContact: async (token, contactId) => {
    const response = await fetch(`${API_URL}/contacts/${contactId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  // Incidents
  createIncident: async (token, incidentData) => {
    const response = await fetch(`${API_URL}/incidents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incidentData),
    });
    return response.json();
  },

  getUserIncidents: async (token, limit = 20) => {
    const response = await fetch(`${API_URL}/incidents/user/list?limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  getIncident: async (token, incidentId) => {
    const response = await fetch(`${API_URL}/incidents/${incidentId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  // Dashboard
  getUserDashboard: async (token) => {
    const response = await fetch(`${API_URL}/dashboard/user`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  getPoliceStations: async () => {
    const response = await fetch(`${API_URL}/police`);
    return response.json();
  },

  // Alert history
  getAlertHistory: async (token) => {
    const response = await fetch(`${API_URL}/alerts/history`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },
};

export default api;
