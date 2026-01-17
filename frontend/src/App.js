import React, { useState } from 'react';
import './App.css';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import PoliceDashboard from './pages/PoliceDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EmergencyContacts from './pages/EmergencyContacts';
import IncidentHistory from './pages/IncidentHistory';
import SafetyStats from './pages/SafetyStats';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState('dashboard');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  const renderPage = () => {
    // Role-based dashboard routing
    if (currentPage === 'dashboard') {
      if (user.role === 'admin') {
        return <AdminDashboard user={user} />;
      } else if (user.role === 'police') {
        return <PoliceDashboard user={user} />;
      } else {
        return <UserDashboard user={user} />;
      }
    }

    // Other pages
    switch (currentPage) {
      case 'contacts':
        return <EmergencyContacts />;
      case 'history':
        return <IncidentHistory />;
      case 'statistics':
        return <SafetyStats />;
      default:
        return user.role === 'admin' ? 
          <AdminDashboard user={user} /> : 
          user.role === 'police' ? 
          <PoliceDashboard user={user} /> :
          <UserDashboard user={user} />;
    }
  };

  const getNavigationButtons = () => {
    if (user.role === 'admin') {
      return (
        <>
          <button
            onClick={() => setCurrentPage('dashboard')}
            style={{
              marginRight: '10px',
              padding: '8px 15px',
              backgroundColor: currentPage === 'dashboard' ? '#007bff' : 'transparent',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '3px',
            }}
          >
            🛡️ Admin Dashboard
          </button>
        </>
      );
    } else if (user.role === 'police') {
      return (
        <>
          <button
            onClick={() => setCurrentPage('dashboard')}
            style={{
              marginRight: '10px',
              padding: '8px 15px',
              backgroundColor: currentPage === 'dashboard' ? '#007bff' : 'transparent',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '3px',
            }}
          >
            🚔 Police Dashboard
          </button>
        </>
      );
    } else {
      return (
        <>
          <button
            onClick={() => setCurrentPage('dashboard')}
            style={{
              marginRight: '10px',
              padding: '8px 15px',
              backgroundColor: currentPage === 'dashboard' ? '#007bff' : 'transparent',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '3px',
            }}
          >
            👩 Dashboard
          </button>
          <button
            onClick={() => setCurrentPage('contacts')}
            style={{
              marginRight: '10px',
              padding: '8px 15px',
              backgroundColor: currentPage === 'contacts' ? '#007bff' : 'transparent',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '3px',
            }}
          >
            Emergency Contacts
          </button>
          <button
            onClick={() => setCurrentPage('history')}
            style={{
              marginRight: '10px',
              padding: '8px 15px',
              backgroundColor: currentPage === 'history' ? '#007bff' : 'transparent',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '3px',
            }}
          >
            Incident History
          </button>
          <button
            onClick={() => setCurrentPage('statistics')}
            style={{
              marginRight: '10px',
              padding: '8px 15px',
              backgroundColor: currentPage === 'statistics' ? '#007bff' : 'transparent',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '3px',
            }}
          >
            📊 Statistics
          </button>
        </>
      );
    }
  };

  return (
    <div className="app">
      <nav
        style={{
          backgroundColor: '#333',
          color: 'white',
          padding: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ margin: 0, marginRight: '20px', display: 'inline-block' }}>
            🛡️ Safety System
          </h1>
          <span style={{ fontSize: '12px', color: '#aaa' }}>
            Logged in as: <strong>{user?.fullName}</strong> ({user?.role?.toUpperCase()})
          </span>
        </div>
        <div>
          {getNavigationButtons()}
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 15px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '3px',
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="content">{renderPage()}</div>
    </div>
  );
};

export default App;
