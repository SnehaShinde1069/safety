import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const SafetyStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await api.getUserDashboard(token);
        setStats(data?.statistics);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading statistics...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>📊 Safety Statistics</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: '#E3F2FD',
          borderRadius: '8px',
          border: '2px solid #2196F3',
        }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>TOTAL INCIDENTS</p>
          <h2 style={{ margin: '10px 0 0 0', color: '#2196F3' }}>
            {stats?.totalIncidents || 0}
          </h2>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#F3E5F5',
          borderRadius: '8px',
          border: '2px solid #9C27B0',
        }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>RESOLVED</p>
          <h2 style={{ margin: '10px 0 0 0', color: '#9C27B0' }}>
            {stats?.resolvedIncidents || 0}
          </h2>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#FCE4EC',
          borderRadius: '8px',
          border: '2px solid #E91E63',
        }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>PENDING</p>
          <h2 style={{ margin: '10px 0 0 0', color: '#E91E63' }}>
            {stats?.pendingIncidents || 0}
          </h2>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#F1F8E9',
          borderRadius: '8px',
          border: '2px solid #4CAF50',
        }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>RESOLUTION RATE</p>
          <h2 style={{ margin: '10px 0 0 0', color: '#4CAF50' }}>
            {stats?.resolutionRate || '0%'}
          </h2>
        </div>
      </div>

      <div style={{
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
      }}>
        <h3>📈 Key Metrics</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Your safety profile is <strong>ACTIVE</strong> ✓</li>
          <li>Emergency contacts on file: <strong>Your configured contacts</strong></li>
          <li>Location sharing: <strong>Available</strong></li>
          <li>Response time to incidents: <strong>Real-time</strong></li>
        </ul>
      </div>
    </div>
  );
};

export default SafetyStats;
