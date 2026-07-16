// src/components/ErrorAlert.jsx
import React from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';

function ErrorAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div style={styles.errorBanner}>
      <div style={styles.leftContainer}>
        <AlertTriangle size={20} color="#dc2626" />
        <span style={styles.errorMessage}>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} style={styles.closeBtn}>
          <XCircle size={16} color="#94a3b8" />
        </button>
      )}
    </div>
  );
}

const styles = {
  errorBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    border: '1px solid #fee2e2',
    padding: '14px 20px',
    borderRadius: '8px',
    marginBottom: '20px',
    animation: 'slideIn 0.3s ease-out'
  },
  leftContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  errorMessage: {
    fontSize: '14px',
    color: '#991b1b',
    fontWeight: '500'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center'
  }
};

export default ErrorAlert;