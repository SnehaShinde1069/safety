import React from 'react';

const IncidentTimeline = ({ incidents = [] }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'reported':
        return '📍';
      case 'acknowledged':
        return '✓';
      case 'investigating':
        return '🔍';
      case 'resolved':
        return '✅';
      default:
        return '📌';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reported':
        return '#2196F3';
      case 'acknowledged':
        return '#FF9800';
      case 'investigating':
        return '#F44336';
      case 'resolved':
        return '#4CAF50';
      default:
        return '#666';
    }
  };

  const recentIncidents = incidents.slice(0, 5);

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      marginTop: '20px',
    }}>
      <h3 style={{ marginTop: 0 }}>Incident Timeline</h3>
      {recentIncidents.length === 0 ? (
        <p style={{ color: '#666' }}>No incidents</p>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '40px' }}>
          {recentIncidents.map((incident, index) => (
            <div key={incident.id} style={{ marginBottom: '20px', position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '-40px',
                  top: 0,
                  width: '24px',
                  height: '24px',
                  backgroundColor: getStatusColor(incident.status),
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                {getStatusIcon(incident.status)}
              </div>
              {index < recentIncidents.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    left: '-32px',
                    top: '24px',
                    width: '2px',
                    height: '20px',
                    backgroundColor: '#ddd',
                  }}
                />
              )}
              <div style={{
                backgroundColor: 'white',
                padding: '10px 15px',
                borderRadius: '5px',
                border: `1px solid ${getStatusColor(incident.status)}`,
              }}>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                  {incident.type.replace('-', ' ').toUpperCase()}
                </p>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>
                  {incident.description}
                </p>
                <p style={{ margin: 0, fontSize: '11px', color: '#999' }}>
                  Status: <strong>{incident.status}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncidentTimeline;
