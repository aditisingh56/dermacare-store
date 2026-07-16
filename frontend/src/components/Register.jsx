// src/components/Register.jsx
import React, { useState } from 'react';
import ErrorAlert from './ErrorAlert'; // Imported the new dynamic alert component!

function Register({ onNavigateToLogin }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // State hook to store error logs dynamically

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear past errors on click

    fetch('http://localhost:8080/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          alert(data.message || "Registration Successful!");
          onNavigateToLogin(); 
        } else {
          // Instead of a broad browser window alert, capture the error string locally!
          setError(data.message || "Registration Failed. Please verify data fields.");
        }
      })
      .catch((err) => {
        setLoading(false);
        // Fallback or explicit server-downtime messaging setup
        setError("Unable to connect to the backend server. Please verify your Spring Boot application is active and running.");
      });
  };

  return (
    <div style={styles.authWrapper}>
      <div style={styles.authCard}>
        <div style={styles.brandZone}>
          <h2 style={styles.brandTitle}>DermaCare</h2>
          <p style={styles.brandSubtitle}>Create your practitioner or client clinical account</p>
        </div>

        {/* Dynamic inline alert banner mounts automatically if error state changes */}
        <ErrorAlert message={error} onClose={() => setError('')} />
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Profile Username</label>
            <input type="text" placeholder="e.g., keerthipriya" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input type="email" placeholder="name@domain.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Secure Password</label>
            <input type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required style={styles.input} />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Generating Security Context...' : 'Complete System Registration'}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have a verified account?{' '}
          <span onClick={onNavigateToLogin} style={styles.link}>Sign In</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  authWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#f0fdfa', // var(--primary-light) fallback
    margin: 0,
    fontFamily: "'Outfit', sans-serif"
  },
  authCard: {
    width: '440px',
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
    border: '1px solid #e2e8f0',
    boxSizing: 'border-box',
    animation: 'fadeIn 0.4s ease-out'
  },
  brandZone: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  brandTitle: {
    margin: '0 0 6px 0',
    fontSize: '32px',
    fontWeight: '800',
    color: '#0d9488', // var(--primary)
    letterSpacing: '-0.5px'
  },
  brandSubtitle: {
    margin: 0,
    fontSize: '13.5px',
    color: '#64748b',
    lineHeight: '1.4'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  input: {
    padding: '12px 14px',
    border: '1.5px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s ease',
    color: '#0f172a'
  },
  submitBtn: {
    backgroundColor: '#0d9488',
    color: '#ffffff',
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 10px rgba(13, 148, 136, 0.15)'
  },
  footerText: {
    textAlign: 'center',
    marginTop: '25px',
    fontSize: '14px',
    color: '#64748b',
    margin: '25px 0 0 0'
  },
  link: {
    color: '#0d9488',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline'
  }
};

export default Register;