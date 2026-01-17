import React from 'react';

const QuickContacts = ({ contacts = [] }) => {
  const handleCall = (phone) => {
    if (phone) {
      alert(`Dialing: ${phone}\n\nIn a real app, this would trigger a phone call.`);
      // In production: window.location.href = `tel:${phone}`;
    }
  };

  const handleSMS = (phone) => {
    if (phone) {
      alert(`SMS to: ${phone}\n\nIn a real app, this would open SMS.`);
      // In production: window.location.href = `sms:${phone}`;
    }
  };

  const topContacts = contacts.slice(0, 3);

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      marginTop: '20px',
    }}>
      <h3 style={{ marginTop: 0 }}>Quick Emergency Contacts</h3>
      {topContacts.length === 0 ? (
        <p style={{ color: '#666' }}>No emergency contacts added yet</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '10px',
        }}>
          {topContacts.map((contact) => (
            <div
              key={contact.id}
              style={{
                padding: '10px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #ddd',
                textAlign: 'center',
              }}
            >
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{contact.name}</p>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666' }}>
                {contact.relationship}
              </p>
              <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                <button
                  onClick={() => handleCall(contact.phone)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  📞 Call
                </button>
                <button
                  onClick={() => handleSMS(contact.phone)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  💬 SMS
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickContacts;
