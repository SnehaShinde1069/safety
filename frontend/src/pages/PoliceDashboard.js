import React, { useState, useEffect } from 'react';

const PoliceDashboard = ({ user }) => {
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch incidents
        const incidentsRes = await fetch('http://localhost:5000/api/incidents', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (incidentsRes.ok) {
          const incidentsData = await incidentsRes.json();
          setIncidents(incidentsData.data || []);
        }

        // Fetch police stats
        const statsRes = await fetch('http://localhost:5000/api/police/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading police dashboard...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid #ddd',
        }}
      >
        <div>
          <h1 style={{ marginTop: 0 }}>🚔 Police Officer Dashboard</h1>
          <p style={{ color: '#666', marginBottom: '5px' }}>Officer: {user?.fullName}</p>
          {user?.badgeNumber && <p style={{ color: '#666', marginBottom: '5px' }}>Badge: {user.badgeNumber}</p>}
          {user?.policeStationName && <p style={{ color: '#666', marginBottom: 0 }}>Station: {user.policeStationName}</p>}
        </div>
        <div
          style={{
            backgroundColor: '#E3F2FD',
            padding: '15px 25px',
            borderRadius: '8px',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: '12px', color: '#666' }}>Last Login</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#2196F3' }}>
            {formatDate(user?.lastLogin)}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        <div
          style={{
            backgroundColor: '#E3F2FD',
            padding: '25px',
            borderRadius: '8px',
            borderLeft: '5px solid #2196F3',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>Total Incidents</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2196F3' }}>
            {stats?.totalIncidents || 0}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFF3E0',
            padding: '25px',
            borderRadius: '8px',
            borderLeft: '5px solid #FF9800',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>In Progress</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#FF9800' }}>
            {stats?.pendingIncidents || 0}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#E8F5E9',
            padding: '25px',
            borderRadius: '8px',
            borderLeft: '5px solid #4CAF50',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>Resolved</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#4CAF50' }}>
            {stats?.resolvedIncidents || 0}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FCE4EC',
            padding: '25px',
            borderRadius: '8px',
            borderLeft: '5px solid #E91E63',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>Alerts Received</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#E91E63' }}>
            {stats?.alertsReceived || 0}
          </div>
        </div>
      </div>

      {/* Active Incidents Table */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #ddd',
          overflow: 'hidden',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            backgroundColor: '#2196F3',
            color: 'white',
            padding: '20px',
            fontWeight: 'bold',
            fontSize: '16px',
          }}
        >
          📋 Active Incidents & Reports
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Incident ID</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Type</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Description</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Date/Time</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {incidents.length > 0 ? (
                incidents.map((incident, index) => (
                  <tr key={incident.id || index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px' }}>{incident.id}</td>
                    <td style={{ padding: '15px' }}>{incident.type || 'Unknown'}</td>
                    <td style={{ padding: '15px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {incident.description}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <span
                        style={{
                          backgroundColor:
                            incident.status === 'resolved'
                              ? '#E8F5E9'
                              : incident.status === 'investigating'
                              ? '#FFF3E0'
                              : '#FCE4EC',
                          color:
                            incident.status === 'resolved'
                              ? '#2E7D32'
                              : incident.status === 'investigating'
                              ? '#E65100'
                              : '#C2185B',
                          padding: '8px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        {incident.status}
                      </span>
                    </td>
                    <td style={{ padding: '15px', fontSize: '12px' }}>
                      {formatDate(incident.createdAt)}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <button
                        style={{
                          padding: '8px 15px',
                          backgroundColor: '#2196F3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                    No incidents reported
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0 }}>⚡ Quick Actions</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
          }}
        >
          <button
            style={{
              padding: '15px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            📍 Patrol Route
          </button>
          <button
            style={{
              padding: '15px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            📡 Request Backup
          </button>
          <button
            style={{
              padding: '15px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            ✅ Mark Available
          </button>
          <button
            style={{
              padding: '15px',
              backgroundColor: '#F44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            🚨 Emergency Alert
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoliceDashboard;
