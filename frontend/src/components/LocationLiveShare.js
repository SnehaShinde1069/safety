import React, { useState, useEffect } from 'react';

const LocationLiveShare = () => {
  const [location, setLocation] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState(null);

  const startLocationSharing = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setIsSharing(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setError(null);
      },
      (err) => {
        setError('Unable to get location');
        console.error(err);
      }
    );
  };

  const stopLocationSharing = () => {
    setIsSharing(false);
    setLocation(null);
  };

  return (
    <div style={{
      padding: '15px 20px',
      backgroundColor: isSharing ? '#E8F5E9' : '#FFF9C4',
      borderRadius: '8px',
      marginBottom: '20px',
      border: `2px solid ${isSharing ? '#4CAF50' : '#FF9800'}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ margin: '0 0 5px 0' }}>
            {isSharing ? '📍 Live Location Sharing' : '📍 Share Your Location'}
          </h4>
          {location && (
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
              Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)} 
              <br/>
              Accuracy: ±{location.accuracy.toFixed(0)}m
            </p>
          )}
          {error && (
            <p style={{ margin: 0, fontSize: '12px', color: '#f44336' }}>{error}</p>
          )}
        </div>
        <button
          onClick={isSharing ? stopLocationSharing : startLocationSharing}
          style={{
            padding: '10px 20px',
            backgroundColor: isSharing ? '#f44336' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {isSharing ? 'Stop Sharing' : 'Start Sharing'}
        </button>
      </div>
    </div>
  );
};

export default LocationLiveShare;
