import React, { useState } from 'react';
import api from '../utils/api';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login(formData);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        onLoginSuccess();
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (email) => {
    setFormData({ email, password: 'any' });
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 100);
  };

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '50px auto',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#333' }}>🛡️ Safety System</h1>
      <h2 style={{ textAlign: 'center', color: '#666' }}>Login Portal</h2>

      {error && (
        <div
          style={{
            color: '#C62828',
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#FFEBEE',
            borderRadius: '5px',
            border: '1px solid #EF5350',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', color: '#333' }}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', color: '#333' }}>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Quick Login Buttons */}
      <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
        <p style={{ textAlign: 'center', color: '#666', fontWeight: 'bold', marginBottom: '15px' }}>
          📝 Quick Login - Demo Accounts
        </p>

        <div style={{ marginBottom: '12px' }}>
          <button
            onClick={() => quickLogin('test@example.com')}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#E8F5E9',
              color: '#2E7D32',
              border: '2px solid #4CAF50',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            👩 User Dashboard - test@example.com
          </button>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <button
            onClick={() => quickLogin('officer@police.com')}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#FFF3E0',
              color: '#E65100',
              border: '2px solid #FF9800',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            🚔 Police Dashboard - officer@police.com
          </button>
        </div>

        <div>
          <button
            onClick={() => quickLogin('admin@safesystem.com')}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#F3E5F5',
              color: '#6A1B9A',
              border: '2px solid #9C27B0',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            🛡️ Admin Dashboard - admin@safesystem.com
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#E3F2FD',
          borderRadius: '5px',
          border: '1px solid #2196F3',
          fontSize: '12px',
          color: '#1565C0',
        }}
      >
        <strong>Demo Note:</strong> All demo accounts accept any password. Each role has a different dashboard experience.
      </div>
    </div>
  );
};

export default Login;

