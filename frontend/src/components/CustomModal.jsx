// src/components/CustomModal.jsx
import React from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

function CustomModal({
  isOpen,
  title,
  type = 'info', // 'info' | 'success' | 'confirm' | 'error'
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onClose,
  onConfirm,
  children
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(15, 23, 42, 0.4)', // backdrop-blur fallback
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      animation: 'fadeIn 0.2s ease-out'
    }} onClick={onClose}>
      
      {/* Modal Card content wrapper */}
      <div style={{
        backgroundColor: '#ffffff',
        width: '450px',
        maxWidth: '90%',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        animation: 'scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        display: 'flex',
        flexDirection: 'column'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header bar */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fafafb'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '700',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {type === 'success' && <CheckCircle color="var(--success)" size={20} />}
            {type === 'error' && <AlertCircle color="var(--error)" size={20} />}
            {type === 'confirm' && <AlertTriangle color="var(--warning)" size={20} />}
            {type === 'info' && <Info color="var(--primary)" size={20} />}
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content body */}
        <div style={{
          padding: '24px',
          fontSize: '14.5px',
          color: 'var(--text-main)',
          lineHeight: '1.5',
          maxHeight: '350px',
          overflowY: 'auto'
        }}>
          {children}
        </div>

        {/* Footer actions bar */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          backgroundColor: '#fafafb'
        }}>
          {type === 'confirm' ? (
            <>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 18px',
                  backgroundColor: '#ffffff',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontFamily: 'inherit',
                  fontSize: '13px',
                  transition: 'var(--transition)'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                style={{
                  padding: '10px 18px',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontFamily: 'inherit',
                  fontSize: '13px',
                  transition: 'var(--transition)'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontWeight: '600',
                fontFamily: 'inherit',
                fontSize: '13px',
                transition: 'var(--transition)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
            >
              Okay
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomModal;
