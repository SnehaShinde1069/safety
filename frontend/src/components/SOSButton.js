import React, { useState } from 'react';

const SOSButton = ({ onEmergency }) => {
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleSOSClick = () => {
    if (!isActive) {
      setIsActive(true);
      let counter = 3;
      
      const interval = setInterval(() => {
        setCountdown(counter);
        counter--;
        
        if (counter < 0) {
          clearInterval(interval);
          onEmergency();
          setIsActive(false);
          setCountdown(3);
        }
      }, 1000);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '20px 0',
    }}>
      <button
        onClick={handleSOSClick}
        style={{
          width: isActive ? '150px' : '120px',
          height: isActive ? '150px' : '120px',
          borderRadius: '50%',
          backgroundColor: isActive ? '#ff4444' : '#ff0000',
          color: 'white',
          border: 'none',
          fontSize: isActive ? '48px' : '36px',
          fontWeight: 'bold',
          cursor: isActive ? 'default' : 'pointer',
          boxShadow: isActive 
            ? '0 0 20px rgba(255, 0, 0, 0.8), inset 0 0 10px rgba(0,0,0,0.3)'
            : '0 0 10px rgba(255, 0, 0, 0.5)',
          transition: 'all 0.3s ease',
          animation: isActive ? 'pulse 0.6s infinite' : 'none',
        }}
      >
        {isActive ? countdown : 'SOS'}
      </button>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default SOSButton;
