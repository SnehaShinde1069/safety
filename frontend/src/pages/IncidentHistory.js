import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const IncidentHistory = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await api.getUserIncidents(token, 50);
      setIncidents(data.incidents || []);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return '#28a745';
      case 'investigating':
        return '#ffc107';
      case 'reported':
        return '#007bff';
      default:
        return '#6c757d';
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Incident History</h2>

      {incidents.length === 0 ? (
        <p>No incidents reported.</p>
      ) : (
        <div>
          {incidents.map((incident) => (
            <div
              key={incident._id}
              style={{
                border: '1px solid #ddd',
                padding: '15px',
                marginBottom: '15px',
                borderRadius: '5px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4>{incident.type}</h4>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Severity:</strong> {incident.severity.toUpperCase()}
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Location:</strong> {incident.location?.address || 'Unknown'}
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                    {new Date(incident.timestamp).toLocaleString()}
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor: getStatusColor(incident.status),
                    color: 'white',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    textAlign: 'center',
                    minWidth: '100px',
                  }}
                >
                  {incident.status.toUpperCase()}
                </div>
              </div>
              <p style={{ marginTop: '10px', color: '#555' }}>{incident.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncidentHistory;
