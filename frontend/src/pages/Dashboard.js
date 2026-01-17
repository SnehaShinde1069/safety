import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import ZPatternDetector from '../components/ZPatternDetector';
import SOSButton from '../components/SOSButton';
import ThreatLevelIndicator from '../components/ThreatLevelIndicator';
import QuickContacts from '../components/QuickContacts';
import IncidentTimeline from '../components/IncidentTimeline';
import LocationLiveShare from '../components/LocationLiveShare';

const Dashboard = ({ user }) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Fetching dashboard with token:', token ? 'YES' : 'NO');
        const data = await api.getUserDashboard(token);
        console.log('Dashboard data received:', data);
        setDashboard(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        setError(error.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleEmergency = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const token = localStorage.getItem('token');
        const incidentData = {
          type: 'z-pattern-trigger',
          description: 'Emergency alert triggered via Z-pattern detection',
          location: {
            address: 'Current Location',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          severity: 'critical',
        };

        try {
          const response = await api.createIncident(token, incidentData);
          if (response.incident) {
            alert('Emergency alert sent successfully!');
          }
        } catch (error) {
          console.error('Error creating incident:', error);
          alert('Failed to send emergency alert');
        }
      },
      (error) => {
        alert('Unable to get location: ' + error.message);
      }
    );
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading dashboard...</div>;

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>
      <h2>Error loading dashboard</h2>
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🛡️ Welcome, {user?.fullName}</h1>

      {dashboard ? (
        <div>
          {/* SOS BUTTON - PROMINENT */}
          <div style={{ 
            backgroundColor: '#fff3cd', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '2px solid #ff6b6b'
          }}>
            <h2 style={{ textAlign: 'center', margin: '0 0 10px 0' }}>⚡ Quick Emergency Access</h2>
            <SOSButton onEmergency={handleEmergency} />
          </div>

          {/* THREAT LEVEL */}
          <ThreatLevelIndicator incidents={dashboard.recentIncidents} />

          {/* LOCATION SHARING */}
          <LocationLiveShare />

          {/* STATISTICS DASHBOARD */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '15px',
            marginBottom: '30px',
          }}>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#E3F2FD',
              border: '2px solid #2196F3',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h2 style={{ margin: '0', color: '#2196F3' }}>{dashboard.statistics?.totalIncidents || 0}</h2>
              <p style={{ margin: '5px 0 0 0', color: '#666' }}>Total Incidents</p>
            </div>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#F3E5F5',
              border: '2px solid #9C27B0',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h2 style={{ margin: '0', color: '#9C27B0' }}>{dashboard.statistics?.resolvedIncidents || 0}</h2>
              <p style={{ margin: '5px 0 0 0', color: '#666' }}>Resolved</p>
            </div>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#FCE4EC',
              border: '2px solid #E91E63',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h2 style={{ margin: '0', color: '#E91E63' }}>{dashboard.statistics?.pendingIncidents || 0}</h2>
              <p style={{ margin: '5px 0 0 0', color: '#666' }}>Pending</p>
            </div>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#E8F5E9',
              border: '2px solid #4CAF50',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h2 style={{ margin: '0', color: '#4CAF50' }}>{dashboard.emergencyContactsCount || 0}</h2>
              <p style={{ margin: '5px 0 0 0', color: '#666' }}>Emergency Contacts</p>
            </div>

          </div>

          {/* QUICK CONTACTS */}
          <QuickContacts contacts={dashboard.emergencyContacts} />

          {/* INCIDENT TIMELINE */}
          <IncidentTimeline incidents={dashboard.recentIncidents} />

          {/* Z-PATTERN DETECTOR */}
          <div style={{ marginTop: '30px' }}>
            <h3>🔷 Z-Pattern Emergency Unlock</h3>
            <ZPatternDetector onPatternDetected={handleEmergency} />
          </div>
        </div>
      ) : (
        <div>No dashboard data</div>
      )}
    </div>
  );
};

export default Dashboard;
