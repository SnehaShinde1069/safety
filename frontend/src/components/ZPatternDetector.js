import React, { useRef, useState, useEffect, useCallback } from 'react';

const ZPatternDetector = ({ onPatternDetected }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState([]);
  const [detectionResult, setDetectionResult] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f9f9f9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw instructions
    ctx.fillStyle = '#999';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    if (points.length === 0) {
      ctx.fillText('Draw a Z pattern to trigger emergency', canvas.width / 2, 25);
      ctx.fillText('(Start top-left, go to top-right, then diagonal, then bottom-left to bottom-right)', canvas.width / 2, 50);
    }

    // Draw points and lines
    if (points.length > 0) {
      ctx.strokeStyle = '#ff3333';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      // Draw point circles
      ctx.fillStyle = '#ff3333';
      points.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Draw point number
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(index + 1, point.x, point.y);
        ctx.fillStyle = '#ff3333';
      });
    }
  }, [points]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width - 20;
      canvas.height = isMobile ? 400 : 300;
      redrawCanvas();
    }
  }, [isMobile, redrawCanvas]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);
    resizeCanvas();
    return () => window.removeEventListener('resize', handleResize);
  }, [resizeCanvas]);

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    let x, y;
    if (e.touches) {
      // Touch event
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    return { x, y };
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const coords = getCanvasCoordinates(e);
    setPoints([coords]);
    setDetectionResult(null);
  };

  const handleTouchMove = (e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const coords = getCanvasCoordinates(e);
    setPoints((prev) => {
      const newPoints = [...prev, coords];
      // Limit points to prevent memory issues
      return newPoints.slice(-200);
    });
  };

  const handleTouchEnd = async (e) => {
    e.preventDefault();
    setIsDrawing(false);

    if (points.length < 4) {
      setDetectionResult('Pattern too short. Please draw a longer Z pattern.');
      return;
    }

    // Send to backend for detection
    try {
      const response = await fetch('http://localhost:5001/api/z-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points }),
      });

      const data = await response.json();

      if (data.z_pattern_detected) {
        setDetectionResult('✅ Z-Pattern Detected! Emergency triggered!');
        if (onPatternDetected) {
          onPatternDetected(true);
        }
      } else {
        setDetectionResult('❌ Pattern not recognized. Try again.');
      }
    } catch (error) {
      // Offline mode - use local validation
      const isZPattern = validateZPattern(points);
      if (isZPattern) {
        setDetectionResult('✅ Z-Pattern Detected! Emergency triggered!');
        if (onPatternDetected) {
          onPatternDetected(true);
        }
      } else {
        setDetectionResult('❌ Pattern not recognized. Try drawing a clearer Z shape.');
      }
    }
  };

  const validateZPattern = (pts) => {
    if (pts.length < 4) return false;

    // Check if pattern spans enough distance (Z pattern should be fairly large)
    const minWidth = 50;
    const minHeight = 50;

    const width = Math.max(...pts.map(p => p.x)) - Math.min(...pts.map(p => p.x));
    const height = Math.max(...pts.map(p => p.y)) - Math.min(...pts.map(p => p.y));

    return width >= minWidth && height >= minHeight && pts.length >= 10;
  };

  const clearCanvas = () => {
    setPoints([]);
    setDetectionResult(null);
    redrawCanvas();
  };

  useEffect(() => {
    redrawCanvas();
  }, [points, redrawCanvas]);

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        marginTop: '20px',
        textAlign: 'center',
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: '10px' }}>
        🔷 Z-Pattern Emergency Trigger
      </h2>
      <p style={{ color: '#666', marginBottom: '15px' }}>
        {isMobile
          ? 'Swipe a Z pattern on your screen to trigger emergency'
          : 'Draw a Z pattern with your mouse or finger'}
      </p>

      <div
        style={{
          position: 'relative',
          marginBottom: '15px',
          backgroundColor: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '2px solid #ddd',
          padding: '10px',
        }}
      >
        <canvas
          ref={canvasRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
          style={{
            display: 'block',
            width: '100%',
            touchAction: 'none',
            cursor: 'crosshair',
          }}
        />
      </div>

      {detectionResult && (
        <div
          style={{
            padding: '15px',
            marginBottom: '15px',
            backgroundColor: detectionResult.includes('✅') ? '#E8F5E9' : '#FFEBEE',
            border: `2px solid ${detectionResult.includes('✅') ? '#4CAF50' : '#f44336'}`,
            borderRadius: '8px',
            color: detectionResult.includes('✅') ? '#2E7D32' : '#C62828',
            fontWeight: 'bold',
          }}
        >
          {detectionResult}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={clearCanvas}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          Clear Canvas
        </button>
        <button
          onClick={() => onPatternDetected(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          Test Emergency (Manual)
        </button>
      </div>

      <div
        style={{
          marginTop: '15px',
          padding: '15px',
          backgroundColor: '#FFF3CD',
          borderRadius: '8px',
          border: '1px solid #FFC107',
          textAlign: 'left',
          fontSize: '13px',
          color: '#856404',
        }}
      >
        <strong>📝 Instructions:</strong>
        <ol style={{ margin: '10px 0 0 0', paddingLeft: '20px' }}>
          <li>Draw the letter Z on the screen</li>
          <li>Start from top-left corner</li>
          <li>Move diagonally to bottom-right</li>
          <li>Complete the Z pattern smoothly</li>
          <li>System will detect and trigger emergency alert</li>
        </ol>
      </div>

      <div
        style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#E3F2FD',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#1976D2',
        }}
      >
        📱 <strong>Mobile Optimized:</strong> Works with touch on smartphones and tablets
      </div>
    </div>
  );
};

export default ZPatternDetector;
