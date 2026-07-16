// src/components/OrderSuccessModal.jsx
import React from 'react';
import { CheckCircle2, ArrowRight, ShoppingBag } from 'lucide-react';

function OrderSuccessModal({ onContinueShopping, onViewOrders }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <CheckCircle2 size={56} color="#10b981" />
        </div>
        
        <h2 style={styles.title}>Order Placed Successfully!</h2>
        <p style={styles.message}>
          Thank you for shopping with DermaCare Store. Your clinical skincare formulations are being prepared for fulfillment.
        </p>

        <div style={styles.actionRow}>
          <button onClick={onContinueShopping} className="btn-primary" style={styles.shopBtn}>
            <ShoppingBag size={16} /> Continue Shopping
          </button>
          
          <button onClick={onViewOrders} style={styles.historyBtn}>
            View Order History <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 0',
    animation: 'fadeIn 0.3s ease-out'
  },
  card: {
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: '520px',
    padding: '40px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
    textAlign: 'center',
    boxSizing: 'border-box'
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 12px 0',
    letterSpacing: '-0.5px'
  },
  message: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.6',
    margin: '0 0 30px 0'
  },
  actionRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  shopBtn: {
    width: '100%',
    padding: '12px',
    fontSize: '15px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  historyBtn: {
    width: '100%',
    background: '#f1f5f9',
    color: '#334155',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'background-color 0.2s'
  }
};

export default OrderSuccessModal;