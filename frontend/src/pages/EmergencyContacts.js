import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: 'friend',
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await api.getEmergencyContacts(token);
      setContacts(data.contacts || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.addEmergencyContact(token, formData);
      setFormData({ name: '', phone: '', email: '', relationship: 'friend' });
      setShowForm(false);
      fetchContacts();
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleDelete = async (contactId) => {
    try {
      const token = localStorage.getItem('token');
      await api.deleteEmergencyContact(token, contactId);
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Emergency Contacts</h2>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          Add Contact
        </button>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            border: '1px solid #ddd',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '20px',
          }}
        >
          <div style={{ marginBottom: '10px' }}>
            <label>Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Phone:</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Relationship:</label>
            <select
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option>parent</option>
              <option>sibling</option>
              <option>friend</option>
              <option>relative</option>
              <option>other</option>
            </select>
          </div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Save Contact
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            style={{
              marginLeft: '10px',
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </form>
      )}

      <div>
        <h3>Your Contacts ({contacts.length})</h3>
        {contacts.length === 0 ? (
          <p>No emergency contacts added yet.</p>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact._id}
              style={{
                border: '1px solid #ddd',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '5px',
              }}
            >
              <h4>{contact.name}</h4>
              <p>Phone: {contact.phone}</p>
              <p>Email: {contact.email || 'N/A'}</p>
              <p>Relationship: {contact.relationship}</p>
              <button
                onClick={() => handleDelete(contact._id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmergencyContacts;
