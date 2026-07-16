// src/components/Login.jsx
import React, { useState } from 'react';
import ErrorAlert from './ErrorAlert';

function Login({ onLoginSuccess, onNavigateToRegister }) {
  // Field keys map perfectly to name="username" and name="password" from login.html
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid email or password configuration.");
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        alert("Authentication successful!");
        
        // Pass the backend user role and username details back to App.jsx
        const userRole = data.role || 'CUSTOMER'; 
        onLoginSuccess(userRole, data.username);
      })
      .catch((err) => {
        setLoading(false);
        setError("Invalid credentials. Please verify your email and security password.");
      });
  };

  return (
    <div style={styles.authWrapper}>
      <div style={styles.authCard}>
        <div style={styles.brandZone}>
          <h2 style={styles.brandTitle}>Login</h2>
          <p style={styles.brandSubtitle}>Access your customized DermaCare storefront portal</p>
        </div>

        <ErrorAlert message={error} onClose={() => setError('')} />
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@domain.com" 
              value={formData.username} 
              onChange={(e) => { setError(''); setFormData({ ...formData, username: e.target.value }); }} 
              required 
              style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Security Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={formData.password} 
              onChange={(e) => { setError(''); setFormData({ ...formData, password: e.target.value }); }} 
              required 
              style={styles.input} 
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Verifying Credentials...' : 'Sign In to Account'}
          </button>
        </form>

        <p style={styles.footerText}>
          New to the system?{' '}
          <span onClick={onNavigateToRegister} style={styles.link}>Create New Account</span>
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
    width: '400px',
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
    color: '#0f172a',
    transition: 'all 0.2s ease'
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

export default Login;