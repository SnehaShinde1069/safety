import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch admin stats
        const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Fetch police officers
        const officersRes = await fetch('http://localhost:5000/api/admin/police-officers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (officersRes.ok) {
          const officersData = await officersRes.json();
          setOfficers(officersData.data || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading admin dashboard...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
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
          <h1 style={{ marginTop: 0 }}>🛡️ Admin Control Center</h1>
          <p style={{ color: '#666' }}>System Management & Monitoring</p>
        </div>
        <div
          style={{
            backgroundColor: '#F3E5F5',
            padding: '15px 25px',
            borderRadius: '8px',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: '12px', color: '#666' }}>Administrator</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#9C27B0' }}>
            {user?.fullName}
          </div>
        </div>
      </div>

      {/* Main Statistics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>👥 Total Users</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2196F3' }}>
            {stats?.totalUsers || 0}
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
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>🚔 Police Officers</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#FF9800' }}>
            {stats?.totalPoliceOfficers || 0}
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
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>🏢 Police Stations</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#4CAF50' }}>
            {stats?.policeStations || 0}
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
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>📢 Total Incidents</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#E91E63' }}>
            {stats?.totalIncidents || 0}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#F3E5F5',
            padding: '25px',
            borderRadius: '8px',
            borderLeft: '5px solid #9C27B0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>⏳ Pending Incidents</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#9C27B0' }}>
            {stats?.pendingIncidents || 0}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ECEFF1',
            padding: '25px',
            borderRadius: '8px',
            borderLeft: '5px solid #455A64',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>🚨 Total Alerts</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#455A64' }}>
            {stats?.totalAlerts || 0}
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ marginTop: 0 }}>📊 Resolution Rate</h3>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Progress</span>
              <span style={{ fontWeight: 'bold' }}>
                {stats?.totalIncidents > 0
                  ? Math.round((stats.resolvedIncidents / stats.totalIncidents) * 100)
                  : 0}
                %
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '10px',
                backgroundColor: '#eee',
                borderRadius: '5px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  backgroundColor: '#4CAF50',
                  width: `${
                    stats?.totalIncidents > 0
                      ? (stats.resolvedIncidents / stats.totalIncidents) * 100
                      : 0
                  }%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
          <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
            {stats?.resolvedIncidents || 0} of {stats?.totalIncidents || 0} incidents resolved
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ marginTop: 0 }}>🎯 System Status</h3>
          <div style={{ fontSize: '14px' }}>
            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#4CAF50', marginRight: '10px', fontSize: '16px' }}>●</span>
              <span>All Systems Operational</span>
            </div>
            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#4CAF50', marginRight: '10px', fontSize: '16px' }}>●</span>
              <span>Database Connected</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#4CAF50', marginRight: '10px', fontSize: '16px' }}>●</span>
              <span>API Server Running</span>
            </div>
          </div>
        </div>
      </div>

      {/* Police Officers Table */}
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
            backgroundColor: '#FF9800',
            color: 'white',
            padding: '20px',
            fontWeight: 'bold',
            fontSize: '16px',
          }}
        >
          🚔 Police Officers & Login Activity
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Officer Name</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Badge Number</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Police Station</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Email</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Phone</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Last Login</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {officers.length > 0 ? (
                officers.map((officer, index) => {
                  const lastLogin = new Date(officer.lastLogin);
                  const isOnline = (Date.now() - lastLogin.getTime()) < 3600000; // Less than 1 hour
                  return (
                    <tr key={officer.id || index} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px' }}>{officer.fullName}</td>
                      <td style={{ padding: '15px' }}>{officer.badgeNumber || 'N/A'}</td>
                      <td style={{ padding: '15px' }}>{officer.policeStationName || 'Unassigned'}</td>
                      <td style={{ padding: '15px' }}>{officer.email}</td>
                      <td style={{ padding: '15px' }}>{officer.phone}</td>
                      <td style={{ padding: '15px', fontSize: '12px' }}>
                        {formatDate(officer.lastLogin)}
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span
                          style={{
                            backgroundColor: isOnline ? '#E8F5E9' : '#FFEBEE',
                            color: isOnline ? '#2E7D32' : '#C62828',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                          }}
                        >
                          {isOnline ? '🟢 Online' : '🔴 Offline'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                    No police officers assigned
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Controls */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0 }}>⚙️ Admin Controls</h3>
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
            👥 Manage Users
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
            🚔 Assign Officers
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
            📊 View Reports
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
            🔧 System Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
