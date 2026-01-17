import React, { useState, useEffect } from 'react';
import SOSButton from '../components/SOSButton';
import ThreatLevelIndicator from '../components/ThreatLevelIndicator';
import QuickContacts from '../components/QuickContacts';
import IncidentTimeline from '../components/IncidentTimeline';
import LocationLiveShare from '../components/LocationLiveShare';
import ZPatternDetector from '../components/ZPatternDetector';

const UserDashboard = ({ user }) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/dashboard/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch dashboard');
        const data = await response.json();
        setDashboard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading dashboard...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ marginTop: 0 }}>👩 Welcome, {user?.fullName || 'User'}</h1>
        <p style={{ color: '#666' }}>User Dashboard - Stay Safe</p>
      </div>

      {/* SOS Button Section */}
      <div
        style={{
          backgroundColor: '#fff3cd',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '2px solid #ffc107',
        }}
      >
        <SOSButton
          onEmergency={() => {
            alert('🚨 Emergency alert sent! Help is on the way!');
          }}
        />
      </div>

      {/* Threat Level and Location Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '20px',
        }}
      >
        <ThreatLevelIndicator dashboard={dashboard} />
        <LocationLiveShare />
      </div>

      {/* Statistics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            backgroundColor: '#E3F2FD',
            padding: '20px',
            borderRadius: '8px',
            borderLeft: '4px solid #2196F3',
          }}
        >
          <div style={{ fontSize: '14px', color: '#666' }}>Total Incidents</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2196F3' }}>
            {dashboard?.statistics?.totalIncidents || 0}
          </div>
        </div>
        <div
          style={{
            backgroundColor: '#F3E5F5',
            padding: '20px',
            borderRadius: '8px',
            borderLeft: '4px solid #9C27B0',
          }}
        >
          <div style={{ fontSize: '14px', color: '#666' }}>Resolved</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#9C27B0' }}>
            {dashboard?.statistics?.resolvedIncidents || 0}
          </div>
        </div>
        <div
          style={{
            backgroundColor: '#FCE4EC',
            padding: '20px',
            borderRadius: '8px',
            borderLeft: '4px solid #E91E63',
          }}
        >
          <div style={{ fontSize: '14px', color: '#666' }}>Pending</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#E91E63' }}>
            {dashboard?.statistics?.pendingIncidents || 0}
          </div>
        </div>
        <div
          style={{
            backgroundColor: '#E8F5E9',
            padding: '20px',
            borderRadius: '8px',
            borderLeft: '4px solid #4CAF50',
          }}
        >
          <div style={{ fontSize: '14px', color: '#666' }}>Contacts</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4CAF50' }}>
            {dashboard?.emergencyContactsCount || 0}
          </div>
        </div>
      </div>

      {/* Quick Contacts */}
      {dashboard?.emergencyContacts && <QuickContacts dashboard={dashboard} />}

      {/* Incident Timeline */}
      {dashboard?.recentIncidents && <IncidentTimeline incidents={dashboard.recentIncidents} />}

      {/* Z-Pattern Detector */}
      <ZPatternDetector
        onPatternDetected={() => {
          alert('🚨 Z-Pattern detected! Emergency triggered!');
        }}
      />
    </div>
  );
};

export default UserDashboard;
