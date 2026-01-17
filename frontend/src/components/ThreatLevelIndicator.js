import React, { useState, useEffect } from 'react';

const ThreatLevelIndicator = ({ incidents = [] }) => {
  const [threatLevel, setThreatLevel] = useState('low');
  const [color, setColor] = useState('#4CAF50');

  useEffect(() => {
    if (!incidents || incidents.length === 0) {
      setThreatLevel('low');
      setColor('#4CAF50');
      return;
    }

    const recentIncidents = incidents.filter(i => {
      const incidentTime = new Date(i.createdAt);
      const now = new Date();
      const hoursDiff = (now - incidentTime) / (1000 * 60 * 60);
      return hoursDiff < 24;
    });

    const criticalCount = recentIncidents.filter(i => i.severity === 'critical').length;
    const highCount = recentIncidents.filter(i => i.severity === 'high').length;

    if (criticalCount > 0) {
      setThreatLevel('critical');
      setColor('#FF0000');
    } else if (highCount > 2) {
      setThreatLevel('high');
      setColor('#FF6B00');
    } else if (recentIncidents.length > 5) {
      setThreatLevel('medium');
      setColor('#FFC107');
    } else {
      setThreatLevel('low');
      setColor('#4CAF50');
    }
  }, [incidents]);

  return (
    <div style={{
      padding: '15px 20px',
      backgroundColor: color,
      color: 'white',
      borderRadius: '8px',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: `0 0 10px ${color}80`,
    }}>
      <div>
        <h3 style={{ margin: '0 0 5px 0' }}>Area Safety Level</h3>
        <p style={{ margin: 0 }}>Current threat level: <strong>{threatLevel.toUpperCase()}</strong></p>
      </div>
      <div style={{
        fontSize: '24px',
        fontWeight: 'bold',
        padding: '10px 15px',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {threatLevel === 'critical' ? '🚨' : threatLevel === 'high' ? '⚠️' : threatLevel === 'medium' ? '⚡' : '✓'}
      </div>
    </div>
  );
};

export default ThreatLevelIndicator;
